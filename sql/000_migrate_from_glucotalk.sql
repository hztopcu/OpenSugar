-- Optional: Migrate from legacy GlucoTalk schema (SERIAL id, fasting/post_meal) to OpenSugar (UUID, Fasting/Pre-Meal/Post-Meal).
-- Run this ONLY if you have existing data in the old glucose_logs table. Then run 001_initial.sql (comment out the DROP TABLE glucose_logs line) or run the CREATE TABLE glucose_logs from 001 after this.

-- 1. Rename old table
ALTER TABLE IF EXISTS glucose_logs RENAME TO glucose_logs_legacy;

-- 2. Create new table (UUID, user_id, type TEXT)
CREATE TABLE glucose_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  value INTEGER NOT NULL,
  type TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_glucose_logs_created_at ON glucose_logs (created_at DESC);

-- 3. Copy data (map old type to new labels)
INSERT INTO glucose_logs (id, user_id, value, type, notes, created_at)
SELECT
  gen_random_uuid(),
  NULL,
  value,
  CASE type
    WHEN 'fasting' THEN 'Fasting'
    WHEN 'post_meal' THEN 'Post-Meal'
    ELSE 'Fasting'
  END,
  notes,
  created_at
FROM glucose_logs_legacy;

-- 4. Drop legacy table when satisfied
-- DROP TABLE glucose_logs_legacy;
