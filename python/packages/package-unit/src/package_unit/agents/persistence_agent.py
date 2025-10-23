from package_unit.persistence.artifact_repository import ArtifactRepository
from package_unit.persistence.studyguide_repository import StudyguideRepository
from package_unit.persistence.flashcard_repository import FlashcardRepository
from package_unit.persistence.quiz_repository import QuizRepository
from package_unit.persistence.question_repository import QuestionRepository
from package_unit.persistence.topic_repository import TopicRepository


class PersistenceAgent:
    """Agent responsible for persisting artifacts to DB."""

    def __init__(self, db):
        self.artifact_repo = ArtifactRepository(db)
        self.studyguide_repo = StudyguideRepository(db)
        self.flashcard_repo = FlashcardRepository(db)
        self.quiz_repo = QuizRepository(db)
        self.question_repo = QuestionRepository(db)
        self.topic_repo = TopicRepository(db)

    def persist_all(self, schema: str, team_id: str, unit_id: int, file_id: int, chunk_id: int, artifacts: dict):
        topics = artifacts.get("topics") or []
        self.topic_repo.stage(schema, team_id, unit_id, chunk_id, topics)
        self.studyguide_repo.save(schema, team_id, unit_id, chunk_id,
                                  artifacts.get("studyguide"),
                                  artifacts.get("summary"),
                                  artifacts.get("image_keywords"))
        self.flashcard_repo.save(schema, team_id, unit_id, file_id, chunk_id,
                                 artifacts.get("flashcards") or [])
        self.quiz_repo.save(schema, team_id, unit_id, file_id, chunk_id,
                            artifacts.get("quiz") or [])
        self.question_repo.save(schema, team_id, unit_id, file_id, chunk_id,
                                artifacts.get("questions") or [])
