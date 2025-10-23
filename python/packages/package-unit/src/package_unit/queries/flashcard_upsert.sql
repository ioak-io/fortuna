INSERT INTO {schema}.flashcard
  (team_id, unit_id, file_id, chunk_id, front, back)
VALUES ($1,$2,$3,$4,$5,$6)
ON CONFLICT (team_id, unit_id, chunk_id, front)
DO UPDATE SET back=$6, updated_at=NOW();
