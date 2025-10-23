from package_unit.services.llm_service import LlmService


class ArtifactGeneratorAgent:

    def __init__(self, llm: LlmService):
        self.llm = llm
        self.system_prompt = "You are a multi-expert assistant that generates premium-quality structured learning artifacts from a text. Combine three roles: (1) Subject matter expert — ensure accuracy and context. (2) Learning designer — structure for comprehension and retention. (3) Human tutor — explain clearly and engagingly. Output strictly valid JSON with seven keys: \\\"studyguide\\\", \\\"quiz\\\", \\\"flashcards\\\", \\\"questions\\\", \\\"topics\\\", \\\"summary\\\", \\\"image_keywords\\\". Schema: - studyguide: array \\\"blocks\\\" of 3–5 elements. Each element is {\\\"type\\\":\\\"paragraph\\\",\\\"content\\\":\\\"...\\\"} or {\\\"type\\\":\\\"list\\\",\\\"items\\\":[\\\"...\\\"]}. Must be concise but complete, cover all key ideas using compressed wording and shorter paragraphs/lists. Avoid fluff and repetition. Lists must follow a paragraph introduction. Write as a standalone resource (no references to text or instructions). - quiz: array of N objects (exact number will be provided in the user message), each {\\\"question\\\":string,\\\"options\\\":[4 strings],\\\"answer\\\":string,\\\"explanation\\\":string}. Include a range of Bloom's levels: factual recall, conceptual understanding, application, and analysis. Ensure plausible distractors, not obviously wrong answers. In the explanation: justify why the correct answer is correct, and briefly clarify why the incorrect options are wrong if relevant. - flashcards: array of N objects (exact number will be provided in the user message), each {\\\"front\\\":string,\\\"back\\\":string}. The front must be an active recall prompt phrased as a question or cloze deletion, never just a bare term. Each card must test a single atomic fact; if an answer has multiple parts, split it into separate cards. The back should be concise but complete (1–2 clarifying words allowed). - questions: array of N short-answer objects (exact number will be provided in the user message), each {\\\"question\\\":string,\\\"answer\\\":string,\\\"explanation\\\":string}. Require learners to produce an answer in their own words. Explanations must clarify reasoning and context, not just restate the answer. - topics: 3–5 objects {\\\"name\\\":string,\\\"description\\\":string}. - summary: 1–2 sentences. - image_keywords: 0–2 short strings or []. Important: Do not prefix any question, flashcard, or answer text with numbers, letters, bullets, or symbols (e.g., \\\"1.\\\", \\\"Q:\\\", \\\"-\\\"). All text must be plain, natural phrasing only. Self-check before finalizing: all main ideas included, studyguide concise but complete, logical flow, quiz exactly the number requested with varied depth and plausible distractors and helpful explanations, flashcards exactly the number requested with only core concepts, active recall phrasing and atomic facts, short-answer questions exactly the number requested with reasoning in explanations, JSON strictly valid, plain text only."

    def calculate_artifact_counts(self, text_length: int) -> dict:
        quiz_count = max(2, min(20, round(text_length / 50)))
        flashcard_count = max(2, min(10, round(text_length / 120)))
        short_answer_count = max(1, min(8, round(text_length / 150)))

        # Safeguard for ultra-short chunks
        if text_length < 120:
            quiz_count = max(quiz_count, 1)
            flashcard_count = max(flashcard_count, 1)
            short_answer_count = max(short_answer_count, 1)

        return {
            "quiz": quiz_count,
            "flashcards": flashcard_count,
            "short_answers": short_answer_count,
        }

    def generate(self, text: str, text_length: int) -> str:
        counts = self.calculate_artifact_counts(text_length)

        print(
            f"text_length={text_length}, quiz={counts['quiz']}, "
            f"flashcards={counts['flashcards']}, short={counts['short_answers']}"
        )

        user_prompt = (
            f"Generate artifacts from this text:\n\n{text}\n\n"
            f"Number of quiz questions: {counts['quiz']}\n"
            f"Number of flashcards: {counts['flashcards']}\n"
            f"Number of short-answer questions: {counts['short_answers']}"
        )

        return self.llm.complete(
            messages=[
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": user_prompt},
            ]
        )
