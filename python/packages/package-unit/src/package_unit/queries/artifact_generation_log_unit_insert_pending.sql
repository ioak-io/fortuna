INSERT INTO {schema}.artifact_generation_log
  (team_id, unit_id, file_id, artifact_type, status)
VALUES ($1,$2,NULL,$3,'pending')
ON CONFLICT (team_id, unit_id, file_id, artifact_type)
DO UPDATE SET status='pending', started_at=NULL, finished_at=NULL, error_message=NULL;
