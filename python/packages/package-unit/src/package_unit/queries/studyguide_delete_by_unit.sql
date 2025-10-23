DELETE FROM {schema}.studyguide
WHERE team_id = $1
  AND unit_id = $2;
