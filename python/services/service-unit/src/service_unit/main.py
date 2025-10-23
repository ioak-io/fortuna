from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import logging

from package_middlewares.jwt import verify_and_get_claims
from package_middlewares.tenantDb import tenant_db
from package_middlewares.auth import tenant_access
from package_database import DBSettings as DBSettingsDB, init_pool as db_init_pool, fetch_val as db_fetch_val
from .middlewares.team import team_context

from .api.routes import router
from .config import settings

# Ensure INFO-level logs from package_unit.* appear in console
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)

app = FastAPI(
    title="service-unit",
    version="1.0.0",
    description="FastAPI service using package-unit",
    docs_url="/docs",
    redoc_url="/redoc",
    dependencies=[Depends(verify_and_get_claims), Depends(tenant_db), Depends(team_context)]
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router)


@app.get("/")
async def root() -> dict[str, str]:
    """Root endpoint providing basic API information."""
    return {
        "message": f"Welcome to {settings.app_name}",
        "version": settings.version,
        "docs": "/docs",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
    )
