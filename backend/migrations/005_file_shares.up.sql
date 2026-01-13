DROP TABLE IF EXISTS file_shares;

CREATE TABLE file_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    shared_with_email TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);