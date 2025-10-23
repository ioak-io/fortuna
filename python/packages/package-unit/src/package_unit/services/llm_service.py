import os
from typing import List, Dict, Optional
from openai import OpenAI


class LlmService:
    def __init__(self, model: str = "gpt-5-nano"):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.model = model
        
    def complete(
        self,
        messages: List[Dict[str, str]],
        max_completion_tokens: int | None = None,
    ) -> str:
        kwargs = {
            "model": self.model,
            "messages": messages,
            "reasoning_effort": "minimal"
        }
        if max_completion_tokens is not None:
            kwargs["max_completion_tokens"] = max_completion_tokens

        response = self.client.chat.completions.create(**kwargs)
        print(response)
        return response.choices[0].message.content.strip()


