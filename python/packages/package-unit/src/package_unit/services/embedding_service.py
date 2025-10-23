from __future__ import annotations

from typing import List, Dict

from package_unit.utils.http import post_json


class EmbeddingService:
    @staticmethod
    def get_embedding(text: str, auth_headers: Dict[str, str]) -> List[float]:
        resp = post_json(
            "llm/predict",
            json={
                "uri": "/v1/embeddings",
                "provider": "chatgpt",
                "model": "text-embedding-3-small",
                "payload": {"input": text},
            },
            headers={"Content-Type": "application/json", **(auth_headers or {})},
        )
        try:
            data = resp.json()
            return data.get("data", [{}])[0].get("embedding", [])
        except Exception:
            return []
