from __future__ import annotations

from typing import Any, Dict, List, Optional
import hdbscan
import logging

import numpy as np
from sklearn.preprocessing import normalize

from package_categorization.utils.schema import make_schema
from package_categorization.embeddings import get_openai_embeddings
from package_qdrant import QdrantClientWrapper
from qdrant_client.http import models as qmodels

logger = logging.getLogger(__name__)


class ClusteringService:
    def __init__(self, db: Any) -> None:
        self.db = db
        self.embeddings = get_openai_embeddings()
        self.qdrant = QdrantClientWrapper()

    def _fetch_transactions_to_cluster(
        self, realm: str, tenant: str, team_id: str
    ) -> List[Dict[str, Any]]:
        schema = make_schema(realm, tenant)
        sql = (
            f"SELECT id, description, type, amount, transaction_date "
            f"FROM {schema}.transaction "
            f"WHERE team_id = $1 AND category_id IS NULL "
            f"ORDER BY transaction_date ASC, id ASC"
        )
        res = self.db.query(sql, [team_id])
        rows = res.rows if getattr(res, "rows", None) is not None else res
        return [dict(r) for r in rows]

    def _get_embeddings(
        self, schema: str, team_id: str, txns: List[Dict[str, Any]]
    ) -> List[List[float]]:
        texts = [_txn_text(t) for t in txns]
        tx_ids = [int(t["id"]) for t in txns]

        # Build filter
        must_filters = [
            qmodels.FieldCondition(
                key="team_id",
                match=qmodels.MatchValue(value=team_id)
            ),
            qmodels.FieldCondition(
                key="transaction_id",
                match=qmodels.MatchAny(any=tx_ids)
            )
        ]

        # Fetch all matching records with vectors
        vectors_by_txid: Dict[int, List[float]] = {}

        for rec in self.qdrant.scroll(
            collection=schema,
            batch_size=100,
            must_filters=must_filters,
            with_payload=True,
            with_vectors=True,
        ):
            txn_id = rec.payload.get("transaction_id")
            if txn_id is not None:
                vectors_by_txid[int(txn_id)] = rec.vector

        # Reorder to match input txns
        ordered_vectors: List[List[float]] = []
        for t in txns:
            txn_id = int(t["id"])
            vec = vectors_by_txid.get(txn_id)
            if vec is None:
                raise ValueError(
                    f"Vector not found in Qdrant for transaction {txn_id}")
            ordered_vectors.append(vec)

        return ordered_vectors

    def _create_cluster(
        self,
        realm: str,
        tenant: str,
        team_id: str,
        confidence: str = "high"
    ) -> int:
        schema = make_schema(realm, tenant)
        sql = (
            f"INSERT INTO {schema}.transaction_uncategorized_cluster (team_id, confidence) "
            f"VALUES ($1, $2) RETURNING id"
        )
        res = self.db.query(sql, [team_id, confidence])
        rows = res.rows if getattr(res, "rows", None) is not None else res
        return int(rows[0]["id"]) if rows else 0

    def _add_transactions_to_cluster(
        self,
        realm: str,
        tenant: str,
        team_id: str,
        cluster_id: int,
        transaction_ids: List[int],
    ) -> None:
        if not transaction_ids:
            return
        schema = make_schema(realm, tenant)
        sql = (
            f"INSERT INTO {schema}.transaction_uncategorized_cluster_member (cluster_id, transaction_id) "
            f"VALUES ($1, $2) ON CONFLICT DO NOTHING"
        )
        for tx_id in transaction_ids:
            self.db.query(sql, [cluster_id, tx_id])

    def cluster_uncategorized_transactions(
        self,
        realm: str,
        tenant: str,
        team_id: str,
        min_cluster_size: int = 5,
    ) -> List[Dict[str, Any]]:
        schema = make_schema(realm, tenant)

        # --- cleanup previous staging clusters for this team ---
        self.db.query(
            f"""
            DELETE FROM {schema}.transaction_uncategorized_cluster_member
            WHERE cluster_id IN (
                SELECT id FROM {schema}.transaction_uncategorized_cluster WHERE team_id = $1
            )
            """,
            [team_id],
        )
        self.db.query(
            f"DELETE FROM {schema}.transaction_uncategorized_cluster WHERE team_id = $1",
            [team_id],
        )

        # --- fetch uncategorized transactions ---
        txns = self._fetch_transactions_to_cluster(realm, tenant, team_id)
        if not txns:
            return []

        vectors = self._get_embeddings(schema, team_id, txns)
        if not vectors:
            return []

        # Normalize embeddings
        X = normalize(np.array(vectors))

        results: List[Dict[str, Any]] = []

        # --- First pass: high confidence clustering ---
        clusterer = hdbscan.HDBSCAN(
            min_cluster_size=min_cluster_size, metric="euclidean"
        )
        labels = clusterer.fit_predict(X)

        clustered_txns: Dict[int, List[int]] = {}
        noise_indices: List[int] = []

        for idx, label in enumerate(labels):
            if label == -1:
                noise_indices.append(idx)
                continue
            clustered_txns.setdefault(label, []).append(int(txns[idx]["id"]))

        for label, member_tx_ids in clustered_txns.items():
            member_vectors = [vectors[i]
                              for i, l in enumerate(labels) if l == label]
            centroid = _average_vector(member_vectors)

            cluster_id = self._create_cluster(
                realm, tenant, team_id, confidence="high")
            self._add_transactions_to_cluster(
                realm, tenant, team_id, cluster_id, member_tx_ids
            )

            results.append(
                {
                    "cluster_id": cluster_id,
                    "transaction_ids": member_tx_ids,
                    "centroid_vector": centroid,
                    "confidence": "high",
                }
            )

        # --- Second pass: looser clustering on noise ---
        if noise_indices:
            noise_vectors = [vectors[i] for i in noise_indices]
            noise_txns = [txns[i] for i in noise_indices]

            loose_clusterer = hdbscan.HDBSCAN(
                min_cluster_size=2,  # looser threshold
                min_samples=1,
                metric="euclidean"
            )
            loose_labels = loose_clusterer.fit_predict(noise_vectors)

            loose_txns: Dict[int, List[int]] = {}
            for idx, label in enumerate(loose_labels):
                if label == -1:
                    continue  # still unclustered
                loose_txns.setdefault(label, []).append(
                    int(noise_txns[idx]["id"]))

            for label, member_tx_ids in loose_txns.items():
                member_vectors = [noise_vectors[i]
                                  for i, l in enumerate(loose_labels) if l == label]
                centroid = _average_vector(member_vectors)

                cluster_id = self._create_cluster(
                    realm, tenant, team_id, confidence="low")
                self._add_transactions_to_cluster(
                    realm, tenant, team_id, cluster_id, member_tx_ids
                )

                results.append(
                    {
                        "cluster_id": cluster_id,
                        "transaction_ids": member_tx_ids,
                        "centroid_vector": centroid,
                        "confidence": "low",
                    }
                )

        return results

    def assign_cluster_suggestions(
        self,
        realm: str,
        tenant: str,
        team_id: str,
        cluster: Dict[str, Any],
        top_k: int = 50,
        min_confidence: float = 0.6,
    ) -> Dict[str, Any]:
        schema = make_schema(realm, tenant)
        centroid: List[float] = list(cluster.get("centroid_vector") or [])
        if not centroid:
            return {
                "cluster_id": int(cluster.get("cluster_id", 0)),
                "suggested_category_id": None,
                "confidence_score": 0.0,
            }

        # Search neighbors
        team_filter = qmodels.FieldCondition(
            key="team_id", match=qmodels.MatchValue(value=team_id)
        )
        results = self.qdrant.search(
            collection=schema,
            vector=centroid,
            top_k=top_k,
            must_filters=[team_filter],
            with_payload=True,
        )

        neighbor_ids = [
            r.payload.get("transaction_id")
            for r in results or []
            if r.payload and isinstance(r.payload.get("transaction_id"), int)
        ]
        if not neighbor_ids:
            return {
                "cluster_id": int(cluster.get("cluster_id", 0)),
                "suggested_category_id": None,
                "confidence_score": 0.0,
            }

        # Fetch categories from DB
        sql = (
            f"SELECT id, category_id FROM {schema}.transaction "
            f"WHERE team_id = $1 AND id = ANY($2) AND category_id IS NOT NULL"
        )
        res = self.db.query(sql, [team_id, neighbor_ids])
        rows = res.rows if getattr(res, "rows", None) is not None else res

        counts: Dict[int, int] = {}
        total = 0
        for row in rows:
            cat_id = row.get("category_id")
            if isinstance(cat_id, int):
                counts[cat_id] = counts.get(cat_id, 0) + 1
                total += 1

        if total == 0:
            return {
                "cluster_id": int(cluster.get("cluster_id", 0)),
                "suggested_category_id": None,
                "confidence_score": 0.0,
            }

        # Majority vote
        best_cat, best_count = max(counts.items(), key=lambda kv: kv[1])
        confidence = best_count / float(total)
        suggested = best_cat if confidence >= min_confidence else None

        # Note: No persistence of suggestion as cluster table does not store it

        return {
            "cluster_id": int(cluster.get("cluster_id", 0)),
            "suggested_category_id": suggested,
            "confidence_score": confidence,
        }


def _txn_text(tx: Dict[str, Any]) -> str:
    description = str(tx.get("description", "") or "").strip()
    txn_type = str(tx.get("type", "") or "").strip()
    parts: List[str] = []
    if description:
        parts.append(description)
    if txn_type:
        parts.append(f"type: {txn_type}")
    return " | ".join(parts) if parts else description


def _average_vector(vectors: List[List[float]]) -> List[float]:
    if not vectors:
        return []
    return list(np.mean(np.array(vectors), axis=0))
