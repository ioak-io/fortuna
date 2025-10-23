from __future__ import annotations

from pydantic import Field, AliasChoices
from pydantic_settings import BaseSettings, SettingsConfigDict


class DBSettings(BaseSettings):
    """Database settings with sensible defaults and env-var mapping.

    Env prefix: DATABASE_
    Supported variables:
    - DATABASE_URL (overrides all below if set)
    - DATABASE_HOST, DATABASE_PORT, DATABASE_USER, DATABASE_PASSWORD, DATABASE_DBNAME
    - DATABASE_MIN_SIZE, DATABASE_MAX_SIZE, DATABASE_SSLMODE
    """

    # URL can be provided directly
    url: str | None = Field(
        default=None,
        validation_alias=AliasChoices("DATABASE_URL", "DATABASE_URI"),
        description="Complete PostgreSQL DSN. If provided, it takes precedence.",
    )

    # Granular components
    host: str = Field(default="localhost")
    port: int = Field(default=5432)
    user: str = Field(default="postgres")
    password: str = Field(default="postgres")
    dbname: str = Field(default="postgres")

    # Pool sizing
    min_size: int = Field(default=1, description="Minimum connections in pool")
    max_size: int = Field(default=10, description="Maximum connections in pool")

    # Optional SSL mode
    sslmode: str | None = Field(default=None, description="PostgreSQL sslmode")

    model_config = SettingsConfigDict(
        env_prefix="DATABASE_",
        case_sensitive=False,
        extra="ignore",
    )

    @property
    def dsn(self) -> str:
        if self.url:
            return self.url
        # Compose DSN
        auth = f"{self.user}:{self.password}"
        base = f"postgresql://{auth}@{self.host}:{self.port}/{self.dbname}"
        if self.sslmode:
            return f"{base}?sslmode={self.sslmode}"
        return base
