from __future__ import annotations

import os

from .runners.registry import get_runner


class ChatClient:
    def __init__(self) -> None:
        self.openai_api_key = os.environ.get("OPENAI_API_KEY", "sk-***")

    def _key_for(self, provider: str) -> str:
        p = provider.lower()
        if p in ("openai", "chatgpt"):
            return getattr(self._config, "openai_api_key", "") or ""
        if p == "anthropic":
            return getattr(self._config, "anthropic_api_key", None) or ""
        if p == "gemini":
            return getattr(self._config, "google_api_key", None) or ""
        if p == "deepseek":
            return getattr(self._config, "deepseek_api_key", None) or ""
        raise ValueError(f"Unsupported provider: {provider}")

    def predict(
        self,
        *,
        provider: str,
        model: str,
        uri: str,
        payload: dict,
        format: str = "string",
        api_key: str | None = None,
    ):
        runner = get_runner(provider.lower())
        if not runner:
            raise ValueError(f"Unsupported provider: {provider}")
        key = api_key if api_key is not None else self._key_for(provider)
        return runner.predict(
            api_key=key,
            model=model,
            uri=uri,
            payload=payload,
            format=format,
        )

    def stream_predict(
        self,
        *,
        provider: str,
        model: str,
        uri: str,
        payload: dict,
        api_key: str | None = None,
    ):
        runner = get_runner(provider.lower())
        if not runner or not hasattr(runner, "stream_predict"):
            raise ValueError(
                f"Streaming not supported for provider: {provider}")
        key = api_key if api_key is not None else self._key_for(provider)
        return runner.stream_predict(
            api_key=key,
            model=model,
            uri=uri,
            payload=payload,
        )
