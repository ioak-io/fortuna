from __future__ import annotations

from importlib import resources


def load_sql(name: str) -> str:
    """Load a SQL file from the package_statement.queries/ directory by base name.

    Example: load_sql("chunks_insert.sql")
    """
    from package_statement import queries  # type: ignore

    with resources.files(queries).joinpath(name).open("r", encoding="utf-8") as f:
        return f.read()
