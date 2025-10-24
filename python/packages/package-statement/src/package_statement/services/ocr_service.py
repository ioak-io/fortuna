from __future__ import annotations

from typing import Dict, Optional

import requests

from package_statement.utils.http import API_URL


class OcrService:
    @staticmethod
    def extract_text(
        file_bytes: bytes,
        mime_type: Optional[str] = None,
        auth_headers: Dict[str, str] | None = None,
    ) -> str:
        url = f"{API_URL.rstrip('/')}/ocr/extract"
        headers: Dict[str, str] = {}
        if auth_headers:
            if auth_headers.get("authorization"):
                headers["authorization"] = auth_headers["authorization"]
            if auth_headers.get("x-tenant"):
                headers["x-tenant"] = auth_headers["x-tenant"]
        files = {
            "file": (
                "uploaded_file",
                file_bytes,
                mime_type or "application/octet-stream",
            )
        }
        resp = requests.post(url, headers=headers, files=files)
        resp.raise_for_status()
        data = resp.json()
        if not isinstance(data, dict):
            return ""
        # the service returns { filename: text }
        first_key = next(iter(data.keys()), None)
        return data.get(first_key, "") if first_key else ""
