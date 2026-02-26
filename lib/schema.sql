-- Run this in Vercel Postgres (Dashboard → Storage → Query) or once via ensureGlucoseLogsTable().
CREATE TABLE IF NOT EXISTS glucose_logs (
  id SERIAL PRIMARY KEY,
  value INTEGER NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('fasting', 'post_meal')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Optional: index for fast date-range queries
CREATE INDEX IF NOT EXISTS idx_glucose_logs_created_at ON glucose_logs (created_at DESC);
