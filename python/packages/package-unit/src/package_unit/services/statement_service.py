import pdfplumber
import re
import json
import logging
import io
import pandas as pd
from collections import defaultdict
from collections import Counter
from typing import Any, Dict, Optional, List
from package_unit.utils.schema import make_schema
from package_unit.utils.sql import load_sql
from package_unit.services.llm_service import LlmService


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
        raw_text = ""
        if mime_type and "pdf" in mime_type.lower():
            try:
                raw_text = self._extract_transactions_from_pdf(file_bytes)
                # raw_text = self._normalize_pdf_table(raw_text)
            except Exception:
                logging.exception("pdfplumber_failed")
                raw_text = ""

        print("*****pdfplumber output*****")
        print(raw_text)

        file_payload: Dict[str, Any] = {
            "file_name": file_data.get("file_name") or file_data.get("original_filename"),
            "raw_text": raw_text,
            "uploaded_by": file_data.get("uploaded_by") or file_data.get("created_by"),
        }

        created = self.create_statement(realm, tenant, team_id, file_payload)
        logging.info("statement_created", extra={
            "realm": realm, "tenant": tenant, "team_id": team_id, "statement_id": created.get("id"),
        })

        # --- Parse transactions with LLM ---
        # try:
        #     transactions = self._parse_transactions_with_llm(
        #         file_payload["file_name"], raw_text)
        #     if transactions:
        #         self._insert_transactions(
        #             realm=realm,
        #             tenant=tenant,
        #             team_id=team_id,
        #             statement_id=created.get("id"),
        #             created_by=file_payload.get("uploaded_by"),
        #             transactions=transactions,
        #         )
        #         logging.info("transactions_inserted", extra={
        #             "realm": realm, "tenant": tenant, "team_id": team_id, "statement_id": created.get("id"),
        #             "count": len(transactions),
        #         })
        # except Exception:
        #     logging.exception("transaction_extraction_or_insert_failed", extra={
        #         "realm": realm, "tenant": tenant, "team_id": team_id, "statement_id": created.get("id"),
        #     })

        return created

    def _normalize_pdf_table(self, raw_rows):
        """
        Normalizes extracted PDF table rows so that:
        - ICICI-style (already row-accurate) stays the same.
        - HDFC-style (multiple transactions squashed) is split into individual rows.
        - Removes non-transaction rows (summary, footer, legends).
        """

        if not raw_rows:
            return []

        header = raw_rows[0]
        cleaned = [header]

        date_pattern = re.compile(r"\d{1,2}/\d{1,2}/\d{2,4}")
        money_pattern = re.compile(r"\d[\d,]*\.\d{2}")

        for row in raw_rows[1:]:
            # Skip empty/footer rows
            row_text = " ".join([c or "" for c in row]).lower()
            if "statement" in row_text or "summary" in row_text or "generatedon" in row_text:
                continue

            # --- Detect multiple dates in the "Date" column
            dates = date_pattern.findall(row[0])
            if len(dates) <= 1:
                # Already one transaction → keep as-is
                cleaned.append([c.strip() if c else "" for c in row])
                continue

            # --- Need to split: extract repeating fields ---
            narrations = row[1].split(
                " UPI-") if "UPI-" in row[1] else row[1].split(" ")
            chqs = row[2].split()
            valuedates = date_pattern.findall(row[3]) if row[3] else dates
            withdrawals = money_pattern.findall(row[4]) if row[4] else []
            deposits = money_pattern.findall(row[5]) if row[5] else []
            balances = money_pattern.findall(row[6]) if row[6] else []

            # --- Align by index to produce per-transaction rows ---
            max_len = max(len(dates), len(chqs), len(
                withdrawals), len(deposits), len(balances))
            for i in range(max_len):
                cleaned.append([
                    dates[i] if i < len(dates) else "",
                    narrations[i] if i < len(narrations) else "",
                    chqs[i] if i < len(chqs) else "",
                    valuedates[i] if i < len(valuedates) else "",
                    withdrawals[i] if i < len(withdrawals) else "",
                    deposits[i] if i < len(deposits) else "",
                    balances[i] if i < len(balances) else "",
                ])

        return cleaned

    # -------------------
    # NEW: Pdfplumber extraction
    # -------------------
    def _extract_transactions_from_pdf(self, file_bytes: bytes) -> str:
        all_lines: List[str] = []
        import io
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if not text:
                    continue
                lines = [line.strip()
                         for line in text.split("\n") if line.strip()]
                all_lines.extend(lines)

        # Remove headers/footers (repeated lines across pages)
        line_counts = Counter(all_lines)
        repeated_lines = {line for line,
                          count in line_counts.items() if count > 2}
        cleaned_lines = [
            line for line in all_lines if line not in repeated_lines]

        # Keep header row if available
        header_candidates = [
            line for line in cleaned_lines
            if any(h in line.lower() for h in ["date", "desc", "narration", "withdrawal", "deposit", "debit", "credit", "balance"])
        ]
        header_line = header_candidates[0] if header_candidates else None

        # Keep transaction rows (lines starting with a date + numbers)
        date_regex = re.compile(r"^\d{1,2}[-/]\d{1,2}[-/]\d{2,4}")
        amount_regex = re.compile(r"\d[\d,]*\.\d{2}")

        transaction_lines = []
        for line in cleaned_lines:
            if date_regex.search(line) and amount_regex.search(line):
                transaction_lines.append(line)

        if header_line:
            return "\n".join([header_line] + transaction_lines)
        return "\n".join(transaction_lines)

    def _insert_transactions(
        self,
        realm: str,
        tenant: str,
        team_id: str,
        statement_id: int,
        created_by: Optional[str],
        transactions: List[Dict[str, Any]],
    ) -> None:
        schema = make_schema(realm, tenant)
        sql = load_sql("transaction_insert.sql").format(schema=schema)
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

    def _parse_transactions_with_llm(self, file_name: str, raw_text: str) -> List[Dict[str, Any]]:
        """Convert cleaned bank statement text to structured transactions via LLM."""
        precleaned_text = raw_text  # already pre-cleaned by pdfplumber/OCR stage

        prompt = (
            "Extract all transactions from the following pre-cleaned bank statement text. "
            "Each line represents one transaction with: transaction date, narration/description, "
            "and one or more of withdrawal, deposit, amount, or balance values. "
            "Identify the correct transaction amount and classify it as debit or credit intelligently. "
            "Ignore closing balances, headers, and non-transaction text. "
            "Return ONLY a JSON array with objects containing: "
            "transaction_date (YYYY-MM-DD), description, amount, currency (default INR), type (debit or credit)."
        )
        messages = [
            {"role": "system", "content": "You are a precise financial data extractor. Respond with strict JSON only."},
            {"role": "user", "content": prompt +
                f"\n\nFILE NAME: {file_name}\n\nCLEANED TRANSACTIONS:\n{precleaned_text}"},
        ]

        llm = LlmService()
        completion = llm.complete(messages)

        try:
            data = json.loads(completion)
            if isinstance(data, list):
                return [t for t in data if isinstance(t, dict)]
        except Exception:
            logging.exception("llm_json_parse_failed")
        return []
