from __future__ import annotations

from contextlib import asynccontextmanager
from typing import Any, AsyncIterator, Iterable, Mapping, Sequence

from psycopg import AsyncConnection

from .pool import acquire

Params = Sequence[Any] | Mapping[str, Any] | None


async def execute(
    sql: str,
    params: Params = None,
    *,
    conn: AsyncConnection | None = None,
) -> int:
    """Execute a statement and return rowcount.

    If no connection is provided, this will acquire one from the pool.
    """
    if conn is not None:
        async with conn.cursor() as cur:
            await cur.execute(sql, params)
            return cur.rowcount or 0
    async with acquire() as c:
        async with c.cursor() as cur:
            await cur.execute(sql, params)
            return cur.rowcount or 0


async def fetch_all(
    sql: str,
    params: Params = None,
    *,
    conn: AsyncConnection | None = None,
) -> list[tuple[Any, ...]]:
    """Fetch all rows as tuples."""
    if conn is not None:
        async with conn.cursor() as cur:
            await cur.execute(sql, params)
            return await cur.fetchall()
    async with acquire() as c:
        async with c.cursor() as cur:
            await cur.execute(sql, params)
            return await cur.fetchall()


async def fetch_one(
    sql: str,
    params: Params = None,
    *,
    conn: AsyncConnection | None = None,
) -> tuple[Any, ...] | None:
    """Fetch a single row or None."""
    if conn is not None:
        async with conn.cursor() as cur:
            await cur.execute(sql, params)
            return await cur.fetchone()
    async with acquire() as c:
        async with c.cursor() as cur:
            await cur.execute(sql, params)
            return await cur.fetchone()


async def fetch_val(
    sql: str,
    params: Params = None,
    *,
    conn: AsyncConnection | None = None,
) -> Any:
    """Fetch a single scalar value (first column of the first row)."""
    row = await fetch_one(sql, params, conn=conn)
    if row is None:
        return None
    return row[0] if isinstance(row, tuple) and len(row) > 0 else None


@asynccontextmanager
async def transaction(
    *,
    conn: AsyncConnection | None = None,
) -> AsyncIterator[AsyncConnection]:
    """Open a transaction and yield a connection. Commits on success, rollbacks on error.

    Usage:
    async with transaction() as conn:
        await execute("...", conn=conn)
    """
    if conn is not None:
        try:
            await conn.execute("BEGIN")
            yield conn
            await conn.execute("COMMIT")
        except Exception:
            await conn.execute("ROLLBACK")
            raise
        return

    async with acquire() as c:
        try:
            await c.execute("BEGIN")
            yield c
            await c.execute("COMMIT")
        except Exception:
            await c.execute("ROLLBACK")
            raise
