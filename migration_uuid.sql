-- Fix ID and Timestamp generation for Story table

-- 1. Enable the UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Alter the Story table to auto-generate IDs
ALTER TABLE "Story" 
ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 3. Alter the Story table to auto-set updated_at
ALTER TABLE "Story"
ALTER COLUMN updated_at SET DEFAULT now();
