INSERT INTO {schema}.learning_progress (team_id, unit_id, artifact_type, expected)
VALUES ($1, $2, $3, $4)
ON CONFLICT (team_id, user_id, unit_id, artifact_type)
DO UPDATE SET
  expected = EXCLUDED.expected,
  updated_at = now();
