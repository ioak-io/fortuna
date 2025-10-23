from typing import Dict, List, Optional, Union
from pydantic import BaseModel, RootModel


class RealmAccess(BaseModel):
    roles: List[str]


class ResourceAccessEntry(BaseModel):
    roles: List[str]


class ResourceAccess(RootModel[Dict[str, ResourceAccessEntry]]):
    pass


class JwtClaims(BaseModel):
    exp: int  # expiration (epoch)
    iat: int  # issued at (epoch)
    jti: str  # unique token id
    iss: str  # issuer
    aud: Union[str, List[str]]
    sub: str
    typ: Optional[str] = None
    azp: Optional[str] = None
    sid: Optional[str] = None
    acr: Optional[str] = None
    allowed_origins: Optional[List[str]] = None
    realm_access: Optional[RealmAccess] = None
    resource_access: Optional[ResourceAccess] = None
    scope: Optional[str] = None
    email_verified: Optional[bool] = None
    name: Optional[str] = None
    preferred_username: Optional[str] = None
    given_name: Optional[str] = None
    family_name: Optional[str] = None
    email: Optional[str] = None
