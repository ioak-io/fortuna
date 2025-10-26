from __future__ import annotations

from typing import Dict, Optional

from fastapi import APIRouter, HTTPException, Request, Query, Response

from package_categorization.services.clustering_service import ClusteringService
from package_statement.utils.schema import make_schema

from ...db_adapter import SyncDB


router = APIRouter(prefix="/cluster", tags=["categorization"])


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


@router.get("/next", response_model=dict | None)
async def find_next_cluster(
    request: Request,
    sim_threshold: float = Query(0.8, ge=0.0, le=1.0),
    sample_size: int = Query(200, ge=1),
    k_neighbors: int = Query(30, ge=1),
):
    realm, tenant, team = _get_ids(request)
    db = SyncDB(user_id=_get_user_id(request))

    schema: str = make_schema(realm, tenant)
    svc = ClusteringService(
        db=db,
        sample_size=sample_size,
        k_neighbors=k_neighbors,
    )

    result: Dict | None = svc.find_next_cluster(
        realm, tenant, team, sim_threshold)
    if result is None:
        return Response(status_code=204)
    return result
