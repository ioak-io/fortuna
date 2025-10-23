from typing import Any, Dict, List
from package_unit.persistence.base_repository import BaseRepository


class QuizRepository(BaseRepository):

    def save(self, schema: str, team_id: str, unit_id: int, file_id: int, chunk_id: int, quizzes: List[Dict[str, Any]]):
        if not isinstance(quizzes, list):
            return

        delete_sql = f"""
            DELETE FROM {schema}.quiz
            WHERE team_id = $1 AND unit_id = $2 AND file_id = $3 AND chunk_id = $4
        """
        self.query(delete_sql, [team_id, unit_id, file_id, chunk_id])

        insert_sql = f"""
            INSERT INTO {schema}.quiz
              (team_id, unit_id, file_id, chunk_id, question, options, answer, explanation)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        """
        for q in quizzes:
            question = (q or {}).get("question")
            options = (q or {}).get("options")
            answer = (q or {}).get("answer")
            explanation = (q or {}).get("explanation")
            if not question or not isinstance(options, list) or not answer:
                continue
            self.query(insert_sql, [team_id, unit_id,
                       file_id, chunk_id, question, options, answer, explanation])
