from __future__ import annotations

from typing import Any, Dict, List
import os

from package_qdrant import QdrantClientWrapper
from package_unit.embeddings import get_openai_embeddings


class VectorService:
    def __init__(self) -> None:
        self.client = QdrantClientWrapper()

    def upsert_chunks(
        self,
        schema: str,
        team_id: str,
        unit_id: int,
        file_id: int,
        chunks: List[Any],
    ) -> None:
        if not chunks:
            return
        # Normalize to list of texts
        texts: List[str] = []
        for c in chunks:
            if isinstance(c, str):
                texts.append(c)
            elif isinstance(c, dict):
                texts.append(str(c.get("text", "")))
            else:
                texts.append(str(c))
        # Filter out empty texts
        indexed = [(i, t) for i, t in enumerate(texts) if t]
        if not indexed:
            return

        # Compute embeddings for all non-empty texts
        embeddings = get_openai_embeddings()
        vectors = embeddings.embed_documents([t for _, t in indexed])
        if not vectors:
            return
        vector_size = len(vectors[0])

        self.client.ensure_collection(schema, vector_size=vector_size)

        points = []
        for (i, text), vector in zip(indexed, vectors):
            payload = {
                "team_id": team_id,
                "unit_id": unit_id,
                "file_id": file_id,
                "chunk_index": i
            }
            points.append({"vector": vector, "payload": payload})

        if points:
            self.client.upsert_points(schema, points=points, wait=True)

    def delete_vectors_by_file_id(self, schema: str, file_id: int) -> None:
        """
        Delete all vectors for the given file_id from the collection named by `schema`.
        Safe to call even if the collection does not exist or the filter matches nothing.
        """
        try:
            self.client.delete_by_filter(
                collection=schema,
                must={
                    "key": "file_id",
                    "match": {"value": file_id},
                },
            )
        except Exception:
            # Do not raise; file deletion should not fail due to vector store issues.
            pass
