INSERT INTO {schema}.chunk (
  team_id, unit_id, file_id, chunk_index, text,
  token_count, summary, metadata
) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
RETURNING *;
