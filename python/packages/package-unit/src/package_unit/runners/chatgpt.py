from __future__ import annotations

import json
from typing import Generator

import requests
import logging

API_BASE_URL = "https://api.openai.com"


def predict(api_key: str, model: str, uri: str, payload: dict, format: str = "string") -> dict:
    headers = {"Content-Type": "application/json", "Authorization": f"Bearer {api_key}"}

    try:
        payload = dict(payload)
        payload["model"] = model
        response = requests.post(f"{API_BASE_URL}{uri}", json=payload, headers=headers)
        if not response.ok:
            # Log HTTP failure details for diagnostics
            logging.error(
                "LLM call failed (chatgpt) status=%s uri=%s model=%s body=%s",
                response.status_code,
                uri,
                model,
                response.text[:1000],
            )
            # Returning a dictionary with error details in case of HTTP failure
            return {"is_successful": False, "error_code": response.status_code, "error_details": response.text}
        
        return response.json()
    except Exception as e:  # noqa: BLE001 - pass through legacy shape
        logging.exception(
            "Exception during LLM call (chatgpt) uri=%s model=%s payload_keys=%s",
            uri,
            model,
            list(payload.keys()),
        )
        # Returning a dictionary with exception details
        return {"is_successful": False, "error_details": str(e), "error_code": getattr(getattr(e, "response", None), "status_code", "UNKNOWN")}



def stream_predict(api_key: str, model: str, uri: str, payload: dict) -> Generator[str, None, None]:
    headers = {"Content-Type": "application/json", "Authorization": f"Bearer {api_key}"}

    payload = dict(payload)
    payload["model"] = model
    payload["stream"] = True

    try:
        response = requests.post(f"{API_BASE_URL}{uri}", json=payload, headers=headers, stream=True)
        if not response.ok:
            logging.error(
                "LLM stream call failed (chatgpt) status=%s uri=%s model=%s body=%s",
                response.status_code,
                uri,
                model,
                response.text[:1000],
            )
            yield f'data: {{"error": "HTTP {response.status_code}", "details": {json.dumps(response.text[:500])}}}\n\n'
            return

        for line in response.iter_lines(decode_unicode=True):
            if line and line.startswith("data: "):
                yield line + "\n\n"

    except Exception as e:  # noqa: BLE001
        logging.exception(
            "Exception during LLM stream call (chatgpt) uri=%s model=%s payload_keys=%s",
            uri,
            model,
            list(payload.keys()),
        )
        yield f'data: {{"error": "{str(e)}"}}\n\n'
