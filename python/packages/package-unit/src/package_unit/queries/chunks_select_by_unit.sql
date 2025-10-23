SELECT * FROM {schema}.chunk
WHERE team_id = $1 AND unit_id = $2
ORDER BY file_id, chunk_index;
