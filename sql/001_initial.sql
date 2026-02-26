-- OpenSugar / Ultimate Blood Glucose Tracker – Initial schema
-- Run this in Vercel Postgres (or your Postgres client) for a fresh install.
-- For upgrading from an existing GlucoTalk schema, see 000_migrate_from_glucotalk.sql first.

-- Remove existing tables (ensures UUID-based schema). Skip this block if you need to preserve data.
DROP TABLE IF EXISTS medication_logs;
DROP TABLE IF EXISTS medications;
DROP TABLE IF EXISTS glucose_logs;

-- Primary table: glucose readings
CREATE TABLE glucose_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  value INTEGER NOT NULL,
  type TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_glucose_logs_created_at ON glucose_logs (created_at DESC);
CREATE INDEX idx_glucose_logs_user_id ON glucose_logs (user_id) WHERE user_id IS NOT NULL;

-- Medications (master list)
CREATE TABLE medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  unit TEXT NOT NULL,
  frequency TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_medications_user_id ON medications (user_id) WHERE user_id IS NOT NULL;

-- Medication intake logs
CREATE TABLE medication_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  medication_id UUID NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
  taken_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_medication_logs_taken_at ON medication_logs (taken_at DESC);
CREATE INDEX idx_medication_logs_medication_id ON medication_logs (medication_id);
CREATE INDEX idx_medication_logs_user_id ON medication_logs (user_id) WHERE user_id IS NOT NULL;
