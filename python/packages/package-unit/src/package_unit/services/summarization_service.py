from __future__ import annotations

from typing import Dict

from package_unit.utils.http import post_json


class SummarizationService:
    @staticmethod
    def summarize(text: str, auth_headers: Dict[str, str]) -> str:
        resp = post_json(
            "llm/predict",
            json={
                "uri": "/v1/chat/completions",
                "provider": "chatgpt",
                "model": "gpt-5-nano",
                "payload": {
                    "messages": [
                        {
                            "role": "system",
                            "content": "Summarize this text into 2–3 clear sentences for study purposes.",
                        },
                        {"role": "user", "content": text},
                    ]
                },
            },
            headers={"Content-Type": "application/json", **(auth_headers or {})},
        )
        if not resp.ok:
            return ""
        try:
            data = resp.json()
            return (
                (data.get("choices") or [{}])[0]
                .get("message", {})
                .get("content", "")
                .strip()
            )
        except Exception:
            return ""

    @staticmethod
    def generate(prompt: str, auth_headers: Dict[str, str]) -> str:
        resp = post_json(
            "llm/predict",
            json={
                "uri": "/v1/chat/completions",
                "provider": "chatgpt",
                "model": "gpt-5-nano",
                "payload": {"messages": [{"role": "user", "content": prompt}]},
            },
            headers={"Content-Type": "application/json", **(auth_headers or {})},
        )
        if not resp.ok:
            return ""
        try:
            data = resp.json()
            return (
                (data.get("choices") or [{}])[0]
                .get("message", {})
                .get("content", "")
                .strip()
            )
        except Exception:
            return ""
