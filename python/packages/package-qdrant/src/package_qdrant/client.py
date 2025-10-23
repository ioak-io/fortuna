from __future__ import annotations

import os
import uuid
from typing import Any, Dict, Iterable, List, Optional

from qdrant_client import QdrantClient
from qdrant_client.http import models as qmodels


class QdrantClientWrapper:
    """
    Thin wrapper around QdrantClient to:
    - initialize from env vars
    - ensure collection exists with given vector size
    - upsert points with payloads
    """

    def __init__(
        self,
        *,
        url: Optional[str] = None,
        host: Optional[str] = None,
        port: Optional[int] = None,
        api_key: Optional[str] = None,
        prefer_grpc: bool | None = None,
        timeout: Optional[float] = None,
    ) -> None:
        env_url = url or os.getenv("QDRANT_URL")
        env_api_key = api_key or os.getenv("QDRANT_API_KEY")
        env_host = host or os.getenv("QDRANT_HOST")
        env_port = port or (int(os.getenv("QDRANT_PORT"))
                            if os.getenv("QDRANT_PORT") else None)

        kwargs: Dict[str, Any] = {}
        if env_url:
            kwargs["url"] = env_url
        if env_host:
            kwargs["host"] = env_host
        if env_port:
            kwargs["port"] = env_port
        if env_api_key:
            kwargs["api_key"] = env_api_key
        if prefer_grpc is not None:
            kwargs["prefer_grpc"] = prefer_grpc
        if timeout is not None:
            kwargs["timeout"] = timeout

        self._client = QdrantClient(**kwargs)

    @property
    def raw(self) -> QdrantClient:
        return self._client

    def ensure_collection(
        self,
        name: str,
        *,
        vector_size: int,
        distance: qmodels.Distance = qmodels.Distance.COSINE,
        on_disk: bool | None = None,
    ) -> None:
        """Create the collection if it does not exist."""
        collections = self._client.get_collections()
        existing = {c.name for c in collections.collections or []}
        if name in existing:
            # Optionally verify vector params match expected; skip for brevity
            return

        vectors_config = qmodels.VectorParams(
            size=vector_size, distance=distance, on_disk=on_disk)
        self._client.create_collection(
            collection_name=name,
            vectors_config=vectors_config,
        )

    def upsert_points(
        self,
        collection: str,
        points: Iterable[Dict[str, Any]],
        wait: bool = True,
    ) -> None:
        """
        Upsert points into a collection.
        Each point dict should have keys: id, vector (List[float]), payload (Dict)
        """
        payload_points: List[qmodels.PointStruct] = []
        for p in points:
            payload_points.append(
                qmodels.PointStruct(
                    id=p.get("id") or str(uuid.uuid4()),
                    vector=p["vector"],
                    payload=p.get("payload", {}),
                )
            )
        self._client.upsert(collection_name=collection,
                            points=payload_points, wait=wait)

    def delete_by_filter(self, collection: str, must: Dict[str, Any]) -> None:
        self._client.delete(
            collection_name=collection,
            points_selector=qmodels.Filter(
                must=[qmodels.FieldCondition(**must)])
        )

    def search(
        self,
        collection: str,
        vector: List[float],
        top_k: int = 10,
        must_filters: Optional[List[qmodels.FieldCondition]] = None,
        with_payload: bool = True,
    ):
        qfilter = None
        if must_filters:
            qfilter = qmodels.Filter(must=must_filters)

        results = self._client.search(
            collection_name=collection,
            query_vector=vector,
            limit=top_k,
            with_payload=with_payload,
            query_filter=qfilter,
        )
        return results
