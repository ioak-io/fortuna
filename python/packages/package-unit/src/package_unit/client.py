from __future__ import annotations

from .types import LLMConfig
from .introspect import metadata_from_config
from .runners.registry import get_runner as _get_runner
from .clients.chat import ChatClient


class LLMClient:

    def __init__(self, config: LLMConfig) -> None:
        self._config = config
        # Initialize sub-clients with full config for flexibility
        self.chat = ChatClient(config)

    @property
    def config(self) -> LLMConfig:
        return self._config

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
        return self.chat.predict(
            provider=provider,
            model=model,
            uri=uri,
            payload=payload,
            format=format,
            api_key=api_key,
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
        return self.chat.stream_predict(
            provider=provider,
            model=model,
            uri=uri,
            payload=payload,
            api_key=api_key,
        )

    def metadata(self) -> dict[str, str | int]:
        return metadata_from_config(self._config)
