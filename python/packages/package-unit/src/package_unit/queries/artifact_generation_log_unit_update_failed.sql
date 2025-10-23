UPDATE {schema}.artifact_generation_log
SET status='failed', finished_at=NOW(), error_message=$4
WHERE team_id=$1 AND unit_id=$2 AND file_id IS NULL AND artifact_type=$3;
