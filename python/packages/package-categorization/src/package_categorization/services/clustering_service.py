from __future__ import annotations
from sklearn.preprocessing import normalize
from sklearn.cluster import AgglomerativeClustering
from sklearn.metrics.pairwise import cosine_similarity
import hdbscan
import warnings

from typing import Any, Dict, List
import logging
import numpy as np

from package_categorization.utils.schema import make_schema
from package_categorization.embeddings import get_openai_embeddings
from package_qdrant import QdrantClientWrapper
from qdrant_client.http import models as qmodels

logger = logging.getLogger(__name__)


warnings.filterwarnings(
    "ignore",
    category=SyntaxWarning,
    module="hdbscan"
)
warnings.filterwarnings(
    "ignore",
    message="'force_all_finite' was renamed to 'ensure_all_finite'",
    category=FutureWarning,
    module="sklearn"
)


class ClusteringService:
    def __init__(self, db: Any) -> None:
        self.db = db
        self.embeddings = get_openai_embeddings()
        self.qdrant = QdrantClientWrapper()

    def _secondary_cluster(self, schema: str, team_id: str, threshold: float = 0.3):
        """
        Run clustering on centroids to form secondary clusters.
        """
        # fetch all clusters for this team
        sql = f"""
            SELECT id, centroid_vector
            FROM {schema}.transaction_uncategorized_cluster
            WHERE team_id = $1 AND centroid_vector IS NOT NULL
        """
        res = self.db.query(sql, [team_id])
        rows = res.rows if getattr(res, "rows", None) is not None else res
        clusters = [dict(r) for r in rows]

        if not clusters:
            return

        centroids = [np.array(c["centroid_vector"], dtype=float)
                     for c in clusters]
        cluster_ids = [c["id"] for c in clusters]

        if len(centroids) < 2:
            return  # nothing to merge

        sim_matrix = cosine_similarity(centroids)
        dist_matrix = 1 - sim_matrix

        secondary = AgglomerativeClustering(
            metric="precomputed",
            linkage="average",
            distance_threshold=threshold,
            n_clusters=None
        )
        labels = secondary.fit_predict(dist_matrix)

        # update each cluster with its secondary_cluster_id
        for cid, label in zip(cluster_ids, labels):
            sql = f"""
                UPDATE {schema}.transaction_uncategorized_cluster
                SET secondary_cluster_id = $1
                WHERE id = $2
            """
            self.db.query(sql, [int(label), int(cid)])

    def _fetch_transactions_to_cluster(
        self, realm: str, tenant: str, team_id: str
    ) -> List[Dict[str, Any]]:
        schema = make_schema(realm, tenant)
        sql = f"""
            SELECT t.id, t.description, t.type, t.amount, t.transaction_date
            FROM {schema}.transaction t
            WHERE t.team_id = $1
            AND t.category_id IS NULL
            AND NOT EXISTS (
                SELECT 1
                FROM {schema}.transaction_uncategorized_cluster_member cm
                JOIN {schema}.transaction_uncategorized_cluster c
                    ON cm.cluster_id = c.id
                WHERE cm.transaction_id = t.id
                    AND c.confidence IS DISTINCT FROM 'high'
            )
        """
        res = self.db.query(sql, [team_id])

        if not res:
            return []

        if hasattr(res, "rows") and res.rows is not None:
            return [dict(r) for r in res.rows]

        if isinstance(res, list):
            return [dict(r) for r in res]

        return []

    def _get_embeddings(
        self, schema: str, team_id: str, txns: List[Dict[str, Any]]
    ) -> List[List[float]]:
        tx_ids = [int(t["id"]) for t in txns]

        must_filters = [
            qmodels.FieldCondition(
                key="team_id",
                match=qmodels.MatchValue(value=team_id),
            ),
            qmodels.FieldCondition(
                key="transaction_id",
                match=qmodels.MatchAny(any=tx_ids),
            ),
        ]

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

        ordered_vectors: List[List[float]] = []
        for t in txns:
            txn_id = int(t["id"])
            vec = vectors_by_txid.get(txn_id)
            if vec is None:
                raise ValueError(f"Vector not found in Qdrant for {txn_id}")
            ordered_vectors.append(vec)

        return ordered_vectors

    def _create_cluster(
        self, realm: str, tenant: str, team_id: str, confidence: str = "high"
    ) -> int:
        schema = make_schema(realm, tenant)
        sql = (
            f"INSERT INTO {schema}.transaction_uncategorized_cluster "
            f"(team_id, confidence, size) "
            f"VALUES ($1, $2, 0) RETURNING id"
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

        ids_str = ",".join(str(int(x)) for x in transaction_ids)
        sql_delete = f"""
            DELETE FROM {schema}.transaction_uncategorized_cluster_member
            WHERE transaction_id IN ({ids_str})
        """
        self.db.query(sql_delete)

        sql_insert = f"""
            INSERT INTO {schema}.transaction_uncategorized_cluster_member
            (cluster_id, transaction_id)
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING
        """
        for tx_id in transaction_ids:
            self.db.query(sql_insert, [cluster_id, tx_id])

    def _cleanup_clusters(self, schema: str, team_id: str) -> None:
        sql_low_conf = f"""
            DELETE FROM {schema}.transaction_uncategorized_cluster c
            WHERE c.team_id = $1
              AND c.confidence = 'low';
        """
        self.db.query(sql_low_conf, [team_id])

        sql_high_conf_no_members = f"""
            DELETE FROM {schema}.transaction_uncategorized_cluster c
            WHERE c.team_id = $1
              AND c.confidence = 'high'
              AND NOT EXISTS (
                  SELECT 1
                  FROM {schema}.transaction_uncategorized_cluster_member m
                  WHERE m.cluster_id = c.id
              );
        """
        self.db.query(sql_high_conf_no_members, [team_id])

    def _fetch_existing_clusters(self, schema: str, team_id: str) -> List[Dict[str, Any]]:
        sql = f"""
            SELECT id, centroid_vector, size
            FROM {schema}.transaction_uncategorized_cluster
            WHERE team_id = $1
        """
        res = self.db.query(sql, [team_id])

        if not res:
            return []

        if hasattr(res, "rows") and res.rows is not None:
            return [dict(r) for r in res.rows]

        if isinstance(res, list):
            return [dict(r) for r in res]

        return []

    def _assign_to_existing_cluster(
        self,
        schema: str,
        team_id: str,
        txn_id: int,
        vector: List[float],
        clusters: List[Dict[str, Any]],
        threshold: float = 0.8,
    ):
        best_cluster = None
        best_score = 0.0

        for cluster in clusters:
            if not cluster["centroid_vector"]:
                continue
            score = cosine_similarity(
                np.array(vector).reshape(1, -1),
                np.array(cluster["centroid_vector"]).reshape(1, -1),
            )[0][0]

            if score > threshold and score > best_score:
                best_cluster = cluster
                best_score = score

        if best_cluster:
            old_centroid = np.array(
                best_cluster["centroid_vector"], dtype=float)
            old_size = best_cluster["size"] or 0
            new_centroid = (
                (old_centroid * old_size + np.array(vector, dtype=float))
                / (old_size + 1)
            ).astype(float).tolist()

            sql = f"""
                UPDATE {schema}.transaction_uncategorized_cluster
                SET centroid_vector = ARRAY[{','.join(str(x) for x in new_centroid)}]::double precision[]
                WHERE id = $1
            """
            self.db.query(sql, [best_cluster["id"]])
            self._add_transactions_to_cluster(
                schema, team_id, best_cluster["id"], [txn_id]
            )
            return best_cluster["id"], best_score

        return None, 0.0

    def _cluster_cohesion(self, vectors: List[List[float]]) -> float:
        """Measure average cosine similarity of points to the centroid."""
        if not vectors:
            return 0.0
        X = normalize(np.array(vectors, dtype=float))
        centroid = np.mean(X, axis=0)
        centroid = centroid / np.linalg.norm(centroid)
        sims = [np.dot(vec, centroid) for vec in X]
        return float(np.mean(sims))

    def cluster_uncategorized_transactions(
        self,
        realm: str,
        tenant: str,
        team_id: str,
        min_cluster_size: int = 5,
        min_samples: int = 3,
        cohesion_threshold: float = 0.9,
        recluster_min_size: int = 6,
    ) -> List[Dict[str, Any]]:
        schema = make_schema(realm, tenant)

        self._cleanup_clusters(schema, team_id)

        txns = self._fetch_transactions_to_cluster(realm, tenant, team_id)
        if not txns:
            return []

        vectors = self._get_embeddings(schema, team_id, txns)
        if not vectors:
            return []

        results: List[Dict[str, Any]] = []

        # --- Normalize for cosine-equivalent Euclidean ---
        X = normalize(np.array(vectors, dtype=float))

        # --- First pass: high confidence HDBSCAN ---
        clusterer = hdbscan.HDBSCAN(
            min_cluster_size=min_cluster_size,
            min_samples=min_samples,
            metric="euclidean",
        )
        labels = clusterer.fit_predict(X)

        noise_indices = []
        clustered_txns: Dict[int, List[int]] = {}
        clustered_vectors: Dict[int, List[List[float]]] = {}

        for idx, label in enumerate(labels):
            if label == -1:
                noise_indices.append(idx)
                continue
            clustered_txns.setdefault(label, []).append(int(txns[idx]["id"]))
            clustered_vectors.setdefault(label, []).append(vectors[idx])

        # --- Evaluate clusters ---
        for label, member_tx_ids in clustered_txns.items():
            member_vectors = clustered_vectors[label]
            centroid = _average_vector(member_vectors)

            cohesion = self._cluster_cohesion(member_vectors)

            print(cohesion, cohesion_threshold, len(
                member_tx_ids), recluster_min_size)

            if cohesion < cohesion_threshold and len(member_tx_ids) >= recluster_min_size:
                # --- Step 1: Create a temporary cluster for the low cohesion group ---
                parent_cluster_id = self._create_cluster(
                    realm, tenant, team_id, confidence="low"
                )
                sql = f"""
                    UPDATE {schema}.transaction_uncategorized_cluster
                    SET centroid_vector = ARRAY[{','.join(str(x) for x in centroid)}]::double precision[]
                    WHERE id = $1
                """
                self.db.query(sql, [parent_cluster_id])
                self._add_transactions_to_cluster(
                    realm, tenant, team_id, parent_cluster_id, member_tx_ids
                )

                # --- Step 2: Recluster inside this group ---
                sub_X = normalize(np.array(member_vectors, dtype=float))
                sub_clusterer = hdbscan.HDBSCAN(
                    min_cluster_size=2, min_samples=1, metric="euclidean"
                )
                sub_labels = sub_clusterer.fit_predict(sub_X)

                subclusters: Dict[int, List[int]] = {}
                sub_vectors: Dict[int, List[List[float]]] = {}
                for i, sub_label in enumerate(sub_labels):
                    if sub_label == -1:
                        continue
                    subclusters.setdefault(
                        sub_label, []).append(member_tx_ids[i])
                    sub_vectors.setdefault(
                        sub_label, []).append(member_vectors[i])

                # --- Step 4: Create subclusters ---
                for sub_label, sub_ids in subclusters.items():
                    sub_centroid = _average_vector(sub_vectors[sub_label])
                    cluster_id = self._create_cluster(
                        realm, tenant, team_id, confidence="low"
                    )
                    sql = f"""
                        UPDATE {schema}.transaction_uncategorized_cluster
                        SET centroid_vector = ARRAY[{','.join(str(x) for x in sub_centroid)}]::double precision[]
                        WHERE id = $1
                    """
                    self.db.query(sql, [cluster_id])
                    self._add_transactions_to_cluster(
                        realm, tenant, team_id, cluster_id, sub_ids
                    )

                    results.append({
                        "cluster_id": cluster_id,
                        "transaction_ids": sub_ids,
                        "centroid_vector": sub_centroid,
                        "confidence": "low",
                        "note": "split from low cohesion cluster"
                    })

            else:
                # keep original cluster
                cluster_id = self._create_cluster(
                    realm, tenant, team_id, confidence="high" if cohesion >= cohesion_threshold else "low"
                )
                sql = f"""
                    UPDATE {schema}.transaction_uncategorized_cluster
                    SET centroid_vector = ARRAY[{','.join(str(x) for x in centroid)}]::double precision[]
                    WHERE id = $1
                """
                self.db.query(sql, [cluster_id])
                self._add_transactions_to_cluster(
                    realm, tenant, team_id, cluster_id, member_tx_ids
                )

                results.append({
                    "cluster_id": cluster_id,
                    "transaction_ids": member_tx_ids,
                    "centroid_vector": centroid,
                    "confidence": "high" if cohesion >= cohesion_threshold else "low",
                    "cohesion": cohesion,
                })

        # --- Second pass: noise handling ---
        if noise_indices:
            if len(noise_indices) >= 2:
                noise_vectors = [vectors[i] for i in noise_indices]
                noise_txns = [txns[i] for i in noise_indices]

                X_noise = normalize(np.array(noise_vectors, dtype=float))
                loose_clusterer = hdbscan.HDBSCAN(
                    min_cluster_size=2, min_samples=1, metric="euclidean"
                )
                loose_labels = loose_clusterer.fit_predict(X_noise)

                loose_clusters: Dict[int, List[int]] = {}
                loose_vectors: Dict[int, List[List[float]]] = {}
                for i, label in enumerate(loose_labels):
                    if label == -1:
                        continue
                    loose_clusters.setdefault(label, []).append(
                        int(noise_txns[i]["id"]))
                    loose_vectors.setdefault(
                        label, []).append(noise_vectors[i])

                for label, member_tx_ids in loose_clusters.items():
                    centroid = _average_vector(loose_vectors[label])
                    cluster_id = self._create_cluster(
                        realm, tenant, team_id, confidence="low"
                    )
                    sql = f"""
                        UPDATE {schema}.transaction_uncategorized_cluster
                        SET centroid_vector = ARRAY[{','.join(str(x) for x in centroid)}]::double precision[]
                        WHERE id = $1
                    """
                    self.db.query(sql, [cluster_id])
                    self._add_transactions_to_cluster(
                        realm, tenant, team_id, cluster_id, member_tx_ids
                    )

                    results.append({
                        "cluster_id": cluster_id,
                        "transaction_ids": member_tx_ids,
                        "centroid_vector": centroid,
                        "confidence": "low",
                    })

            elif len(noise_indices) == 1:
                idx = noise_indices[0]
                tx = txns[idx]
                vec = vectors[idx]

                cluster_id = self._create_cluster(
                    realm, tenant, team_id, confidence="low")
                sql = f"""
                    UPDATE {schema}.transaction_uncategorized_cluster
                    SET centroid_vector = ARRAY[{','.join(str(x) for x in vec)}]::double precision[]
                    WHERE id = $1
                """
                self.db.query(sql, [cluster_id])
                self._add_transactions_to_cluster(
                    realm, tenant, team_id, cluster_id, [tx["id"]]
                )

                results.append({
                    "cluster_id": cluster_id,
                    "transaction_ids": [tx["id"]],
                    "centroid_vector": vec,
                    "confidence": "low",
                })

        # --- Secondary clustering step ---
        self._secondary_cluster(schema, team_id)

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

        best_cat, best_count = max(counts.items(), key=lambda kv: kv[1])
        confidence = best_count / float(total)
        suggested = best_cat if confidence >= min_confidence else None

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
    return np.mean(np.array(vectors, dtype=float), axis=0).astype(float).tolist()
