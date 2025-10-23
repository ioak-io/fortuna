from typing import Any, Dict, List, Optional
from package_unit.persistence.base_repository import BaseRepository


class QuestionRepository(BaseRepository):

    def save(
        self,
        schema: str,
        team_id: str,
        unit_id: int,
        file_id: Optional[int],
        chunk_id: Optional[int],
        questions: List[Dict[str, Any]]
    ):
        if not isinstance(questions, list):
            return

        delete_sql = f"""
            DELETE FROM {schema}.question
            WHERE team_id = $1 AND unit_id = $2 AND file_id = $3 AND chunk_id = $4
        """
        self.query(delete_sql, [team_id, unit_id, file_id, chunk_id])

        insert_sql = f"""
            INSERT INTO {schema}.question
              (team_id, unit_id, file_id, chunk_id, topic_id, question, answer, explanation)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        """

        for q in questions:
            question_text = (q or {}).get("question")
            answer = (q or {}).get("answer")
            explanation = (q or {}).get("explanation")
            # optional support for curriculum-only mode
            topic_id = (q or {}).get("topic_id")

            if not question_text or not answer:
                continue

            self.query(
                insert_sql,
                [
                    team_id,
                    unit_id,
                    file_id,
                    chunk_id,
                    topic_id,
                    question_text,
                    answer,
                    explanation,
                ],
            )
