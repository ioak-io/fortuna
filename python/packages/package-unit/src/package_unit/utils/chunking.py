from typing import Optional, List
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_experimental.text_splitter import SemanticChunker
from langchain_core.embeddings import Embeddings
import logging


def chunk_text(
    text: str,
    embeddings: Embeddings,
    chunk_size: int = 1000,
    chunk_overlap: int = 250,
    breakpoint_threshold_type: str = "percentile",
    breakpoint_threshold_amount: int = 90,
    min_semantic_chunk_size: Optional[int] = None,
) -> List[str]:
    if not text:
        return []

    # 1) Semantic chunking
    min_size = min_semantic_chunk_size or max(200, chunk_size // 2)
    semantic_splitter = SemanticChunker(
        embeddings,
        breakpoint_threshold_type=breakpoint_threshold_type,
        breakpoint_threshold_amount=breakpoint_threshold_amount,
        min_chunk_size=min_size,
    )
    base_chunks: List[str] = semantic_splitter.split_text(text)

    # 2) Enforce max chunk size with overlap if needed
    if any(len(c) > chunk_size for c in base_chunks):
        char_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=max(0, min(chunk_overlap, chunk_size - 1)),
            separators=["\n\n", "\n", " ", ""],
        )
        enforced: List[str] = []
        for c in base_chunks:
            if len(c) <= chunk_size:
                enforced.append(c)
            else:
                enforced.extend(char_splitter.split_text(c))
        return enforced

    return base_chunks
