from __future__ import annotations

from . import anthropic, chatgpt, deepseek, gemini

runner_registry = {
    "chatgpt": chatgpt,
    "deepseek": deepseek,
    "gemini": gemini,
    "anthropic": anthropic,
}


def get_runner(provider: str):
    return runner_registry.get(provider)
