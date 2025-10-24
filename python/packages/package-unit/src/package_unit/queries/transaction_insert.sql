INSERT INTO {schema}.transaction (
  team_id,
  statement_id,
  transaction_date,
  description,
  amount,
  currency,
  type,
  created_by
) VALUES (
  $1,$2,$3,$4,$5,$6,$7,$8
);


