CREATE TABLE IF NOT EXISTS settings (
    id text PRIMARY KEY,
    institution_id text NOT NULL REFERENCES institutions(id),
    category text NOT NULL,
    key text NOT NULL,
    value text NOT NULL,
    updated_at timestamptz NOT NULL DEFAULT now(),
    updated_by text REFERENCES users(id),
    UNIQUE(institution_id, key)
);

