import json
import logging
from typing import Dict, Any, List

from package_unit.agents.generator_agent import ArtifactGeneratorAgent
from package_unit.agents.validator_agent import ValidatorAgent
from package_unit.agents.reviewer_agent import ReviewerAgent
from package_unit.agents.persistence_agent import PersistenceAgent
from package_unit.services.llm_service import LlmService


class CoordinatorAgent:
    """Coordinator that orchestrates Generator, Validator, Reviewer, and Persistence agents."""

    def __init__(self, llm: LlmService, db: any):
        self.llm = llm
        self.generator = ArtifactGeneratorAgent(llm)
        self.validator = ValidatorAgent(llm)
        self.reviewer = ReviewerAgent(llm)
        self.persistence = PersistenceAgent(db)

    def run_pipeline(self, schema: str, team_id: str, unit_id: int, auth_headers: Dict[str, str]) -> None:
        """Main orchestration pipeline for all chunks in a unit."""
        chunks = self.persistence.artifact_repo.get_pending_chunks(
            schema, team_id, unit_id
        )

        for row in chunks:
            try:
                self.process_log_row(schema, row, auth_headers)
            except Exception:
                logging.exception(
                    "chunk_process_failed",
                    extra={
                        "stage": "artifact_generation",
                        "team_id": team_id,
                        "unit_id": unit_id,
                        "chunk_id": row.get("chunk_id"),
                        "artifact_chunk_log_id": row.get("id"),
                    },
                )

        # Once all chunks are processed, run higher-level steps
        self.recompute_studyguide_subheadings(schema, team_id, unit_id)
        self.consolidate_topics(schema, team_id, unit_id)

    def process_log_row(self, schema: str, log_row: Dict[str, Any], auth_headers: Dict[str, str]) -> dict:
        """Takes a log row, loads the full chunk from DB, and sends to processing."""
        team_id = log_row["team_id"]
        unit_id = log_row["unit_id"]
        file_id = log_row["file_id"]
        chunk_id = log_row["chunk_id"]

        sql = f"""
            SELECT *
            FROM {schema}.chunk
            WHERE team_id = $1 AND unit_id = $2 AND id = $3 AND file_id = $4
            LIMIT 1
        """
        chunk_res = self.persistence.artifact_repo.query(
            sql, [team_id, unit_id, chunk_id, file_id]
        )
        chunk = chunk_res.rows[0] if chunk_res.rows else None
        if not chunk:
            return {}

        return self.process_chunk_data(schema, chunk, auth_headers)

    def process_chunk_data(self, schema: str, chunk: dict, auth_headers: dict) -> dict:
        """Full pipeline for a single chunk (generate → validate → review → persist)."""
        text_length = chunk.get("text_length")
        text = chunk.get("text", "")
        chunk_id, file_id, team_id, unit_id = (
            chunk.get("id"),
            chunk.get("file_id"),
            chunk.get("team_id"),
            chunk.get("unit_id"),
        )

        self.persistence.artifact_repo.update_chunk_status(
            schema, team_id, unit_id, chunk_id, "in_progress"
        )

        raw_output = self.generator.generate(text, text_length)
        artifacts = self.validator.validate_and_repair(raw_output)
        artifacts = self.reviewer.review(artifacts)

        self.persistence.persist_all(
            schema, team_id, unit_id, file_id, chunk_id, artifacts
        )
        self.persistence.artifact_repo.update_chunk_status(
            schema, team_id, unit_id, chunk_id, "completed"
        )

        return artifacts

    def recompute_studyguide_subheadings(self, schema: str, team_id: str, unit_id: int) -> None:
        select_sql = f"""
            SELECT id AS chunk_id, summary
            FROM {schema}.chunk
            WHERE team_id = $1 AND unit_id = $2
            ORDER BY id
        """
        res = self.persistence.artifact_repo.query(
            select_sql, [team_id, unit_id])
        rows = res.rows if getattr(res, "rows", None) is not None else res
        if not rows:
            return

        summaries = [{"chunk_id": r["chunk_id"], "summary": r["summary"]}
                     for r in rows if r.get("summary")]

        if not summaries:
            return

        system_prompt = (
            "You are an assistant that organizes study material. "
            "Do not reorder chunks. Do not hallucinate topics. "
            "Return strictly valid JSON only, no commentary."
            "You are given a sequence of chunk summaries in order. "
            "Group consecutive chunks into sections. "
            "For each section, return a short subheading (max 5 words) "
            "and the list of chunk_ids covered. "
            "Only insert a new subheading when the topic meaningfully changes. "
            "Output strictly valid JSON: an array of objects like:\n"
            "[{\"heading\": \"...\", \"chunk_ids\": [1,2,3]}, ...]"
        )

        user_prompt = (
            "\n\nSummaries:\n" + json.dumps(summaries, indent=2)
        )

        raw_output = self.llm.complete(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ]
        )

        try:
            sections = json.loads(raw_output)
        except json.JSONDecodeError as e:
            logging.error(f"Invalid JSON from LLM during subheadings: {e}")
            return

        # Remove old subheadings
        delete_sql = f"""
            UPDATE {schema}.studyguide
            SET content = (
                SELECT jsonb_agg(block)
                FROM jsonb_array_elements(content::jsonb) block
                WHERE NOT (block->>'type' = 'subheading')
            )
            WHERE team_id = $1 AND unit_id = $2
        """
        self.persistence.artifact_repo.query(delete_sql, [team_id, unit_id])

        # Insert new subheadings
        for section in sections:
            heading = section.get("heading")
            chunk_ids = section.get("chunk_ids", [])
            if not heading or not isinstance(chunk_ids, list):
                continue
            first_chunk_id = chunk_ids[0]
            prepend_sql = f"""
                UPDATE {schema}.studyguide
                SET content = (
                    jsonb_build_array(jsonb_build_object('type','subheading','content',$4::text)) || content::jsonb
                )
                WHERE team_id = $1 AND unit_id = $2 AND chunk_id = $3
            """
            self.persistence.artifact_repo.query(
                prepend_sql, [team_id, unit_id, first_chunk_id, heading]
            )

    # ----------------------------------------------------------------------
    # Topic consolidation
    # ----------------------------------------------------------------------
    def consolidate_topics(self, schema: str, team_id: str, unit_id: int) -> None:
        select_stage_sql = f"""
            SELECT chunk_id, topics
            FROM {schema}.chunk_topic_stage
            WHERE team_id = $1 AND unit_id = $2
            ORDER BY chunk_id
        """
        res = self.persistence.artifact_repo.query(
            select_stage_sql, [team_id, unit_id]
        )
        rows = res.rows if getattr(res, "rows", None) is not None else res

        raw_topic_objs: List[Dict[str, Any]] = []
        for r in rows or []:
            cid = r["chunk_id"] if isinstance(r, dict) else r[0]
            topics = r["topics"] if isinstance(r, dict) else r[1]
            if not isinstance(topics, list):
                continue
            for t in topics:
                if not isinstance(t, dict):
                    continue
                raw_topic_objs.append({
                    "chunk_id": cid,
                    "name": t.get("name"),
                    "description": t.get("description"),
                })

        if not raw_topic_objs:
            return

        # ----------------------------
        # SYSTEM PROMPT
        # ----------------------------
        system_prompt = (
            "You are an assistant that consolidates noisy raw topics into a clean, unified set "
            "of canonical topics. "
            "Do not invent new material. "
            "Group and merge similar topics into canonical ones. "
            "Each chunk must be linked to exactly one primary topic and up to two secondary topics. "
            "Output must be strictly valid JSON following the requested schema."
        )

        # ----------------------------
        # USER PROMPT
        # ----------------------------
        user_prompt = (
            "Here are raw topics extracted from chunks:\n\n"
            f"{json.dumps(raw_topic_objs, indent=2)}\n\n"
            "Produce JSON with two keys:\n"
            "{\n"
            "  \"canonical_topics\": [\n"
            "    {\n"
            "      \"label\": \"short canonical name\",\n"
            "      \"description\": \"one-line description\",\n"
            "      \"source_names\": [\"raw topic name1\", \"raw topic name2\"]\n"
            "    }\n"
            "  ],\n"
            "  \"chunk_topic_links\": [\n"
            "    {\n"
            "      \"chunk_id\": 123,\n"
            "      \"primary\": \"Topic Label\",\n"
            "      \"secondary\": [\"Topic Label B\", \"Topic Label C\"]\n"
            "    }\n"
            "  ]\n"
            "}"
        )

        raw_output = self.llm.complete([
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ])

        try:
            parsed_output = json.loads(raw_output)
            canonical_topics = parsed_output.get("canonical_topics", [])
            chunk_links = parsed_output.get("chunk_topic_links", [])
        except json.JSONDecodeError as e:
            logging.error(
                f"Invalid JSON from LLM during topic consolidation: {e}")
            return

        insert_topic_sql = f"""
            WITH existing AS (
                SELECT id
                FROM {schema}.topic
                WHERE team_id = $1 AND unit_id = $2 AND name = $3
            ),
            updated AS (
                UPDATE {schema}.topic t
                SET description = $4
                WHERE t.id IN (SELECT id FROM existing)
                RETURNING t.id
            ),
            inserted AS (
                INSERT INTO {schema}.topic (team_id, unit_id, name, description)
                SELECT $1, $2, $3, $4
                WHERE NOT EXISTS (SELECT 1 FROM existing)
                RETURNING id
            )
            SELECT id FROM updated
            UNION ALL
            SELECT id FROM inserted
        """

        insert_chunk_topic_sql = f"""
            INSERT INTO {schema}.chunk_topic (team_id, unit_id, chunk_id, topic_id, is_primary)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT DO NOTHING
        """

        canonical_labels: Dict[str, int] = {}

        # Insert canonical topics
        for ct in canonical_topics:
            label = ct.get("label")
            desc = ct.get("description")
            if not label:
                continue

            topic_id = self.persistence.artifact_repo.query(
                insert_topic_sql, [team_id, unit_id, label, desc]
            ).rows[0]["id"]

            canonical_labels[label] = topic_id

        # Insert chunk-topic mappings
        for link in chunk_links:
            cid = link.get("chunk_id")
            primary_label = link.get("primary")
            secondary_labels = link.get("secondary", [])

            if not cid or not primary_label:
                continue

            # Insert primary
            if primary_label in canonical_labels:
                self.persistence.artifact_repo.query(
                    insert_chunk_topic_sql,
                    [team_id, unit_id, cid, canonical_labels[primary_label], True]
                )

            # Insert up to 2 secondary
            for sec_label in secondary_labels[:2]:
                if sec_label in canonical_labels:
                    self.persistence.artifact_repo.query(
                        insert_chunk_topic_sql,
                        [team_id, unit_id, cid, canonical_labels[sec_label], False]
                    )

        # ----------------------------
        # CLEANUP: remove obsolete topics
        # ----------------------------
        if canonical_labels:
            placeholders = ", ".join(
                [f"${i}" for i in range(3, 3 + len(canonical_labels))]
            )
            delete_sql = f"""
                DELETE FROM {schema}.topic t
                WHERE t.team_id = $1
                AND t.unit_id = $2
                AND t.origin = 'auto'
                AND NOT (t.name IN ({placeholders}))
            """
            self.persistence.artifact_repo.query(
                delete_sql, [team_id, unit_id] + list(canonical_labels.keys())
            )

        # ----------------------------
        # CLEANUP: remove orphan topics
        # ----------------------------
        orphan_delete_sql = f"""
            DELETE FROM {schema}.topic t
            WHERE t.team_id = $1
            AND t.unit_id = $2
            AND NOT EXISTS (
                SELECT 1 FROM {schema}.chunk_topic ct
                WHERE ct.team_id = t.team_id
                AND ct.unit_id = t.unit_id
                AND ct.topic_id = t.id
            )
        """
        self.persistence.artifact_repo.query(
            orphan_delete_sql, [team_id, unit_id])
