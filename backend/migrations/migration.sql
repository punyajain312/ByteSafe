DROP TABLE IF EXISTS users CASCADE;
-- 1. Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- needs pgcrypto
    name VARCHAR(100) NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT NOW() 
);

DROP TABLE IF EXISTS file_blobs CASCADE;
-- 2. File blobs (unique file contents)
CREATE TABLE file_blobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hash TEXT UNIQUE NOT NULL,
    storage_path TEXT NOT NULL,
    size BIGINT NOT NULL,
    ref_count INT DEFAULT 1
);

DROP TABLE IF EXISTS files CASCADE;
-- 3. Files (user uploads)
CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    blob_id UUID NOT NULL REFERENCES file_blobs(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

DROP TABLE IF EXISTS public_files CASCADE;
-- 4. Publicly shared files
CREATE TABLE IF NOT EXISTS public_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    visibility VARCHAR(20) NOT NULL DEFAULT 'public',
    download_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);
