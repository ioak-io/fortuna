from __future__ import annotations

import json
from typing import Generator

import requests
import logging

API_BASE_URL = "https://generativelanguage.googleapis.com"


def predict(api_key: str, model: str, uri: str, payload: dict, format: str = "string") -> dict:
    headers = {"Content-Type": "application/json"}
    params = {"key": api_key}

    try:
        response = requests.post(f"{API_BASE_URL}{uri}", headers=headers, params=params, json=payload)
        if not response.ok:
            logging.error(
                "LLM call failed (gemini) status=%s uri=%s model=%s body=%s",
                response.status_code,
                uri,
                model,
                response.text[:1000],
            )
            return {"is_successful": False, "error_code": response.status_code, "error_details": response.text}
        
        return response.json()

    except Exception as e:  # noqa: BLE001
        logging.exception(
            "Exception during LLM call (gemini) uri=%s model=%s payload_keys=%s",
            uri,
            model,
            list(payload.keys()),
        )
        return {"is_successful": False, "error_details": str(e), "error_code": getattr(getattr(e, "response", None), "status_code", "UNKNOWN")}


def stream_predict(api_key: str, model: str, uri: str, payload: dict) -> Generator[str, None, None]:
    headers = {"Content-Type": "application/json"}
    params = {"key": api_key}

    try:
        # Gemini uses 'stream=True' in the URL or payload, not as a separate requests param
        stream_uri = f"{uri}:streamGet?alt=sse"
        response = requests.post(f"{API_BASE_URL}{stream_uri}", headers=headers, params=params, json=payload, stream=True)
        if not response.ok:
            logging.error(
                "LLM stream call failed (gemini) status=%s uri=%s model=%s body=%s",
                response.status_code,
                uri,
                model,
                response.text[:1000],
            )
            yield f'data: {{"error": "HTTP {response.status_code}", "details": {json.dumps(response.text[:500])}}}\n\n'
            return

        for line in response.iter_lines(decode_unicode=True):
            if line:
                yield line + "\n\n"

    except Exception as e:  # noqa: BLE001
        logging.exception(
            "Exception during LLM stream call (gemini) uri=%s model=%s payload_keys=%s",
            uri,
            model,
            list(payload.keys()),
        )
        yield f'data: {{"error": "{str(e)}"}}\n\n'
