CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE transaction_uncategorized_cluster (
    id BIGSERIAL PRIMARY KEY,
    team_id uuid NOT NULL REFERENCES team (id) ON DELETE CASCADE,
    centroid_vector vector(1536),  -- dimension must match embedding size
    size int DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE
    transaction_uncategorized_cluster_member (
        cluster_id BIGINT NOT NULL REFERENCES transaction_uncategorized_cluster (id) ON DELETE CASCADE,
        transaction_id BIGINT NOT NULL REFERENCES transaction (id) ON DELETE CASCADE,
        PRIMARY KEY (cluster_id, transaction_id)
    );

CREATE OR REPLACE FUNCTION update_cluster_size_on_insert()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE transaction_uncategorized_cluster
  SET size = size + 1
  WHERE id = NEW.cluster_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_cluster_member_insert
AFTER INSERT ON transaction_uncategorized_cluster_member
FOR EACH ROW
EXECUTE FUNCTION update_cluster_size_on_insert();

CREATE OR REPLACE FUNCTION update_cluster_size_on_delete()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE transaction_uncategorized_cluster
  SET size = size - 1
  WHERE id = OLD.cluster_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_cluster_member_delete
AFTER DELETE ON transaction_uncategorized_cluster_member
FOR EACH ROW
EXECUTE FUNCTION update_cluster_size_on_delete();
