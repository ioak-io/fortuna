from __future__ import annotations

from typing import Dict


class CategorizationService:
    def health(self) -> Dict[str, str]:
        return {"status": "ok"}
