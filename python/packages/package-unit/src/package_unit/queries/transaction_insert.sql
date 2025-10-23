INSERT INTO {schema}.transaction (
  team_id,
  file_name,
  raw_text,
  statement_id,
  transaction_date,
  description,
  amount,
  currency,
  is_income,
  category_id,
  created_by
) VALUES (
  $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11
);


