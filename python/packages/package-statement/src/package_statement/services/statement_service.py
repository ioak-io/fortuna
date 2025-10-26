import re
import json
import logging
from datetime import datetime
from dateutil import parser
from typing import Any, Dict, Optional, List
from package_statement.utils.schema import make_schema
from package_statement.utils.sql import load_sql
from package_statement.services.llm_service import LlmService
from package_statement.services.vector_service import VectorService
from package_categorization.services.clustering_service import ClusteringService
from package_statement.services.statement_parsers import extract_transactions


class StatementService:
    def __init__(self, db: Any) -> None:
        self.db = db

    def create_statement(
        self, realm: str, tenant: str, team_id: str, file_data: Dict[str, Any],
    ) -> Dict[str, Any]:
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
        deleted = count > 0 if count is not None else True
        if deleted:
            VectorService().delete_vectors_by_statement_id(
                schema=schema,
                statement_id=statement_id,
            )
        return deleted

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
        schema = make_schema(realm, tenant)
        parsed_rows = extract_transactions(
            file_bytes=file_bytes,
            mime_type=mime_type,
            file_name=(file_data.get("file_name")
                       or file_data.get("original_filename")),
        )

        file_payload: Dict[str, Any] = {
            "file_name": file_data.get("file_name") or file_data.get("original_filename"),
            "raw_text": parsed_rows,
            "uploaded_by": file_data.get("uploaded_by") or file_data.get("created_by"),
        }

        created = self.create_statement(realm, tenant, team_id, file_payload)
        logging.info("statement_created", extra={
            "realm": realm, "tenant": tenant, "team_id": team_id, "statement_id": created.get("id"),
        })

        mapping = self._get_header_mapping(parsed_rows)
        print(mapping)
        mapped_rows = self._apply_header_mapping(parsed_rows, mapping)
        transactions = self._normalize_transactions(mapped_rows)
        inserted_transactions = self._insert_transactions(
            realm=realm,
            tenant=tenant,
            team_id=team_id,
            statement_id=created.get("id"),
            created_by=file_payload.get("uploaded_by"),
            transactions=transactions,
        )

        VectorService().delete_vectors_by_statement_id(
            schema=schema,
            statement_id=created.get("id"),
        )
        self._store_vectors(schema, team_id, created.get(
            "id"), inserted_transactions)
        logging.info("transactions_inserted", extra={
            "realm": realm, "tenant": tenant, "team_id": team_id, "statement_id": created.get("id"),
            "count": len(transactions),
        })

        # try:
        #     ClusteringService(self.db).cluster_new_transactions(
        #         realm=realm,
        #         tenant=tenant,
        #         team_id=team_id,
        #     )
        # except Exception:
        #     logging.exception("clustering_failed", extra={
        #         "realm": realm, "tenant": tenant, "team_id": team_id, "statement_id": created.get("id"),
        #     })

        return created

    def _insert_transactions(
        self,
        realm: str,
        tenant: str,
        team_id: str,
        statement_id: int,
        created_by: Optional[str],
        transactions: List[Dict[str, Any]],
    ) -> List[Dict[str, Any]]:
        schema = make_schema(realm, tenant)
        sql = load_sql("transaction_insert.sql").format(schema=schema)
        inserted: List[Dict[str, Any]] = []
        for t in transactions:
            values = [
                team_id,
                statement_id,
                t.get("transaction_date"),
                t.get("description"),
                t.get("amount"),
                (t.get("currency") or "INR").upper(),
                t.get("type"),
                created_by,
            ]
            try:
                res = self.db.query(sql, values)
                rows = getattr(res, "rows", [])
                inserted_id = rows[0].get("id") if rows else None
                if inserted_id is not None:
                    txn_with_id = dict(t)
                    txn_with_id["id"] = inserted_id
                    inserted.append(txn_with_id)
            except Exception:
                logging.exception("transaction_insert_failed", extra={
                    "team_id": team_id, "statement_id": statement_id, "transaction": t,
                })
        return inserted

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

    def _get_header_mapping(self, rows: List[Dict[str, Any]]) -> Dict[str, str]:
        """
        Use an LLM to map DB schema fields to the most appropriate raw header
        from a bank statement file. Supports two schema shapes:

        Shape A: transaction_date, description, debit, credit
        Shape B: transaction_date, description, amount, type
        """
        if not rows:
            return {}

        # Sample data
        sample_headers = list(rows[0].keys())
        sample_data = rows[:5]

        # Construct LLM prompt
        messages = [
            {
                "role": "system",
                "content": (
                    "You are a data extraction assistant. "
                    "Your job is to map raw bank statement headers "
                    "to one of two possible schema shapes (Shape A or Shape B). "
                    "You must inspect both header names and the sample row values "
                    "to ensure the mapping is correct."
                )
            },
            {
                "role": "user",
                "content": (
                    f"Here are the raw headers: {sample_headers}\n\n"
                    f"Here are the first 5 rows of data:\n{json.dumps(sample_data, indent=2)}\n\n"
                    "Schema shapes:\n"
                    "Shape A: transaction_date, description, debit, credit\n"
                    "Shape B: transaction_date, description, amount, type\n\n"
                    "Rules:\n"
                    "- transaction_date → column with date-like values.\n"
                    "- description → column with long free-text details.\n"
                    "- debit/credit → must map only to numeric columns that represent money.\n"
                    "- If there is a single numeric column + a categorical 'Debit/Credit' column, use Shape B.\n"
                    "- If there are two numeric columns (debit & credit separately), use Shape A.\n"
                    "- Do not assign non-numeric columns to debit/credit/amount.\n\n"
                    "Return ONLY a valid JSON mapping object. Example:\n"
                    "{\n"
                    '  "transaction_date": "Date",\n'
                    '  "description": "Transaction Details",\n'
                    '  "amount": "Amount (INR)",\n'
                    '  "type": "Debit/Credit"\n'
                    "}"
                )
            }
        ]

        # Call your LLM
        llm = LlmService()
        raw_json = llm.complete(messages)

        try:
            mapping = json.loads(raw_json)
        except json.JSONDecodeError:
            raise ValueError(f"Invalid JSON returned by LLM: {raw_json}")

        return mapping

    def _apply_header_mapping(
        self, rows: List[Dict[str, Any]], mapping: Dict[str, str]
    ) -> List[Dict[str, Any]]:
        normalized = []

        for row in rows:
            mapped_row = {}
            for db_key, raw_header in mapping.items():
                if raw_header and raw_header in row:
                    mapped_row[db_key] = row[raw_header]
                else:
                    mapped_row[db_key] = None
            normalized.append(mapped_row)

        return normalized

    def _normalize_transactions(self, rows: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        normalized = []
        for row in rows:
            txn = {
                "transaction_date": self._parse_date(row.get("transaction_date")),
                "description": row.get("description"),
                "amount": None,
                "type": None,
            }

            # Skip if no transaction_date
            if not txn["transaction_date"]:
                continue

            # Case A: amount + type (already explicit)
            if row.get("amount") is not None and str(row.get("amount")).strip() != "":
                cleaned_amount = self._clean_amount(row["amount"])
                if cleaned_amount and cleaned_amount != 0:
                    txn["amount"] = cleaned_amount
                    txn["type"] = str(row.get("type") or "").lower() or None

            # Case B: debit/credit split
            if txn["amount"] is None:  # only check if amount not set
                debit = self._clean_amount(row.get("debit"))
                credit = self._clean_amount(row.get("credit"))

                if debit and debit != 0:
                    txn["amount"] = debit
                    txn["type"] = "debit"
                elif credit and credit != 0:
                    txn["amount"] = credit
                    txn["type"] = "credit"

            # Add only if valid transaction
            if txn["amount"] not in (None, 0, "") and txn["type"] and txn["transaction_date"]:
                normalized.append(txn)

        return normalized

    def _normalize_with_llm_mapping(self, parsed_rows: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        if not parsed_rows:
            return []

        # Extract headers from the first row
        pdf_headers = list(parsed_rows[0].keys())

        # Define your standard DB schema headers
        db_headers = [
            "transaction_date",
            "description",
            "ref_no",
            "value_date",
            "withdrawal_amount",
            "deposit_amount",
            "balance"
        ]

        mapping = self._map_headers_with_llm(pdf_headers, db_headers)
        return self._apply_header_mapping(parsed_rows, mapping)

    def _clean_amount(self, value: Any) -> float | None:
        if value is None:
            return None

        if isinstance(value, (int, float)):
            return float(value)

        if isinstance(value, str):
            # Remove currency symbols, commas, spaces
            cleaned = re.sub(r"[^\d.\-]", "", value)
            try:
                return float(cleaned)
            except ValueError:
                return None

        return None

    def _parse_date(self, value: Any) -> str | None:
        if not value:
            return None

        if isinstance(value, datetime):
            return value.date().isoformat()

        if isinstance(value, str):
            value = value.strip()
            try:
                # Try flexible parsing
                dt = parser.parse(value, dayfirst=True, yearfirst=False)
                return dt.date().isoformat()
            except Exception:
                return None

        return None

    def _store_vectors(self, schema: str, team_id: str, statement_id: int, transactions: List[Dict[str, Any]]) -> None:
        try:
            logging.info("vectors_start")
            VectorService().upsert_transactions(
                schema=schema,
                team_id=team_id,
                statement_id=statement_id,
                transactions=transactions,
            )
            logging.info("vectors_completed")
        except Exception:
            logging.info("vectors_failed")
            logging.exception("qdrant_upsert_failed", extra={
                "team_id": team_id, "statement_id": statement_id, "transactions": transactions,
            })
