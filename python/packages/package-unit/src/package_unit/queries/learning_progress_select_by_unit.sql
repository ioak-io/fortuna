SELECT * FROM {schema}.learning_progress
WHERE user_id = {schema}.current_user_id() AND unit_id = $1
ORDER BY artifact_type;
