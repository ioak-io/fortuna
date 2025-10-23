CREATE TABLE
    transaction (
        id BIGSERIAL PRIMARY KEY,
        team_id uuid NOT NULL REFERENCES team (id) ON DELETE CASCADE,
        file_name VARCHAR(255),
        upload_date TIMESTAMP DEFAULT NOW (),
        raw_text TEXT,
        statement_id BIGSERIAL NOT NULL REFERENCES statement (id) ON DELETE CASCADE,
        transaction_date DATE NOT NULL,
        description TEXT NOT NULL,
        amount NUMERIC(12, 2) NOT NULL,
        currency CHAR(3) DEFAULT 'INR',
        is_income BOOLEAN,
        category_id BIGSERIAL REFERENCES category (id),
        created_by uuid REFERENCES fortuna.user (id),
        created_at timestamptz NOT NULL DEFAULT now (),
        updated_at timestamptz NOT NULL DEFAULT now ()
    );