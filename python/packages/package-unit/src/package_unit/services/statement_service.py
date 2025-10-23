from __future__ import annotations
from typing import Any, Dict, Optional, List
import json
from package_unit.utils.schema import make_schema
from package_unit.utils.sql import load_sql
from package_unit.services.ocr_service import OcrService
from package_unit.services.llm_service import LlmService
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
        
        # Use LLM to extract transactions and insert into transaction table
        try:
            transactions = self._parse_transactions_with_llm(file_payload["file_name"], raw_text)
            if transactions:
                self._insert_transactions(
                    realm=realm,
                    tenant=tenant,
                    team_id=team_id,
                    statement_id=created.get("id"),
                    file_name=file_payload["file_name"],
                    raw_text=raw_text,
                    created_by=file_payload.get("uploaded_by"),
                    transactions=transactions,
                )
                logging.info("transactions_inserted", extra={
                    "realm": realm, "tenant": tenant, "team_id": team_id, "statement_id": created.get("id"),
                    "count": len(transactions),
                })
        except Exception:
            logging.exception("transaction_extraction_or_insert_failed", extra={
                "realm": realm, "tenant": tenant, "team_id": team_id, "statement_id": created.get("id"),
            })

        return created

    def _parse_transactions_with_llm(self, file_name: str, raw_text: str) -> List[Dict[str, Any]]:
        """Convert bank statement text to structured transactions via LLM.

        Expected JSON: array of objects with keys
        - transaction_date (YYYY-MM-DD)
        - description (string)
        - amount (number)
        - currency (3-letter, default INR)
        - is_income (boolean)
        - category_id (number, optional)
        """
        prompt = (
            "Extract all transactions from the following bank statement text. "
            "Return ONLY a JSON array with items containing: transaction_date (YYYY-MM-DD), description, amount, currency (default INR), is_income."
        )
        messages = [
            {"role": "system", "content": "You are a precise financial data extractor. Respond with strict JSON only."},
            {"role": "user", "content": prompt + f"\n\nFILE NAME: {file_name}\n\nSTATEMENT TEXT:\n{raw_text}"},
        ]
        llm = LlmService()
        completion = llm.complete(messages)
        print(completion)
        try:
            data = json.loads(completion)
            if isinstance(data, list):
                return [t for t in data if isinstance(t, dict)]
        except Exception:
            logging.exception("llm_json_parse_failed")
        return []

    def _insert_transactions(
        self,
        realm: str,
        tenant: str,
        team_id: str,
        statement_id: int,
        file_name: str,
        raw_text: str,
        created_by: Optional[str],
        transactions: List[Dict[str, Any]],
    ) -> None:
        schema = make_schema(realm, tenant)
        sql = load_sql("transaction_insert.sql").format(schema=schema)
        for t in transactions:
            transaction_date = t.get("transaction_date")
            description = t.get("description")
            amount = t.get("amount")
            currency = (t.get("currency") or "INR").upper()
            is_income = t.get("is_income")
            category_id = t.get("category_id")
            values = [
                team_id,
                file_name,
                raw_text,
                statement_id,
                transaction_date,
                description,
                amount,
                currency,
                is_income,
                category_id,
                created_by,
            ]
            try:
                self.db.query(sql, values)
            except Exception:
                logging.exception("transaction_insert_failed", extra={
                    "team_id": team_id, "statement_id": statement_id, "transaction": t,
                })

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
