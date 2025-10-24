CREATE TABLE
    transaction_uncategorized_cluster (
        id BIGSERIAL PRIMARY KEY,
        team_id uuid NOT NULL REFERENCES team (id) ON DELETE CASCADE,
        created_at timestamptz NOT NULL DEFAULT now (),
        updated_at timestamptz NOT NULL DEFAULT now ()
    );

CREATE TABLE
    transaction_uncategorized_cluster_member (
        cluster_id BIGINT NOT NULL REFERENCES transaction_uncategorized_cluster (id) ON DELETE CASCADE,
        transaction_id BIGINT NOT NULL REFERENCES transaction (id) ON DELETE CASCADE,
        PRIMARY KEY (cluster_id, transaction_id)
    );