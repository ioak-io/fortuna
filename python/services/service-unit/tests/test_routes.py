import pytest
from httpx import AsyncClient
from fastapi import status

from service_unit.main import app


@pytest.mark.asyncio
async def test_info_route():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.get("/info")
    assert resp.status_code == status.HTTP_200_OK
    data = resp.json()
    assert data["service"] == "service-unit"
