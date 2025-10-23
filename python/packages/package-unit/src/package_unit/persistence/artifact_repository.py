from package_unit.persistence.base_repository import BaseRepository


class ArtifactRepository(BaseRepository):

    # def update_chunk_status(self, schema: str, team_id: str, unit_id: int, chunk_id: int, status: str):
    #     sql = f"""
    #         UPDATE {schema}.artifact_chunk_log
    #         SET status = $5, finished_at = CASE WHEN $5 = 'completed' THEN now() ELSE NULL END
    #         WHERE team_id = $1 AND unit_id = $2 AND chunk_id = $3
    #           AND stage = 'artifact_generation'
    #     """
    #     self.query(sql, [team_id, unit_id, chunk_id, schema, status])

    def get_pending_chunks(self, schema: str, team_id: str, unit_id: int):
        sql = f"""
            SELECT *
            FROM {schema}.artifact_chunk_log
            WHERE team_id = $1 AND unit_id = $2
              AND stage = 'artifact_generation'
              AND status IN ('pending','failed','in_progress')
            ORDER BY unit_id, file_id, chunk_id
        """
        return self.query(sql, [team_id, unit_id]).rows

    def update_chunk_status(self, schema: str, team_id: str, unit_id: int, chunk_id: int, status: str):
        sql = f"""
            UPDATE {schema}.artifact_chunk_log
            SET status = $5,
                started_at = CASE WHEN $5 = 'in_progress' THEN now() ELSE started_at END,
                finished_at = CASE WHEN $5 = 'completed' THEN now() ELSE NULL END,
                error_message = NULL
            WHERE team_id = $1 AND unit_id = $2 AND chunk_id = $3
              AND stage = 'artifact_generation'
        """
        self.query(sql, [team_id, unit_id, chunk_id, schema, status])

    def ensure_pipeline_and_sync_chunks(self, schema: str, team_id: str, unit_id: int) -> int:
        """Ensure pipeline_log entry exists, update its status, and sync chunk logs."""
        # 1. Check latest pipeline run
        select_sql = f"""
            SELECT id, status
            FROM {schema}.artifact_pipeline_log
            WHERE team_id = $1 AND unit_id = $2 AND stage = 'artifact_generation'
            ORDER BY id DESC
            LIMIT 1
        """
        res = self.query(select_sql, [team_id, unit_id])
        rows = res.rows if getattr(res, "rows", None) is not None else res
        if rows:
            pipeline_run_id = rows[0]["id"] if isinstance(
                rows[0], dict) else rows[0][0]
            update_sql = f"""
                UPDATE {schema}.artifact_pipeline_log
                SET status = 'in_progress',
                    started_at = COALESCE(started_at, now()),
                    finished_at = NULL,
                    last_updated_at = now(),
                    error_message = NULL
                WHERE id = $1
            """
            self.query(update_sql, [pipeline_run_id])
        else:
            insert_sql = f"""
                INSERT INTO {schema}.artifact_pipeline_log
                  (team_id, unit_id, stage, status, started_at, finished_at, last_updated_at, error_message)
                VALUES ($1, $2, 'artifact_generation', 'in_progress', now(), NULL, now(), NULL)
                RETURNING id
            """
            ins = self.query(insert_sql, [team_id, unit_id])
            pipeline_run_id = ins.rows[0]["id"] if getattr(
                ins, "rows", None) else ins[0]["id"]

        # 2. Load current chunks
        chunks_sql = f"""
            SELECT id, file_id
            FROM {schema}.chunk
            WHERE team_id = $1 AND unit_id = $2
        """
        chunk_res = self.query(chunks_sql, [team_id, unit_id])
        chunk_rows = chunk_res.rows if getattr(
            chunk_res, "rows", None) is not None else chunk_res
        chunk_id_to_file: Dict[int, int] = {}
        current_chunk_ids: List[int] = []
        for r in chunk_rows:
            cid = r["id"] if isinstance(r, dict) else r[0]
            fid = r["file_id"] if isinstance(r, dict) else r[1]
            current_chunk_ids.append(cid)
            chunk_id_to_file[cid] = fid

        # 3. Find existing logs
        existing_sql = f"""
            SELECT chunk_id
            FROM {schema}.artifact_chunk_log
            WHERE pipeline_run_id = $1
        """
        acl_res = self.query(existing_sql, [pipeline_run_id])
        acl_rows = acl_res.rows if getattr(
            acl_res, "rows", None) is not None else acl_res
        existing_chunk_ids: List[int] = [
            (row["chunk_id"] if isinstance(row, dict) else row[0]) for row in acl_rows
        ]

        # 4. Insert missing chunk logs
        to_insert = list(set(current_chunk_ids) - set(existing_chunk_ids))
        if to_insert:
            insert_acl_sql = f"""
                INSERT INTO {schema}.artifact_chunk_log
                  (pipeline_run_id, team_id, unit_id, file_id, chunk_id, stage, status, started_at, finished_at, error_message)
                VALUES ($1, $2, $3, $4, $5, 'artifact_generation', 'pending', NULL, NULL, NULL)
            """
            for cid in to_insert:
                fid = chunk_id_to_file.get(cid)
                if fid is None:
                    continue
                self.query(insert_acl_sql, [
                           pipeline_run_id, team_id, unit_id, fid, cid])

        return pipeline_run_id

    def update_pipeline_status(self, schema: str, team_id: str, unit_id: int, error_message: str) -> int:
        update_sql = f"""
            UPDATE {schema}.artifact_pipeline_log
            SET status = 'completed',
                finished_at = COALESCE(started_at, now()),
                last_updated_at = now(),
                error_message = $3
            WHERE team_id=$1 AND unit_id=$2
        """
        self.query(update_sql, [team_id, unit_id, error_message])
