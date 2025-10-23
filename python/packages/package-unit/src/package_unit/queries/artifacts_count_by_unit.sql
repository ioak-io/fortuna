-- Count study guides for unit
SELECT COUNT(*) as count FROM {schema}.studyguide
WHERE team_id = $1 AND unit_id = $2;

-- Count quiz for unit
SELECT COUNT(*) as count FROM {schema}.quiz
WHERE team_id = $1 AND unit_id = $2;

-- Count flashcard for unit
SELECT COUNT(*) as count FROM {schema}.flashcard
WHERE team_id = $1 AND unit_id = $2;
