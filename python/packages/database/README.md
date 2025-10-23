# database

Async PostgreSQL utilities for the Fortuna Python monorepo, mirroring the Node `@fortuna/database` package (pg).

## Features

- Async connection pooling via `psycopg` 3 (`psycopg_pool.AsyncConnectionPool`)
- Simple configuration with `pydantic-settings` using `DATABASE_` env vars
- Query helpers: `fetch_all`, `fetch_one`, `fetch_val`, `execute`
- Transaction helper context manager: `transaction()`

## Installation

This package is part of the Poetry workspace. Add it in the root `pyproject.toml` dependencies and install.

## Configuration

Environment variables (examples):

- `DATABASE_URL`: `postgresql://user:pass@localhost:5432/dbname`
- Or granular:
  - `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_DBNAME`
  - `DATABASE_MIN_SIZE` (default 1)
  - `DATABASE_MAX_SIZE` (default 10)
  - `DATABASE_SSLMODE` (optional)

## Usage

```python
import asyncio
from package_database import DBSettings, init_pool, fetch_val, close_pool

async def main():
    settings = DBSettings()  # reads env
    await init_pool(settings)

    version = await fetch_val("select version()")
    print(version)

    await close_pool()

if __name__ == "__main__":
    asyncio.run(main())
```

### Transaction example

```python
from package_database import transaction, execute

async def do_stuff():
    async with transaction() as conn:
        await execute("insert into items(name) values(%s)", ("abc",), conn=conn)
```
