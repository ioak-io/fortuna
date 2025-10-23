CREATE TABLE
    statement (
        id BIGSERIAL PRIMARY KEY,
        team_id uuid NOT NULL REFERENCES team (id) ON DELETE CASCADE,
        file_name VARCHAR(255),
        upload_date TIMESTAMP DEFAULT NOW (),
        raw_text TEXT,
        created_by uuid REFERENCES fortuna.user (id),
        created_at timestamptz NOT NULL DEFAULT now (),
        updated_at timestamptz NOT NULL DEFAULT now ()
    );