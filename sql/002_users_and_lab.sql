-- Users (for Auth.js Credentials) and Blood Lab Results
-- Run after 001_initial.sql. Safe to run with IF NOT EXISTS.

-- Users: id is the stable user id for session and data isolation
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users (username);

-- Blood lab results (strictly per user)
CREATE TABLE IF NOT EXISTS lab_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  hba1c_percent NUMERIC,
  hdl_mg_dl NUMERIC,
  ldl_mg_dl NUMERIC,
  triglycerides_mg_dl NUMERIC,
  bp_systolic INTEGER,
  bp_diastolic INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_lab_results_user_id ON lab_results (user_id);
CREATE INDEX IF NOT EXISTS idx_lab_results_created_at ON lab_results (created_at DESC);
