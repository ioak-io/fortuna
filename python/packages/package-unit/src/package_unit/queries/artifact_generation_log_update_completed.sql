UPDATE {schema}.artifact_generation_log
SET status='completed', last_computed_at=NOW(), finished_at=NOW()
WHERE team_id=$1 AND unit_id=$2 AND file_id=$3 AND artifact_type=$4;
