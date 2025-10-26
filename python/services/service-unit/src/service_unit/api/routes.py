from __future__ import annotations

from fastapi import APIRouter

from .routers import statement, cluster

router = APIRouter()
router.include_router(statement.router)
router.include_router(cluster.router)
