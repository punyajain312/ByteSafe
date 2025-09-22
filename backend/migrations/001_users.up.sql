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

INSERT INTO users (name, email, password_hash, role) VALUES 
('Admin User', 'admin@gmail.com', '$2a$10$1CXqLl/ldmhSVNX4RyKC7.mtWAxTsmuKkQ3SOaPyHhzNxpAo2NGu6', 'admin');