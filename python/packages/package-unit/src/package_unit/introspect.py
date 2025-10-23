from __future__ import annotations

from .types import LLMConfig


def metadata_from_config(cfg: LLMConfig) -> dict[str, str | int]:
    """Return safe-to-log metadata about the config, masking secrets."""

    def _mask(val: str) -> str:
        return (val[:4] + "***") if val else "none"

    return {
        "qdrant_host": cfg.qdrant_host,
        "qdrant_port": cfg.qdrant_port,
        "qdrant_grpc_port": cfg.qdrant_grpc_port,
        "qdrant_api_key": _mask(cfg.qdrant_api_key),
        "openai_api_key": _mask(cfg.openai_api_key),
    }
