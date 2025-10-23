from __future__ import annotations

from typing import Any
import os

from fastapi import APIRouter, HTTPException, Path, Depends, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from package_unit import ChatClient

router = APIRouter(prefix="/predict", tags=["predict"])


class PredictRequest(BaseModel):
    uri: str
    provider: str
    model: str
    payload: dict[str, Any]


@router.post("")
async def predict(
    request_body: PredictRequest,
    request: Request
):
    print(request.state.tenant, request.state.realm)
    openai_api_key = os.getenv("OPENAI_API_KEY")
    client = ChatClient()
    provider = request_body.provider
    model = request_body.model
    try:
        result = client.predict(
            provider=provider,
            model=model,
            uri=request_body.uri,
            payload=request_body.payload,
            api_key=openai_api_key,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    return result


class StreamPredictRequest(BaseModel):
    uri: str
    api_key: str
    provider: str
    model: str
    payload: dict[str, Any]


@router.post("/stream")
async def stream_predict_route(
    request_body: StreamPredictRequest,
):
    client = ChatClient()
    provider = request_body.provider
    model = request_body.model
    try:
        stream_generator = client.stream_predict(
            provider=provider,
            model=model,
            api_key=request_body.api_key,
            uri=request_body.uri,
            payload=request_body.payload,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=400, detail=str(e)
        ) from e

    return StreamingResponse(stream_generator, media_type="text/event-stream")
