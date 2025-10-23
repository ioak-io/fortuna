from __future__ import annotations

from typing import Any, Dict, Optional

from fastapi import APIRouter, Depends, HTTPException, Path, Request, status
from pydantic import BaseModel

from package_unit.services import QuestionService
from ...db_adapter import SyncDB

router = APIRouter(prefix="/question", tags=["question"])


class EvaluateResponseRequest(BaseModel):
    question: str
    correct_answer: str
    user_answer: str


class EvaluateResponseResponse(BaseModel):
    is_correct: bool
    explanation: str
    confidence: float


def _get_user_id(request: Request) -> Optional[str]:
    claims = getattr(request.state, "claims", None)
    return getattr(claims, "sub", None)


@router.post("/evaluate", response_model=EvaluateResponseResponse)
async def evaluate_user_response(
    request: Request,
    evaluation_request: EvaluateResponseRequest
):
    """
    Evaluate a user's response against the correct answer using LLM.
    
    Args:
        evaluation_request: Contains question, correct_answer, and user_answer
        
    Returns:
        Evaluation result with is_correct, explanation, and confidence
    """
    db = SyncDB(user_id=_get_user_id(request))
    
    try:
        svc = QuestionService(db)
        result = svc.evaluate_user_response(
            question=evaluation_request.question,
            correct_answer=evaluation_request.correct_answer,
            user_answer=evaluation_request.user_answer
        )
        
        return EvaluateResponseResponse(
            is_correct=result["is_correct"],
            explanation=result["explanation"],
            confidence=result["confidence"]
        )
        
    except Exception as e:  # noqa: BLE001
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to evaluate user response: {e}"
        ) from e
