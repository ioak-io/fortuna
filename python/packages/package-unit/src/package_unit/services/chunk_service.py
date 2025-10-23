from __future__ import annotations

from typing import Any, Dict, List

from package_unit.services.embedding_service import EmbeddingService
from package_unit.services.summarization_service import SummarizationService
from package_unit.utils.token import estimate_token_count
from package_unit.utils.schema import make_schema
from package_unit.utils.sql import load_sql


class ChunkService:
    def __init__(self, db: Any) -> None:
        self.db = db

    def create_chunks(
        self,
        realm: str,
        tenant: str,
        team_id: str,
        unit_id: int,
        file_id: int,
        chunks: List[str],
        auth_headers: Dict[str, str],
    ) -> List[Dict[str, Any]]:
        if not chunks:
            return []
        created: List[Dict[str, Any]] = []
        for i, text in enumerate(chunks):
            summary = SummarizationService.summarize(text, auth_headers)
            embedding = EmbeddingService.get_embedding(summary, auth_headers)
            chunk_data = {
                "unit_id": unit_id,
                "file_id": file_id,
                "chunk_index": i,
                "text": text,
                "token_count": estimate_token_count(text),
                "summary": summary,
                "embedding": embedding,
                "metadata": {"chunk_size": len(text), "total_chunks": len(chunks)},
            }
            created_row = self.create_chunk(realm, tenant, team_id, chunk_data)
            created.append(created_row)
        return created

    def create_chunk(
        self,
        realm: str,
        tenant: str,
        team_id: str,
        chunk_data: Dict[str, Any],
    ) -> Dict[str, Any]:
        schema = make_schema(realm, tenant)
        sql = load_sql("chunks_insert.sql").format(schema=schema)
        values = [
            team_id,
            chunk_data["unit_id"],
            chunk_data["file_id"],
            chunk_data["chunk_index"],
            chunk_data["text"],
            chunk_data["token_count"],
            chunk_data["summary"],
            chunk_data["metadata"],
            chunk_data["embedding"],
        ]
        res = self.db.query(sql, values)
        return res.rows[0] if getattr(res, "rows", None) else res[0]

    def get_chunks_by_unit(
        self, realm: str, tenant: str, team_id: str, unit_id: int
    ) -> List[Dict[str, Any]]:
        schema = make_schema(realm, tenant)
        sql = load_sql("chunks_select_by_unit.sql").format(schema=schema)
        res = self.db.query(sql, [team_id, unit_id])
        return res.rows if getattr(res, "rows", None) is not None else res
