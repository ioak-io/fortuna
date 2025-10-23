from __future__ import annotations

import math


def estimate_token_count(text: str) -> int:
    """Rough token estimate similar to Node implementation (~4 chars per token).
    """
    if not text:
        return 0
    return int(math.ceil(len(text) / 4))
