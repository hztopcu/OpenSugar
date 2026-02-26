-- Normalized lab results: one row per test per date (Ghost Mode / OpenSugar)
-- Run after 002. Replaces wide lab_results with (id, user_id, test_name, value, unit, test_date).

DROP TABLE IF EXISTS lab_results;

CREATE TABLE lab_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  test_name TEXT NOT NULL,
  value NUMERIC NOT NULL,
  unit TEXT,
  test_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_lab_results_user_id ON lab_results (user_id);
CREATE INDEX idx_lab_results_test_date ON lab_results (test_date DESC);
CREATE INDEX idx_lab_results_user_test ON lab_results (user_id, test_name, test_date DESC);

-- test_name values: HbA1c, HDL, LDL, Triglycerides, BP_Systolic, BP_Diastolic
