import re
from fastapi import HTTPException, Request, status
from typing import Optional

from .types import JwtClaims


async def tenant_db(request: Request):
    claims: Optional[JwtClaims] = request.state.claims

    iss = claims.iss if claims else None
    realm = None
    if iss:
        match = re.search(r"/realms/([^/]+)$", iss)
        realm = match.group(1) if match else None

    tenant = request.headers.get("x-tenant")

    if not realm or not tenant:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Missing tenant info")

    request.state.realm = realm
    request.state.tenant = tenant
