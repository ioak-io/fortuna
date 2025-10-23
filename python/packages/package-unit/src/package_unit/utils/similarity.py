from __future__ import annotations

from typing import List, Dict


def cosine_similarity(a: list[float], b: list[float]) -> float:
    if not a or not b or len(a) != len(b):
        return 0.0
    dot = sum(x * y for x, y in zip(a, b))
    na = sum(x * x for x in a) ** 0.5
    nb = sum(y * y for y in b) ** 0.5
    if na == 0 or nb == 0:
        return 0.0
    return dot / (na * nb)


def greedy_cluster_embeddings(embeddings: List[List[float]], threshold: float = 0.75) -> Dict[int, List[int]]:
    """Greedy clustering by cosine similarity.

    Returns a mapping: cluster_id -> list of indices in the input array.
    """
    clusters: Dict[int, List[int]] = {}
    centers: List[List[float]] = []

    for idx, emb in enumerate(embeddings):
        assigned = False
        for cid, center in enumerate(centers):
            if cosine_similarity(emb, center) >= threshold:
                clusters.setdefault(cid, []).append(idx)
                # Update center as mean (simple running approach)
                cembs = [embeddings[i] for i in clusters[cid]]
                dim = len(center) if center else len(emb)
                new_center = [0.0] * dim
                for e in cembs:
                    for j, v in enumerate(e):
                        new_center[j] += v
                n = float(len(cembs))
                centers[cid] = [v / n for v in new_center]
                assigned = True
                break
        if not assigned:
            # New cluster
            cid = len(centers)
            centers.append(list(emb))
            clusters[cid] = [idx]
    return clusters
