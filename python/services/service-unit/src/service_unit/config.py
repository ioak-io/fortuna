from __future__ import annotations

from pydantic import Field, AliasChoices
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables or defaults.

    Environment variables use the prefix SERVICE_UNIT_. For example:
    - SERVICE_UNIT_APP_NAME
    - SERVICE_UNIT_VERSION
    - SERVICE_UNIT_HOST
    - SERVICE_UNIT_PORT
    - SERVICE_UNIT_DEBUG
    """

    app_name: str = Field(default="service-unit",
                          description="Application name")
    version: str = Field(default="1.0.0", description="Application version")

    host: str = Field(default="0.0.0.0",
                      description="Host for the ASGI server")
    port: int = Field(default=8000, description="Port for the ASGI server")
    debug: bool = Field(
        default=True, description="Enable autoreload and debug mode")

    # External dependencies / integrations
    # Will read from either SERVICE_UNIT_KEYCLOAK_URL or KEKCLOAK_URL
    keycloak_url: str = Field(
        default="http://localhost:8080",
        description="Keycloak base URL",
        validation_alias=AliasChoices("SERVICE_UNIT_KEYCLOAK_URL", "KEYCLOAK_URL"),
    )

    # pydantic-settings v2 config
    model_config = SettingsConfigDict(
        env_prefix="SERVICE_UNIT_",
        env_file=(
        ),
        case_sensitive=False,
        extra="ignore",
    )


settings = Settings()
