from typing import Any, Dict, List, Optional, Tuple
import random
import numpy as np
from package_qdrant import QdrantClientWrapper
from qdrant_client.http import models as qmodels
from package_statement.utils.schema import make_schema


class ClusteringService:
    """
    Ephemeral clustering service:
    - On-demand discovery of dense clusters of uncategorized transactions.
    - Supports progressive clustering: one cluster at a time.
    """

    def __init__(self, db: Any, sample_size: int = 200, k_neighbors: int = 30) -> None:
        self.db = db
        self.qdrant = QdrantClientWrapper()
        self.sample_size = sample_size
        self.k_neighbors = k_neighbors

    def _get_uncategorized_ids(self, schema: str, team_id: str) -> List[int]:
        """
        Query the DB for uncategorized transactions.
        Only IDs are needed for clustering.
        """
        print(schema)
        sql = f"""
            SELECT id
            FROM {schema}.transaction
            WHERE team_id = $1
            AND category_id IS NULL
        """
        res = self.db.query(sql, [team_id])

        rows = getattr(res, "rows", None)
        if rows is None:
            rows = res

        ids: List[int] = []
        for r in rows:
            if isinstance(r, dict):
                ids.append(r.get("id"))
            elif isinstance(r, (list, tuple)):
                ids.append(r[0])
            elif hasattr(r, "id"):  # e.g. row as namespace
                ids.append(r.id)
        return [i for i in ids if i is not None]

    def _sample_candidates(self, ids: List[int]) -> List[int]:
        if len(ids) <= self.sample_size:
            return ids
        return random.sample(ids, self.sample_size)

    def _compute_density_score(
        self, schema: str, center_id: int, team_id: str, sim_threshold: float = 0.8
    ) -> Tuple[int, List[qmodels.ScoredPoint]]:
        """
        Use Qdrant to fetch nearest neighbors for a given transaction.
        Density = number of neighbors above similarity threshold.
        """
        # Scroll to get vector of this ID
        records = list(self.qdrant.scroll(
            collection=schema,
            must_filters=[
                qmodels.FieldCondition(key="transaction_id", match={
                                       "value": center_id}),
                qmodels.FieldCondition(
                    key="team_id", match={"value": team_id}),
            ],
            with_vectors=True,
            batch_size=1,
        ))
        if not records:
            return 0, []

        center_vector = records[0].vector
        results = self.qdrant.search(
            collection=schema,
            vector=center_vector,
            top_k=self.k_neighbors,
            must_filters=[
                qmodels.FieldCondition(key="team_id", match={"value": team_id})
            ],
            with_payload=True,
        )

        cluster = [r for r in results if r.score >= sim_threshold]
        return len(cluster), cluster

    def find_next_cluster(
        self, realm: str, tenant: str, team_id: str, sim_threshold: float = 0.8
    ) -> Optional[Dict[str, Any]]:
        """
        Progressive clustering: find densest cluster from uncategorized transactions.
        Returns cluster payloads and member IDs.
        """
        schema = make_schema(realm, tenant)

        uncategorized_ids = self._get_uncategorized_ids(schema, team_id)
        if not uncategorized_ids:
            return None

        candidates = self._sample_candidates(uncategorized_ids)

        best_cluster: List[qmodels.ScoredPoint] = []
        best_density = -1

        for center_id in candidates:
            density, cluster = self._compute_density_score(
                schema, center_id, team_id, sim_threshold=sim_threshold
            )
            if density > best_density:
                best_density = density
                best_cluster = cluster

        if not best_cluster:
            return None

        # Enrich with full transaction records
        tx_by_id: Dict[int, Dict[str, Any]] = {}
        try:
            member_ids = [
                int(r.payload["transaction_id"])
                for r in best_cluster
                if r.payload.get("transaction_id") is not None
            ]
            if member_ids:
                placeholders = ", ".join(["%s"] * len(member_ids))
                sql = f"SELECT * FROM {schema}.transaction WHERE team_id = %s AND id IN ({placeholders})"
                res = self.db.query(sql, [team_id, *member_ids])
                rows = getattr(res, "rows", res) or []
                for row in rows:
                    rid = row.get("id") if isinstance(row, dict) else row[0]
                    if rid is not None:
                        tx_by_id[int(rid)] = row
        except Exception:
            tx_by_id = {}

        return {
            "cluster_center": best_cluster[0].payload,
            "members": [
                {
                    "transaction_id": r.payload["transaction_id"],
                    "score": r.score,
                    "payload": r.payload,
                    "transaction": tx_by_id.get(int(r.payload["transaction_id"]))
                    if r.payload.get("transaction_id") is not None
                    else None,
                }
                for r in best_cluster
            ],
            "size": len(best_cluster),
        }
