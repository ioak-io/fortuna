from __future__ import annotations

from fastapi import APIRouter

from .routers import categorization, statement

router = APIRouter()
router.include_router(statement.router)
router.include_router(categorization.router)
