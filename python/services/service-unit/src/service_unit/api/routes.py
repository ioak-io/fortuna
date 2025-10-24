from __future__ import annotations

from fastapi import APIRouter

from .routers import  statement

router = APIRouter()
router.include_router(statement.router)
