import os
import re
from typing import Dict, Optional
from urllib.request import urlopen

import jwt
from fastapi import HTTPException, Request, status
from jwt import PyJWKClient

from .types import JwtClaims

JWKS_CLIENTS: Dict[str, PyJWKClient] = {}

def get_jwks_client(realm: str) -> PyJWKClient:
    if realm not in JWKS_CLIENTS:
        keycloak_url = os.getenv("KEYCLOAK_URL")
        if not keycloak_url:
            raise ValueError("KEYCLOAK_URL environment variable not set")
        jwks_uri = f"{keycloak_url}/realms/{realm}/protocol/openid-connect/certs"
        JWKS_CLIENTS[realm] = PyJWKClient(jwks_uri)
    return JWKS_CLIENTS[realm]

async def get_key(realm: str, kid: str) -> str:
    client = get_jwks_client(realm)
    signing_key = client.get_signing_key(kid)
    return signing_key.key

def extract_realm_from_token(token: str) -> Optional[str]:
    decoded = jwt.decode(token, options={"verify_signature": False})
    iss = decoded.get("iss")
    if not iss:
        return None
    match = re.search(r"/realms/([^/]+)$", iss)
    return match.group(1) if match else None

async def verify_and_get_claims(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No Authorization header")

    token = auth_header.split(" ")[1]
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Authorization header format")

    realm = extract_realm_from_token(token)
    if not realm:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Could not extract realm from token")

    try:
        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header["kid"]
        key = await get_key(realm, kid)
        decoded_token = jwt.decode(token, key=key, algorithms=["RS256"], audience="account", issuer=f"{os.getenv("KEYCLOAK_URL")}/realms/{realm}")
        request.state.claims = JwtClaims(**decoded_token)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Invalid token: {e}")

async def get_claims(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No Authorization header")

    token = auth_header.split(" ")[1]
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Authorization header format")

    try:
        decoded_token = jwt.decode(token, options={"verify_signature": False})
        request.state.claims = JwtClaims(**decoded_token)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Error decoding token: {e}")
