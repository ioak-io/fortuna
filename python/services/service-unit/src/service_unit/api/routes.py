from __future__ import annotations

from fastapi import APIRouter

from .routers import predict, content, question

router = APIRouter()
router.include_router(predict.router)
router.include_router(content.router)
router.include_router(question.router)
