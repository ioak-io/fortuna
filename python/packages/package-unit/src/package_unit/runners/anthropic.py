from __future__ import annotations

import json
from typing import Any, Generator

import requests
import logging

API_BASE_URL = "https://api.anthropic.com"


def predict(api_key: str, model: str, uri: str, payload: dict, format: str = "string") -> dict:
    # Anthropic typically expects x-api-key and version header; allow passthrough if caller sets headers in upstream proxy
    headers = {
        "Content-Type": "application/json",
        "x-api-key": api_key,
        # This version can be overridden server-side; set a reasonable default
        "anthropic-version": "2023-06-01",
    }

    try:
        body = dict(payload)
        # Some Anthropic endpoints require explicit model in body
        body.setdefault("model", model)
        response = requests.post(f"{API_BASE_URL}{uri}", json=body, headers=headers)
        if not response.ok:
            logging.error(
                "LLM call failed (anthropic) status=%s uri=%s model=%s body=%s",
                response.status_code,
                uri,
                model,
                response.text[:1000],
            )
            return {"is_successful": False, "error_code": response.status_code, "error_details": response.text}
        
        return response.json()

    except requests.exceptions.HTTPError as e:
        logging.exception(
            "HTTP error during LLM call (anthropic) uri=%s model=%s payload_keys=%s",
            uri,
            model,
            list(payload.keys()),
        )
        return {"is_successful": False, "error_details": str(e), "error_code": e.response.status_code}
    except Exception as e:  # noqa: BLE001
        logging.exception(
            "Exception during LLM call (anthropic) uri=%s model=%s payload_keys=%s",
            uri,
            model,
            list(payload.keys()),
        )
        return {"is_successful": False, "error_details": str(e), "error_code": getattr(getattr(e, "response", None), "status_code", "UNKNOWN")}


def stream_predict(api_key: str, model: str, uri: str, payload: dict) -> Generator[str, None, None]:
    headers = {
        "Content-Type": "application/json",
        "x-api-key": api_key,
        "anthropic-version": "2023-06-01",
    }

    body = dict(payload)
    body.setdefault("model", model)
    body["stream"] = True

    try:
        response = requests.post(f"{API_BASE_URL}{uri}", json=body, headers=headers, stream=True)
        if not response.ok:
            logging.error(
                "LLM stream call failed (anthropic) status=%s uri=%s model=%s body=%s",
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
            "Exception during LLM stream call (anthropic) uri=%s model=%s payload_keys=%s",
            uri,
            model,
            list(payload.keys()),
        )
        yield f'data: {{"error": "{str(e)}"}}\n\n'
