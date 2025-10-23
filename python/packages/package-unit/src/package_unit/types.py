from __future__ import annotations

from dataclasses import dataclass
from typing import Any
from pydantic import BaseModel, Field


class LLMResponse(BaseModel):
    is_successful: bool | None = None
    response_text: str | None = None
    response_object: dict[str, Any] = Field(default_factory=dict)
    response_list: list[Any] = Field(default_factory=list)
    error_details: str | None = None
    error_code: int | str | None = None
