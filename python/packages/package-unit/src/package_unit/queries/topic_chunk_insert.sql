INSERT INTO {schema}.topic_chunk (
    team_id,
    unit_id,
    file_id,
    topic_id,
    chunk_index
) VALUES ($1, $2, $3, $4, $5);
