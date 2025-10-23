from __future__ import annotations
from typing import Any, Dict, Optional
from package_unit.utils.schema import make_schema
from package_unit.utils.sql import load_sql
from package_unit.services.ocr_service import OcrService
import logging


class StatementService:
    def __init__(self, db: Any) -> None:
        self.db = db

    def create_statement(
        self, realm: str, tenant: str, team_id: str, file_data: Dict[str, Any],
    ) -> Dict[str, Any]:
        """Insert a statement row using the provided data."""
        schema = make_schema(realm, tenant)
        sql = load_sql("statement_insert.sql").format(schema=schema)
        values = [
            team_id,
            file_data.get("file_name"),
            file_data.get("raw_text"),
            file_data.get("uploaded_by"),
        ]
        res = self.db.query(sql, values)
        row = res.rows[0] if getattr(res, "rows", None) else res[0]
        return self._map_to_statement_response(row)

    def get_statement_by_id(self, realm: str, tenant: str, team_id: str, statement_id: int) -> Optional[Dict[str, Any]]:
        schema = make_schema(realm, tenant)
        sql = f"SELECT * FROM {schema}.statement WHERE team_id = $1 AND id = $2"
        res = self.db.query(sql, [team_id, statement_id])
        rows = res.rows if getattr(res, "rows", None) is not None else res
        return self._map_to_statement_response(rows[0]) if rows else None

    def delete_statement(self, realm: str, tenant: str, team_id: str, statement_id: int) -> bool:
        schema = make_schema(realm, tenant)
        sql = f"DELETE FROM {schema}.statement WHERE team_id = $1 AND id = $2"
        res = self.db.query(sql, [team_id, statement_id])
        count = getattr(res, "rowCount", None)
        return count > 0 if count is not None else True

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
        # Extract raw text from the uploaded file via OCR
        try:
            raw_text = OcrService.extract_text(
                file_bytes, mime_type=mime_type, auth_headers=auth_headers or {})
        except Exception:
            logging.exception("ocr_failed")
            raw_text = ""

        file_payload: Dict[str, Any] = {
            "file_name": file_data.get("file_name") or file_data.get("original_filename"),
            "raw_text": raw_text,
            "uploaded_by": file_data.get("uploaded_by") or file_data.get("created_by"),
        }

        created = self.create_statement(realm, tenant, team_id, file_payload)
        logging.info("statement_created", extra={
            "realm": realm, "tenant": tenant, "team_id": team_id, "statement_id": created.get("id"),
        })
        return created

    def _map_to_statement_response(self, row: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "id": row.get("id"),
            "team_id": row.get("team_id"),
            "file_name": row.get("file_name"),
            "raw_text": row.get("raw_text"),
            "created_by": row.get("created_by"),
            "upload_date": row.get("upload_date"),
            "created_at": row.get("created_at"),
            "updated_at": row.get("updated_at"),
        }
