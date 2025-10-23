from typing import Any, Dict, List
from package_unit.persistence.base_repository import BaseRepository


class StudyguideRepository(BaseRepository):

    def save(self, schema: str, team_id: str, unit_id: int, chunk_id: int,
             studyguide_obj: Dict[str, Any] | List[Dict[str, Any]] | None,
             summary: str, image_keywords: List | None):
        if not studyguide_obj:
            return
        sg_blocks = studyguide_obj.get("blocks") if isinstance(studyguide_obj, dict) else (
            studyguide_obj if isinstance(studyguide_obj, list) else None)
        if not isinstance(sg_blocks, list) or not sg_blocks:
            return

        if summary:
            update_chunk_sql = f"""
                UPDATE {schema}.chunk
                SET summary = $1
                WHERE team_id = $2 AND unit_id = $3 AND id = $4
            """
            self.query(update_chunk_sql, [summary, team_id, unit_id, chunk_id])

        delete_sql = f"""
            DELETE FROM {schema}.studyguide
            WHERE team_id = $1 AND unit_id = $2 AND chunk_id = $3
        """
        self.query(delete_sql, [team_id, unit_id, chunk_id])

        sg_title = f"Chunk {chunk_id} Study Guide"
        insert_sql = f"""
            INSERT INTO {schema}.studyguide
              (team_id, unit_id, chunk_id, title, content, image_metadata, image_keywords)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        """
        self.query(insert_sql, [team_id, unit_id, chunk_id,
                   sg_title, sg_blocks, None, image_keywords])
