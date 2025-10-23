from fastapi import HTTPException, Request, status
from typing import List, Dict, Any

from package_middlewares.jwt import JwtClaims


async def tenant_access(request: Request):
    claims: JwtClaims = request.state.claims
    realm: str = request.state.realm
    tenant: str = request.state.tenant

    if not (claims and
            claims.resource_access and
            claims.resource_access.root.get(realm) and
            claims.resource_access.root.get(realm, {}).roles and
            any(item.startswith(tenant) for item in claims.resource_access.root.get(realm, {}).roles)):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail=f"Permission denied for tenant \"{tenant}\"")

async def tenant_admin(request: Request):
    claims: JwtClaims = request.state.claims
    tenant: str = request.state.tenant

    if not (claims and
            claims.resource_access and
            claims.resource_access.root.get("realm-management") and
            claims.resource_access.root.get("realm-management", {}).get("roles") and
            "realm-admin" in claims.resource_access.root.get("realm-management", {}).get("roles", [])):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail=f"Admin permission denied for tenant \"{tenant}\"")
