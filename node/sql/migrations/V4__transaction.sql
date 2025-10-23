CREATE TABLE
    transaction (
        id BIGSERIAL PRIMARY KEY,
        team_id uuid NOT NULL REFERENCES team (id) ON DELETE CASCADE,
        upload_date TIMESTAMP DEFAULT NOW (),
        statement_id BIGSERIAL NOT NULL REFERENCES statement (id) ON DELETE CASCADE,
        transaction_date DATE NOT NULL,
        description TEXT NOT NULL,
        amount NUMERIC(12, 2) NOT NULL,
        currency CHAR(3) DEFAULT 'INR',
        type VARCHAR(6) CHECK (type IN ('debit', 'credit')) NOT NULL,
        category_id BIGSERIAL REFERENCES category (id),
        created_by uuid REFERENCES fortuna.user (id),
        created_at timestamptz NOT NULL DEFAULT now (),
        updated_at timestamptz NOT NULL DEFAULT now ()
    );