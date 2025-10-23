from __future__ import annotations

from typing import Any, Dict, Optional

from fastapi import APIRouter, Depends, File, HTTPException, Path, Request, UploadFile, status
from fastapi.responses import JSONResponse

from package_unit.services import (
    StatementService
)


from ...db_adapter import SyncDB

router = APIRouter(prefix="/statement", tags=["content"])


def _auth_headers(request: Request) -> Dict[str, str]:
    return {
        "authorization": request.headers.get("authorization", ""),
        "x-tenant": request.headers.get("x-tenant", ""),
    }


def _get_ids(request: Request) -> tuple[str, str, str, int]:
    realm = getattr(request.state, "realm", None)
    tenant = getattr(request.state, "tenant", None)
    team = getattr(request.state, "team", None)
    if not all([realm, tenant, team]):
        raise HTTPException(
            status_code=400, detail="Missing realm/tenant/team context from middleware")
    return realm, tenant, team


def _get_user_id(request: Request) -> Optional[str]:
    claims = getattr(request.state, "claims", None)
    return getattr(claims, "sub", None)


# Files Endpoints
@router.post("/", response_model=dict)
async def create_file(
    request: Request,
    unit_id: int = Path(..., description="Unit ID"),
    file: UploadFile = File(...),
):
    realm, tenant, team = _get_ids(request)
    db = SyncDB(user_id=_get_user_id(request))
    file_bytes = await file.read()

    file_data: Dict[str, Any] = {
        "original_filename": file.filename,
        "storage_key": f"uploads/{team}/{unit_id}/{file.filename}",
        "mime_type": file.content_type,
        "size_bytes": len(file_bytes),
        "checksum": "",  # TODO: compute checksum if needed
        "metadata": {"uploaded_at": "now", "original_name": file.filename},
        "uploaded_by": getattr(getattr(request.state, "claims", None), "sub", None),
    }

    try:
        svc = StatementService(db)
        resp = svc.create_statement_with_background_processing(
            realm,
            tenant,
            team,
            file_data,
            file_bytes,
            chunk_size=int(request.headers.get("x-chunk-size", "1000")),
            chunk_overlap=int(request.headers.get("x-chunk-overlap", "250")),
            auth_headers=_auth_headers(request),
            mime_type=file.content_type,
        )
        return resp
    except HTTPException:
        raise
    except Exception as e:  # noqa: BLE001
        raise HTTPException(
            status_code=500, detail=f"Failed to process file: {e}") from e


@router.get("/{unit_id}/datasource_file", response_model=list)
async def get_files_by_unit(request: Request, unit_id: int = Path(...)):
    realm, tenant, team, unit_id_val = _get_ids(request, unit_id)
    db = SyncDB(user_id=_get_user_id(request))
    try:
        svc = FileService(db)
        return svc.get_files_by_unit(realm, tenant, team, unit_id_val)
    except Exception as e:  # noqa: BLE001
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch files: {e}") from e


@router.delete("/{unit_id}/datasource_file/{file_id}")
async def delete_file(request: Request, unit_id: int = Path(...), file_id: int = Path(...)):
    realm, tenant, team, _ = _get_ids(request, unit_id)
    db = SyncDB(user_id=_get_user_id(request))
    try:
        svc = FileService(db)
        ok = svc.delete_file(realm, tenant, team, file_id)
        if not ok:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="File not found")
        return {"success": True}
    except HTTPException:
        raise
    except Exception as e:  # noqa: BLE001
        raise HTTPException(
            status_code=500, detail=f"Failed to delete file: {e}") from e


@router.get("/{unit_id}/datasource_file/{file_id}/download")
async def download_file(request: Request, unit_id: int = Path(...), file_id: int = Path(...)):
    realm, tenant, team, _ = _get_ids(request, unit_id)
    db = SyncDB(user_id=_get_user_id(request))
    try:
        svc = FileService(db)
        f = svc.get_file_by_id(realm, tenant, team, file_id)
        if not f:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="File not found")
        # Placeholder response similar to Node controller
        return JSONResponse(
            content={
                "message": "File download initiated",
                "file": {
                    "id": f.get("id"),
                    "name": f.get("original_filename"),
                    "size": f.get("size_bytes"),
                    "type": f.get("mime_type"),
                },
            }
        )
    except HTTPException:
        raise
    except Exception as e:  # noqa: BLE001
        raise HTTPException(
            status_code=500, detail=f"Failed to download file: {e}") from e


# Flashcards Endpoint
@router.post("/{unit_id}/flashcard")
async def create_flashcard(request: Request, unit_id: int = Path(...)):
    realm, tenant, team, unit_id_val = _get_ids(request, unit_id)
    db = SyncDB(user_id=_get_user_id(request))
    try:
        svc = FlashcardsService(db)
        svc.request_flashcard_generation(
            realm, tenant, team, unit_id_val, _auth_headers(request))
        return {"status": "accepted"}
    except Exception as e:  # noqa: BLE001
        raise HTTPException(
            status_code=500, detail=f"Failed to create flashcard: {e}") from e


# Quiz Endpoint
@router.post("/{unit_id}/quiz")
async def create_quiz(request: Request, unit_id: int = Path(...)):
    realm, tenant, team, unit_id_val = _get_ids(request, unit_id)
    db = SyncDB(user_id=_get_user_id(request))
    try:
        svc = QuizService(db)
        svc.request_quiz_generation(
            realm, tenant, team, unit_id_val, _auth_headers(request))
        return {"status": "accepted"}
    except Exception as e:  # noqa: BLE001
        raise HTTPException(
            status_code=500, detail=f"Failed to create quiz: {e}") from e
        

@router.post("/{unit_id}/generate-artifacts")
async def generate_artifacts(request: Request, unit_id: int = Path(...)):
    realm, tenant, team, unit_id_val = _get_ids(request, unit_id)
    db = SyncDB(user_id=_get_user_id(request))
    try:
        svc = ArtifactGenerationService(db)
        svc.request_artifacts_generation(
            realm, tenant, team, unit_id_val, _auth_headers(request))
        print("----")
        return {"status": "accepted"}
    except Exception as e:  # noqa: BLE001
        raise HTTPException(
            status_code=500, detail=f"Failed to create quiz: {e}") from e


# Learning Progress Endpoint
@router.get("/{unit_id}/learning_progress", response_model=list)
async def get_learning_progress(request: Request, unit_id: int = Path(...)):
    realm, tenant, team, unit_id_val = _get_ids(request, unit_id)
    db = SyncDB(user_id=_get_user_id(request))
    try:
        svc = LearningProgressService(db)
        return svc.get_or_create_learning_progress(realm, tenant, team, unit_id_val, _get_user_id(request))
    except Exception as e:  # noqa: BLE001
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch learning progress: {e}") from e
