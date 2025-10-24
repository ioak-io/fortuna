from __future__ import annotations

import os
from langchain_openai import OpenAIEmbeddings


def get_openai_embeddings(*, model: str = "text-embedding-3-small") -> OpenAIEmbeddings:
    api_key = os.getenv("OPENAI_API_KEY")
    kwargs = {"model": model}
    if api_key:
        kwargs["api_key"] = api_key
    return OpenAIEmbeddings(**kwargs)


