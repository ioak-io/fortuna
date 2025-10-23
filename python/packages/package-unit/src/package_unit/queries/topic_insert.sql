INSERT INTO {schema}.topic (
  team_id,
  unit_id,
  file_id,
  title,
  description,
  concepts
) VALUES (
  $1,
  $2,
  $3,
  $4,
  $5,
  ARRAY(SELECT jsonb_array_elements_text($6::jsonb))
)
RETURNING *;
