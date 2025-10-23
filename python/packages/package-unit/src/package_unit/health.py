from __future__ import annotations

import os
from typing import Any

from .runners.registry import runner_registry


def health_check() -> dict[str, Any]:
    """Return health information for package-unit runners and API keys.

    This does not make external network calls; it only verifies configuration presence
    and known providers.
    """
    providers = sorted(list(runner_registry.keys()))

    # Basic visibility into configured keys (masked)
    keys = {
        "openai": bool(os.getenv("OPENAI_API_KEY")),
        "anthropic": bool(os.getenv("ANTHROPIC_API_KEY")),
        "gemini": bool(os.getenv("GOOGLE_API_KEY")),
        "deepseek": bool(os.getenv("DEEPSEEK_API_KEY")),
    }

    return {
        "status": "healthy",
        "providers": providers,
        "configured_keys": keys,
        "package": "package-unit",
        "version": "0.1.0",
    }
