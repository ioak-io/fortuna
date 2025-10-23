class BaseRepository:
    def __init__(self, db):
        self.db = db

    def query(self, sql: str, params: list):
        return self.db.query(sql, params)
