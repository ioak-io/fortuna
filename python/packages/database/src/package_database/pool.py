from __future__ import annotations

import asyncio
from contextlib import asynccontextmanager
from typing import AsyncIterator

from psycopg_pool import AsyncConnectionPool
from psycopg import AsyncConnection

from .config import DBSettings


_pool: AsyncConnectionPool | None = None
_pool_lock = asyncio.Lock()


async def init_pool(settings: DBSettings | None = None) -> AsyncConnectionPool:
    """Initialize a global async connection pool if not already created.

    This function is idempotent and safe to call multiple times.
    """
    global _pool
    if _pool is not None:
        return _pool

    async with _pool_lock:
        if _pool is None:
            cfg = settings or DBSettings()
            _pool = AsyncConnectionPool(
                conninfo=cfg.dsn,
                min_size=cfg.min_size,
                max_size=cfg.max_size,
                kwargs={"autocommit": False},
                # We can set "open=False" and call open() if deferred init required.
            )
        return _pool


def get_pool() -> AsyncConnectionPool:
    if _pool is None:
        raise RuntimeError("Database pool is not initialized. Call init_pool() first.")
    return _pool


async def close_pool() -> None:
    global _pool
    if _pool is not None:
        await _pool.close()
        _pool = None


@asynccontextmanager
async def acquire() -> AsyncIterator[AsyncConnection]:
    """Acquire a connection from the global pool as an async context manager."""
    pool = get_pool()
    async with pool.connection() as conn:  # type: AsyncConnection
        yield conn
