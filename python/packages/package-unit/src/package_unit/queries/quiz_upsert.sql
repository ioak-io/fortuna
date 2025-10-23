INSERT INTO {schema}.quiz
  (team_id, unit_id, file_id, chunk_id, question, options, answer)
VALUES ($1,$2,$3,$4,$5,$6,$7)
ON CONFLICT (team_id, unit_id, chunk_id, question)
DO UPDATE SET options=$6, answer=$7, updated_at=NOW();
