from __future__ import annotations

from fastapi import HTTPException, Request


async def team_context(request: Request) -> None:
    """Populate request.state.team from gateway header or JWT claims.

    Priority:
    1. x-team header (set by gateway/router)
    2. request.state.claims.team (if your JWT claims include it)
    """
    # 1) from gateway header
    team = request.headers.get("x-team")

    # 2) fallback from JWT claims (set by verify_and_get_claims)
    if not team:
        claims = getattr(request.state, "claims", None)
        if claims:
            # claims may be an object or dict
            team = getattr(claims, "team", None)
            if team is None and isinstance(claims, dict):
                team = claims.get("team")

    if not team:
        raise HTTPException(status_code=400, detail="Missing team context (x-team header or claims.team)")

    request.state.team = team
