from __future__ import annotations

from typing import Any, Dict, Optional

from fastapi import APIRouter, File, HTTPException, Request, UploadFile

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


def _get_ids(request: Request) -> tuple[str, str, str]:
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


@router.post("", response_model=dict)
async def upload_statement(
    request: Request,
    file: UploadFile = File(...),
):
    realm, tenant, team = _get_ids(request)
    db = SyncDB(user_id=_get_user_id(request))
    file_bytes = await file.read()

    # Minimal payload; package handles CRUD into statement table
    file_data: Dict[str, Any] = {
        "file_name": file.filename,
        "mime_type": file.content_type,
        "size_bytes": len(file_bytes),
        "uploaded_by": _get_user_id(request),
    }

    try:
        svc = StatementService(db)
        # Delegate creation to package service
        resp = svc.create_statement_with_background_processing(
            realm,
            tenant,
            team,
            file_data,
            file_bytes,
            auth_headers=_auth_headers(request),
            mime_type=file.content_type,
        )
        return resp
    except HTTPException:
        raise
    except Exception as e:  # noqa: BLE001
        raise HTTPException(
            status_code=500, detail=f"Failed to process file: {e}") from e
    
