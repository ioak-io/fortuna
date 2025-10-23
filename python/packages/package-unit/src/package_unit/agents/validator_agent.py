import json
from package_unit.services.llm_service import LlmService


class ValidatorAgent:
    """Agent responsible for JSON schema validation and repair."""

    def __init__(self, llm: LlmService):
        self.llm = llm

    def validate_and_repair(self, raw_output: str, max_retries: int = 2) -> dict:
        for attempt in range(max_retries + 1):
            try:
                return json.loads(raw_output)
            except json.JSONDecodeError:
                if attempt == max_retries:
                    raise
                repair_prompt = (
                    "Fix this into valid JSON only. Schema: "
                    "{studyguide, quiz, flashcards, topics, summary, image_keywords}.\n\n"
                    f"Broken output:\n{raw_output}"
                )
                raw_output = self.llm.complete([
                    {"role": "system", "content": "You are a JSON repair assistant. Output only valid JSON."},
                    {"role": "user", "content": repair_prompt}
                ])
