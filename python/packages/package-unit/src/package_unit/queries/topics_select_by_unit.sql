SELECT t.id, t.title, t.description, t.concepts, 
       ARRAY(
           SELECT tc.chunk_index 
           FROM {schema}.topic_chunk tc 
           WHERE tc.topic_id = t.id
       ) AS chunk_indices
FROM {schema}.topic t
WHERE t.unit_id = $2 AND t.team_id = $1
ORDER BY t.id;
