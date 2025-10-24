INSERT INTO {schema}.statement (
  team_id,
  file_name,
  raw_text,
  created_by
) VALUES ($1, $2, $3, $4)
RETURNING *;


