from __future__ import annotations

from typing import Any, Dict, List
import os

from package_qdrant import QdrantClientWrapper
from package_statement.embeddings import get_openai_embeddings


class VectorService:
    def __init__(self) -> None:
        self.client = QdrantClientWrapper()

    def upsert_transactions(
        self,
        schema: str,
        team_id: str,
        statement_id: int,
        transactions: List[Dict[str, Any]],
    ) -> None:
        # Prepare per-transaction embedding texts; use DB id as transaction_id
        prepared: List[Dict[str, Any]] = []
        for txn in transactions:
            description = str(txn.get("description", "") or "").strip()
            txn_date = str(txn.get("transaction_date", "") or "").strip()
            amount = txn.get("amount")
            txn_type = str(txn.get("type", "") or "").strip()
            txn_id = txn.get("id")

            # Build a richer text representation to embed
            parts: List[str] = []
            if description:
                parts.append(description)
            if txn_type:
                parts.append(f"type: {txn_type}")

            text = " | ".join(parts).strip()
            if not text:
                continue

            # Require DB id to be present for vector keying
            if txn_id is None:
                continue

            prepared.append({
                "text": text,
                "transaction_id": txn_id,
            })

        if not prepared:
            return

        embeddings = get_openai_embeddings()
        vectors = embeddings.embed_documents([p["text"] for p in prepared])
        if not vectors:
            return
        vector_size = len(vectors[0])

        self.client.ensure_collection(schema, vector_size=vector_size)

        points = []
        for item, vector in zip(prepared, vectors):
            payload = {
                "team_id": team_id,
                "statement_id": statement_id,
                "transaction_id": item["transaction_id"],
                "text": item["text"],
                "chunk_index": 0,
            }
            points.append({
                "id": item["transaction_id"],
                "vector": vector,
                "payload": payload,
            })

        if points:
            self.client.upsert_points(schema, points=points, wait=True)

    def delete_vectors_by_statement_id(self, schema: str, statement_id: int) -> None:
        """
        Delete all vectors for the given statement_id from the collection named by `schema`.
        Safe to call even if the collection does not exist or the filter matches nothing.
        """
        try:
            self.client.delete_by_filter(
                collection=schema,
                must={
                    "key": "statement_id",
                    "match": {"value": statement_id},
                },
            )
        except Exception:
            # Do not raise; file deletion should not fail due to vector store issues.
            pass
