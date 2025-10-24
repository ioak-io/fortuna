from __future__ import annotations

from typing import Any, Dict, List, Optional
import logging

import numpy as np
from sklearn.preprocessing import normalize
import hdbscan

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

    # -----------------------------
    # Fetch uncategorized transactions
    # -----------------------------
    def fetch_uncategorized_transactions(
        self, realm: str, tenant: str, team_id: str
    ) -> List[Dict[str, Any]]:
        """
        Fetch transactions with NULL category_id for a given team.
        """
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

    # -----------------------------
    # Embedding helpers
    # -----------------------------
    def _get_or_create_embeddings(
        self, schema: str, txns: List[Dict[str, Any]]
    ) -> List[List[float]]:
        """
        For each transaction, fetch embedding from Qdrant if it exists.
        If not, compute and upsert it.
        """
        texts = [_txn_text(t) for t in txns]
        ids = [int(t["id"]) for t in txns]

        vectors: List[List[float]] = []

        # Pull existing vectors from Qdrant
        existing = self.qdrant.raw.retrieve(
            collection_name=schema, ids=ids, with_payload=False
        )
        existing_map = {int(r.id): r.vector for r in existing or []}

        to_compute = []
        to_compute_ids = []

        for tx, txt in zip(txns, texts):
            tx_id = int(tx["id"])
            if tx_id in existing_map and existing_map[tx_id] is not None:
                vectors.append(existing_map[tx_id])
            else:
                to_compute.append(txt)
                to_compute_ids.append(tx_id)

        # Embed missing ones
        if to_compute:
            logger.info(f"Embedding {len(to_compute)} new transactions...")
            new_vecs = self.embeddings.embed_documents(to_compute)

            # Upsert into Qdrant for caching
            self.qdrant.raw.upsert(
                collection_name=schema,
                points=[
                    qmodels.PointStruct(
                        id=tx_id, vector=vec, payload={"transaction_id": tx_id}
                    )
                    for tx_id, vec in zip(to_compute_ids, new_vecs)
                ],
            )

            vectors.extend(new_vecs)

        return vectors

    # -----------------------------
    # Category updates
    # -----------------------------
    def update_transaction_category(
        self,
        realm: str,
        tenant: str,
        team_id: str,
        transaction_ids: List[int],
        category_id: int,
    ) -> None:
        """
        Update category_id in Postgres and Qdrant payloads.
        """
        if not transaction_ids:
            return

        schema = make_schema(realm, tenant)

        # Update Postgres
        sql = (
            f"UPDATE {schema}.transaction "
            f"SET category_id = $3 "
            f"WHERE team_id = $1 AND id = ANY($2)"
        )
        self.db.query(sql, [team_id, transaction_ids, category_id])

        # Update Qdrant
        try:
            self.qdrant.raw.set_payload(
                collection_name=schema,
                payload={"category_id": category_id},
                points=transaction_ids,
            )
        except Exception as e:
            logger.warning(f"Qdrant update failed: {e}")

    # -----------------------------
    # Cluster management
    # -----------------------------
    def create_cluster(
        self,
        realm: str,
        tenant: str,
        team_id: str,
        suggested_category_id: Optional[int] | None = None,
        confidence: Optional[float] | None = None,
    ) -> int:
        schema = make_schema(realm, tenant)
        sql = (
            f"INSERT INTO {schema}.category_cluster "
            f"(team_id, suggested_category_id, confidence) "
            f"VALUES ($1, $2, $3) RETURNING id"
        )
        res = self.db.query(sql, [team_id, suggested_category_id, confidence])
        rows = res.rows if getattr(res, "rows", None) is not None else res
        return int(rows[0]["id"]) if rows else 0

    def add_transactions_to_cluster(
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
            f"INSERT INTO {schema}.category_cluster_transaction (cluster_id, transaction_id) "
            f"VALUES ($1, $2) ON CONFLICT DO NOTHING"
        )
        for tx_id in transaction_ids:
            self.db.query(sql, [cluster_id, tx_id])

    def delete_cluster(
        self,
        realm: str,
        tenant: str,
        team_id: str,
        cluster_id: int,
    ) -> None:
        schema = make_schema(realm, tenant)
        self.db.query(
            f"DELETE FROM {schema}.category_cluster_transaction WHERE cluster_id = $1",
            [cluster_id],
        )
        self.db.query(
            f"DELETE FROM {schema}.category_cluster WHERE id = $1", [
                cluster_id]
        )

    # -----------------------------
    # Main clustering flow
    # -----------------------------
    def cluster_uncategorized_transactions(
        self,
        realm: str,
        tenant: str,
        team_id: str,
        min_cluster_size: int = 2,
    ) -> List[Dict[str, Any]]:
        """
        Fetch uncategorized transactions, embed (cached), cluster with HDBSCAN.
        """
        txns = self.fetch_uncategorized_transactions(realm, tenant, team_id)
        if not txns:
            return []

        schema = make_schema(realm, tenant)

        vectors = self._get_or_create_embeddings(schema, txns)
        if not vectors:
            return []

        # Normalize embeddings
        X = normalize(np.array(vectors))

        # Density-based clustering
        clusterer = hdbscan.HDBSCAN(
            min_cluster_size=min_cluster_size, metric="euclidean")
        labels = clusterer.fit_predict(X)

        results: List[Dict[str, Any]] = []
        clustered_txns: Dict[int, List[int]] = {}

        for idx, label in enumerate(labels):
            if label == -1:  # noise
                continue
            clustered_txns.setdefault(label, []).append(int(txns[idx]["id"]))

        for label, member_tx_ids in clustered_txns.items():
            member_vectors = [vectors[i]
                              for i, l in enumerate(labels) if l == label]
            centroid = _average_vector(member_vectors)

            cluster_id = self.create_cluster(realm, tenant, team_id)
            self.add_transactions_to_cluster(
                realm, tenant, team_id, cluster_id, member_tx_ids
            )

            results.append(
                {
                    "cluster_id": cluster_id,
                    "transaction_ids": member_tx_ids,
                    "centroid_vector": centroid,
                }
            )

        return results

    # -----------------------------
    # Assign suggestion to a cluster
    # -----------------------------
    def assign_cluster_suggestions(
        self,
        realm: str,
        tenant: str,
        team_id: str,
        cluster: Dict[str, Any],
        top_k: int = 50,
        min_confidence: float = 0.6,
    ) -> Dict[str, Any]:
        """
        Suggest category for a cluster via nearest neighbors in Qdrant.
        """
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

        # Persist suggestion
        try:
            self.db.query(
                f"UPDATE {schema}.category_cluster SET suggested_category_id = $2, confidence = $3 WHERE id = $1",
                [int(cluster.get("cluster_id", 0)), suggested, confidence],
            )
        except Exception as e:
            logger.warning(f"Failed to update suggestion: {e}")

        return {
            "cluster_id": int(cluster.get("cluster_id", 0)),
            "suggested_category_id": suggested,
            "confidence_score": confidence,
        }

    # -----------------------------
    # Final categorization
    # -----------------------------
    def categorize_cluster(
        self,
        realm: str,
        tenant: str,
        team_id: str,
        cluster_id: int,
        category_id: int,
    ) -> None:
        """
        - Update all transactions in cluster
        - Update embeddings in Qdrant
        - Delete the cluster
        """
        schema = make_schema(realm, tenant)
        res = self.db.query(
            f"SELECT transaction_id FROM {schema}.category_cluster_transaction WHERE cluster_id = $1",
            [cluster_id],
        )
        rows = res.rows if getattr(res, "rows", None) is not None else res
        tx_ids = [int(r.get("transaction_id"))
                  for r in rows if r.get("transaction_id")]

        if not tx_ids:
            self.delete_cluster(realm, tenant, team_id, cluster_id)
            return

        self.update_transaction_category(
            realm, tenant, team_id, tx_ids, category_id
        )
        self.delete_cluster(realm, tenant, team_id, cluster_id)

    def handle_user_category_decision(
        self,
        realm: str,
        tenant: str,
        team_id: str,
        cluster_id: int,
        category_id: int,
    ) -> None:
        self.categorize_cluster(realm, tenant, team_id,
                                cluster_id, category_id)


# -----------------------------
# Internal helpers
# -----------------------------
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
