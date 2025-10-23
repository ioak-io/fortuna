from __future__ import annotations

from fastapi import APIRouter

from .routers import content

router = APIRouter()
router.include_router(content.router)
