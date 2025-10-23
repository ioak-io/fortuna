from __future__ import annotations
from typing import Any, Dict, List, Optional
from package_unit.utils.schema import make_schema
from package_unit.utils.sql import load_sql
from package_unit.pipeline.chunk_pipeline import ChunkPipeline
from package_unit.services.vector_service import VectorService
import threading
import logging


class StatementService:
    def __init__(self, db: Any) -> None:
        self.db = db

    def create_statement(
        self, realm: str, tenant: str, team_id: str, unit_id: int, file_data: Dict[str, Any],
    ) -> Dict[str, Any]:
        schema = make_schema(realm, tenant)
        sql = load_sql("files_insert.sql").format(schema=schema)
        values = [
            team_id,
            unit_id,
            file_data.get("original_filename"),
            file_data.get("storage_key"),
            file_data.get("mime_type"),
            file_data.get("size_bytes") or 0,
            file_data.get("checksum"),
            file_data.get("metadata") or {},
            file_data.get("uploaded_by"),
        ]
        res = self.db.query(sql, values)
        row = res.rows[0] if getattr(res, "rows", None) else res[0]
        return self._map_to_file_response(row)

    def get_statements(self, realm: str, tenant: str, team_id: str) -> List[Dict[str, Any]]:
        schema = make_schema(realm, tenant)
        sql = load_sql("files_select_by_unit.sql").format(schema=schema)
        res = self.db.query(sql, [team_id, unit_id])
        rows = res.rows if getattr(res, "rows", None) is not None else res
        return [self._map_to_file_response(r) for r in rows]

    def get_statement_by_id(self, realm: str, tenant: str, team_id: str, file_id: int) -> Optional[Dict[str, Any]]:
        schema = make_schema(realm, tenant)
        sql = load_sql("files_select_by_id.sql").format(schema=schema)
        res = self.db.query(sql, [team_id, file_id])
        rows = res.rows if getattr(res, "rows", None) is not None else res
        return self._map_to_file_response(rows[0]) if rows else None

    def delete_statement(self, realm: str, tenant: str, team_id: str, file_id: int) -> bool:
        schema = make_schema(realm, tenant)
        sql = load_sql("files_delete_by_id.sql").format(schema=schema)
        res = self.db.query(sql, [team_id, file_id])
        count = getattr(res, "rowCount", None)
        success = count > 0 if count is not None else True
        if success:
            try:
                VectorService().delete_vectors_by_file_id(schema, file_id)
            except Exception:
                logging.exception("vector_delete_failed", extra={
                    "realm": realm, "tenant": tenant, "team_id": team_id, "file_id": file_id,
                })
        return success

    def create_statement_with_background_processing(
        self,
        realm: str,
        tenant: str,
        team_id: str,
        file_data: Dict[str, Any],
        file_bytes: bytes,
        chunk_size: int = 1000,
        chunk_overlap: int = 250,
        auth_headers: Dict[str, str] | None = None,
        mime_type: str | None = None,
    ) -> Dict[str, Any]:
        # 1. Insert file row
        file_response = self.create_statement(realm, tenant, team_id, file_data)

        # 3. Kick off background processing
        thread = threading.Thread(
            target=self._process_statement_in_background,
            args=(realm, tenant, team_id, file_response["id"], file_bytes, chunk_size, chunk_overlap, auth_headers or {}, mime_type),
            daemon=True,
        )
        thread.start()

        logging.info("artifact_dispatch", extra={
            "artifact": "file_chunks", "realm": realm, "tenant": tenant,
            "team_id": team_id, "file_id": file_response["id"],
        })

        return file_response

    def _process_statement_in_background(
        self, realm: str, tenant: str, team_id: str, file_id: int,
        file_bytes: bytes, chunk_size: int, chunk_overlap: int,
        auth_headers: Dict[str, str], mime_type: str | None,
    ) -> None:
        schema = make_schema(realm, tenant)
        try:
            logging.info("artifact_start", extra={"artifact": "file_chunks", "realm": realm,
                         "tenant": tenant, "team_id": team_id, "file_id": file_id})
            self._update_status(schema, team_id, file_id, "in_progress")

            # === Pipeline stages ===
            chunk_pipeline = ChunkPipeline(self.db)
            chunks = chunk_pipeline.run(realm, tenant, team_id, unit_id, file_id, file_bytes, chunk_size, chunk_overlap, auth_headers, mime_type)
            
            self._update_status(schema, team_id, unit_id, file_id, "completed")
            logging.info("artifact_completed", extra={"artifact": "file_chunks", "realm": realm,
                         "tenant": tenant, "team_id": team_id, "unit_id": unit_id, "file_id": file_id,
                         "chunks_created": len(chunks)})
        except Exception as err:
            self._update_status(schema, team_id, unit_id, file_id, "failed", str(err))
            logging.exception("artifact_failed", extra={"artifact": "file_chunks", "realm": realm,
                                "tenant": tenant, "team_id": team_id, "unit_id": unit_id, "file_id": file_id})

    # === Utility ===
    def _update_status(self, schema: str, team_id: str, unit_id: int, file_id: int, status: str, msg: str | None = None):
        if status == "in_progress":
            sql = load_sql("artifact_generation_log_update_in_progress.sql").format(schema=schema)
            self.db.query(sql, [team_id, unit_id, file_id, "file_chunks"])
        elif status == "completed":
            sql = load_sql("artifact_generation_log_update_completed.sql").format(schema=schema)
            self.db.query(sql, [team_id, unit_id, file_id, "file_chunks"])
        elif status == "failed":
            sql = load_sql("artifact_generation_log_update_failed.sql").format(schema=schema)
            self.db.query(sql, [team_id, unit_id, file_id, "file_chunks", msg or "unknown error"])

    def _map_to_file_response(self, row: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "id": row.get("id"),
            "team_id": row.get("team_id"),
            "unit_id": row.get("unit_id"),
            "original_filename": row.get("original_filename"),
            "storage_key": row.get("storage_key"),
            "mime_type": row.get("mime_type"),
            "size_bytes": row.get("size_bytes"),
            "checksum": row.get("checksum"),
            "metadata": row.get("metadata"),
            "uploaded_at": row.get("uploaded_at"),
            "uploaded_by": row.get("uploaded_by"),
            "created_at": row.get("created_at"),
        }
