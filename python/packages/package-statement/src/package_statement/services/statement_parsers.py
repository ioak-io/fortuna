import logging
import re
from typing import Any, List, Optional

import io
from collections import Counter

import pdfplumber
import pandas as pd


def extract_transactions_from_pdf(file_bytes: bytes) -> str:
    all_lines: List[str] = []
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if not text:
                continue
            lines = [line.strip() for line in text.split("\n") if line.strip()]
            all_lines.extend(lines)

    # Remove headers/footers (repeated lines across pages)
    line_counts = Counter(all_lines)
    repeated_lines = {line for line, count in line_counts.items() if count > 2}
    cleaned_lines = [line for line in all_lines if line not in repeated_lines]

    # Keep header row if available
    header_candidates = [
        line
        for line in cleaned_lines
        if any(
            h in line.lower()
            for h in [
                "date",
                "desc",
                "narration",
                "withdrawal",
                "deposit",
                "debit",
                "credit",
                "balance",
            ]
        )
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


def extract_transactions_from_excel(file_bytes: bytes) -> dict:
    """Extract the main transactions table from a messy Excel bank statement.

    Returns:
        {
          "columns": [...],   # original column headers
          "rows": [ {...}, ...]  # each row as dict, keys = original headers
        }
    """
    try:
        df = pd.read_excel(io.BytesIO(file_bytes), sheet_name=0, header=None)
    except Exception:
        logging.exception("excel_read_failed")
        return {"columns": [], "rows": []}

    if df is None or df.empty:
        return {"columns": [], "rows": []}

    # --- Step 1: Find header row ---
    header_idx = _find_header_index(df)
    if header_idx is None:
        logging.warning("No header row detected")
        return {"columns": [], "rows": []}

    df.columns = df.iloc[header_idx]
    df = df.iloc[header_idx+1:].copy()
    
    # --- Step 2: Drop junk rows ---
    df = df.dropna(thresh=2)  # keep rows with >= 2 non-nulls

    # Remove footer / subtotal / balance rows
    mask = df.apply(
        lambda r: not bool(
            re.search(r"(total|balance|closing|opening|subtotal)",
                      " ".join(map(str, r.values)).lower())
        ),
        axis=1
    )
    df = df[mask]

    if df.empty:
        return {"columns": [], "rows": []}

    # --- Step 3: Convert to JSON ---
    df = df.fillna("")  # replace NaN with empty strings
    columns = [str(c) for c in df.columns]
    rows = df.to_dict(orient="records")

    # return {"columns": columns, "rows": rows}
    return rows


def extract_transactions(
    file_bytes: bytes, mime_type: str | None, file_name: str | None
) -> str:
    """Route to the appropriate extractor based on MIME type or file extension."""
    mt = (mime_type or "").lower()
    fn = (file_name or "").lower()

    try:
        if "pdf" in mt or fn.endswith(".pdf"):
            return extract_transactions_from_pdf(file_bytes)

        if (
            "excel" in mt
            or "spreadsheet" in mt
            or "sheet" in mt
            or fn.endswith(".xlsx")
            or fn.endswith(".xls")
        ):
            return extract_transactions_from_excel(file_bytes)
    except Exception:
        logging.exception("statement_extraction_failed")
        return ""

    # Unsupported type
    return ""


def _find_header_index(df, min_matches: int = 2) -> int | None:
    header_keywords = [
        "date", "txn", "transaction", "particular", "narration",
        "amount", "debit", "credit", "withdraw", "deposit", "balance"
    ]

    best_idx = None
    best_score = 0

    for i, row in df.iterrows():
        row_str = " ".join([str(x).lower() for x in row.tolist()])
        # Count matches if the keyword appears as substring
        matches = sum(1 for kw in header_keywords if kw in row_str)

        if matches > best_score and matches >= min_matches:
            best_score = matches
            best_idx = i

    return best_idx


# def _normalize_pdf_table(self, raw_rows):
#     """
#     Normalizes extracted PDF table rows so that:
#     - ICICI-style (already row-accurate) stays the same.
#     - HDFC-style (multiple transactions squashed) is split into individual rows.
#     - Removes non-transaction rows (summary, footer, legends).
#     """

#     if not raw_rows:
#         return []

#     header = raw_rows[0]
#     cleaned = [header]

#     date_pattern = re.compile(r"\d{1,2}/\d{1,2}/\d{2,4}")
#     money_pattern = re.compile(r"\d[\d,]*\.\d{2}")

#     for row in raw_rows[1:]:
#         # Skip empty/footer rows
#         row_text = " ".join([c or "" for c in row]).lower()
#         if "statement" in row_text or "summary" in row_text or "generatedon" in row_text:
#             continue

#         # --- Detect multiple dates in the "Date" column
#         dates = date_pattern.findall(row[0])
#         if len(dates) <= 1:
#             # Already one transaction → keep as-is
#             cleaned.append([c.strip() if c else "" for c in row])
#             continue

#         # --- Need to split: extract repeating fields ---
#         narrations = row[1].split(
#             " UPI-") if "UPI-" in row[1] else row[1].split(" ")
#         chqs = row[2].split()
#         valuedates = date_pattern.findall(row[3]) if row[3] else dates
#         withdrawals = money_pattern.findall(row[4]) if row[4] else []
#         deposits = money_pattern.findall(row[5]) if row[5] else []
#         balances = money_pattern.findall(row[6]) if row[6] else []

#         # --- Align by index to produce per-transaction rows ---
#         max_len = max(len(dates), len(chqs), len(
#             withdrawals), len(deposits), len(balances))
#         for i in range(max_len):
#             cleaned.append([
#                 dates[i] if i < len(dates) else "",
#                 narrations[i] if i < len(narrations) else "",
#                 chqs[i] if i < len(chqs) else "",
#                 valuedates[i] if i < len(valuedates) else "",
#                 withdrawals[i] if i < len(withdrawals) else "",
#                 deposits[i] if i < len(deposits) else "",
#                 balances[i] if i < len(balances) else "",
#             ])

#     return cleaned
