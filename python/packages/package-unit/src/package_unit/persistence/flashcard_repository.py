from typing import Any, Dict, List
from package_unit.persistence.base_repository import BaseRepository


class FlashcardRepository(BaseRepository):

    def save(self, schema: str, team_id: str, unit_id: int, file_id: int, chunk_id: int, flashcards: List[Dict[str, Any]]):
        if not isinstance(flashcards, list):
            return

        delete_sql = f"""
            DELETE FROM {schema}.flashcard
            WHERE team_id = $1 AND unit_id = $2 AND file_id = $3 AND chunk_id = $4
        """
        self.query(delete_sql, [team_id, unit_id, file_id, chunk_id])

        insert_sql = f"""
            INSERT INTO {schema}.flashcard
              (team_id, unit_id, file_id, chunk_id, front, back)
            VALUES ($1, $2, $3, $4, $5, $6)
        """
        for fc in flashcards:
            front = (fc or {}).get("front")
            back = (fc or {}).get("back")
            if not front or not back:
                continue
            self.query(insert_sql, [team_id, unit_id,
                       file_id, chunk_id, front, back])
