from __future__ import annotations


def make_schema(realm: str, tenant: str) -> str:
    return f"{realm}_{tenant}"


