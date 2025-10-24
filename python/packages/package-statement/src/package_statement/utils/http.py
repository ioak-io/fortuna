from __future__ import annotations

import os
from typing import Any, Dict

import requests


API_URL = os.environ.get("API_URL", "http://localhost:8080")


def post_json(path: str, json: Dict[str, Any], headers: Dict[str, str] | None = None) -> requests.Response:
    url = f"{API_URL.rstrip('/')}/{path.lstrip('/')}"
    return requests.post(url, json=json, headers=headers or {})


def post_form(path: str, files: dict[str, tuple[str, bytes, str]] | None, headers: Dict[str, str] | None = None) -> requests.Response:
    url = f"{API_URL.rstrip('/')}/{path.lstrip('/')}"
    return requests.post(url, files=files or {}, headers=headers or {})
