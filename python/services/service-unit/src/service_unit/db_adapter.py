from __future__ import annotations

from types import SimpleNamespace
from typing import Any, Sequence

import psycopg
from psycopg.rows import dict_row
import re
from psycopg.types.json import Json
import json

from package_database import DBSettings


class SyncDB:
    """Minimal synchronous DB adapter exposing a query(sql, params) method.

    This is used to interoperate with package_unit services that expect
    a .query method similar to the Node pg client.
    """

    def __init__(self, settings: DBSettings | None = None, user_id: str | None = None) -> None:
        self._dsn = (settings or DBSettings()).dsn
        self._user_id: str | None = user_id

    def set_rls_user(self, user_id: str | None) -> None:
        """Set the user id that will be applied to each connection for RLS."""
        self._user_id = user_id

    def query(self, sql: str, params: Sequence[Any] | None = None):
        # Translate Postgres $1-style placeholders to psycopg %s, preserving duplicates by
        # expanding the parameters in the same order placeholders appear.
        placeholder_pattern = re.compile(r"\$(\d+)")
        indices: list[int] = []
        def _repl(m: re.Match[str]) -> str:
            idx = int(m.group(1))
            indices.append(idx)
            return "%s"
        translated_sql = placeholder_pattern.sub(_repl, sql)

        # Expand params according to occurrence order so repeated $N are repeated in params
        adapted_params: list[Any] = []
        if params is not None and indices:
            for i in indices:
                val = params[i - 1]
                adapted_params.append(Json(val) if isinstance(val, (dict, list)) else val)
        elif params is not None:
            adapted_params = [Json(p) if isinstance(p, (dict, list)) else p for p in params]
        with psycopg.connect(self._dsn) as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                try:
                    # Ensure RLS claims are set for this transaction if provided
                    if self._user_id:
                        claims_json = json.dumps({"sub": self._user_id})
                        # Use set_config with is_local=true to mimic SET LOCAL
                        cur.execute("select set_config('request.jwt.claims', %s, true)", [claims_json])
                    cur.execute(translated_sql, adapted_params or [])
                    try:
                        rows = cur.fetchall()
                    except psycopg.ProgrammingError:
                        rows = []
                    rowcount = cur.rowcount or 0
                except Exception as e:  # noqa: BLE001
                    # Basic debug info; callers may surface 500s but this helps trace root cause
                    print("DB ERROR:", str(e))
                    print("SQL:", translated_sql)
                    print("PARAMS:", adapted_params or [])
                    raise
        # Return object compatible with .rows and .rowCount usages
        return SimpleNamespace(rows=rows, rowCount=rowcount)
