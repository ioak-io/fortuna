import logging
from typing import Any, Dict, List
from package_unit.services.ocr_service import OcrService
from package_unit.utils.chunking import chunk_text
from package_unit.embeddings import get_openai_embeddings
from package_unit.utils.schema import make_schema
from package_unit.utils.sql import load_sql
from package_unit.services.vector_service import VectorService


class ChunkPipeline:
    def __init__(self, db: Any) -> None:
        self.db = db

    def run(
        self, realm: str, tenant: str, team_id: str, unit_id: int, file_id: int,
        file_bytes: bytes, chunk_size: int, chunk_overlap: int,
        auth_headers: Dict[str, str], mime_type: str | None,
    ) -> None:
        schema = make_schema(realm, tenant)
        text = self._extract_text(file_bytes, mime_type, auth_headers)
        chunks = self._create_chunks(text, chunk_size, chunk_overlap)
        self._store_chunks(schema, team_id, unit_id, file_id, chunks)
        self._store_vectors(schema, team_id, unit_id, file_id, chunks)
        return chunks

    # === Stage Functions ===
    def _extract_text(self, file_bytes: bytes, mime_type: str | None, auth_headers: Dict[str, str]) -> str:
        logging.info("ocr_start")
        _text = OcrService.extract_text(file_bytes, mime_type, auth_headers)
        logging.info("ocr_completed")
        return _text

    def _create_chunks(self, text: str, chunk_size: int, chunk_overlap: int) -> List[str]:
        logging.info("chunking_start")
        embeddings = get_openai_embeddings()
        chunks = chunk_text(text=text, embeddings=embeddings,
                            chunk_size=chunk_size, chunk_overlap=chunk_overlap)
        logging.info("chunking_completed", extra={"chunks_count": len(chunks)})
        return chunks

    def _store_chunks(self, schema: str, team_id: str, unit_id: int, file_id: int, chunks: List[str]) -> None:
        insert_sql = load_sql("chunks_insert.sql").format(schema=schema)
        for i, c in enumerate(chunks):
            values = [
                team_id, unit_id, file_id, i,
                c, int((len(c) + 3) // 4),
                c,  # TODO: use SummarizationService.summarize()
                {"chunk_size": len(c), "total_chunks": len(chunks)}
            ]
            self.db.query(insert_sql, values)

    def _store_vectors(self, schema: str, team_id: str, unit_id: int, file_id: int, chunks: List[str]) -> None:
        try:
            logging.info("vectors_start")
            VectorService().upsert_chunks(
                schema=schema,
                team_id=team_id,
                unit_id=unit_id,
                file_id=file_id,
                chunks=chunks,
            )
            logging.info("vectors_completed")
        except Exception:
            logging.info("vectors_failed")
            logging.exception("qdrant_upsert_failed", extra={
                "team_id": team_id, "unit_id": unit_id, "file_id": file_id,
            })
