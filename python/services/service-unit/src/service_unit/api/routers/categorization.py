from __future__ import annotations

from fastapi import APIRouter

from package_categorization import CategorizationService


router = APIRouter(prefix="/categorization", tags=["categorization"])


@router.get("/health", response_model=dict)
async def health() -> dict[str, str]:
    svc = CategorizationService()
    return svc.health()
