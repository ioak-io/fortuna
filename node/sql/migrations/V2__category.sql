CREATE TABLE
    category (
        id BIGSERIAL PRIMARY KEY,
        team_id uuid NOT NULL REFERENCES team (id),
        name VARCHAR(100) NOT NULL,
        description TEXT,
        created_by uuid REFERENCES fortuna.user (id),
        created_at timestamptz NOT NULL DEFAULT now (),
        updated_at timestamptz NOT NULL DEFAULT now ()
    );