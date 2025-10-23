-- Sample migration file
-- This is a placeholder migration to demonstrate the structure

CREATE TABLE IF NOT EXISTS sample_table (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add an index for better performance
CREATE INDEX IF NOT EXISTS idx_sample_table_name ON sample_table(name);
