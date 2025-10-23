INSERT INTO {schema}.datasource_file (
  team_id, unit_id, original_filename, storage_key, mime_type,
  size_bytes, checksum, metadata, uploaded_by
) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
RETURNING *;
