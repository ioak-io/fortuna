# package-qdrant

Thin wrapper around qdrant-client to manage collections and upsert vectors.

## Environment
- QDRANT_URL (e.g. http://localhost:6333) or QDRANT_HOST/QDRANT_PORT
- QDRANT_API_KEY (optional)

## Usage
```python
from package_qdrant import QdrantClientWrapper

client = QdrantClientWrapper()
client.ensure_collection("my_collection", vector_size=1536)
client.upsert_points(
    "my_collection",
    points=[
        {
            "id": "team:unit:file:0",
            "vector": [0.1, 0.2, ...],
            "payload": {"team_id": "t1", "unit_id": 1, "file_id": 2, "text": "..."},
        }
    ],
)
```
