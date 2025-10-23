from typing import Any, Dict, List
from package_unit.persistence.base_repository import BaseRepository


class TopicRepository(BaseRepository):

    def stage(self, schema: str, team_id: str, unit_id: int, chunk_id: int, topics: List[Dict[str, Any]] | None):
        delete_sql = f"""
            DELETE FROM {schema}.chunk_topic_stage
            WHERE team_id = $1 AND unit_id = $2 AND chunk_id = $3
        """
        self.query(delete_sql, [team_id, unit_id, chunk_id])

        if isinstance(topics, list) and topics:
            insert_sql = f"""
                INSERT INTO {schema}.chunk_topic_stage
                  (team_id, unit_id, chunk_id, topics)
                VALUES ($1, $2, $3, $4)
            """
            self.query(insert_sql, [team_id, unit_id, chunk_id, topics])
