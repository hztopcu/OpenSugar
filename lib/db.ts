import { sql } from "@vercel/postgres";

export type GlucoseTypeLabel = "Fasting" | "Pre-Meal" | "Post-Meal";

export interface GlucoseLog {
  id: string;
  user_id: string | null;
  value: number;
  type: string;
  notes: string | null;
  created_at: Date;
}

export interface Medication {
  id: string;
  user_id: string | null;
  name: string;
  dosage: string;
  unit: string;
  frequency: string;
  created_at: Date;
}

export interface MedicationLog {
  id: string;
  user_id: string | null;
  medication_id: string;
  taken_at: Date;
  notes: string | null;
  created_at: Date;
}

export const LAB_TEST_NAMES = ["HbA1c", "HDL", "LDL", "Triglycerides", "BP_Systolic", "BP_Diastolic"] as const;

export interface LabResultRow {
  id: string;
  test_name: string;
  value: number;
  unit: string | null;
  test_date: string;
  created_at: Date;
}

/** Run SQL from 001_initial.sql in your Postgres client or use this to ensure tables exist (minimal version). */
export async function ensureAllTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS glucose_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id TEXT,
      value INTEGER NOT NULL,
      type TEXT NOT NULL,
      notes TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS medications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id TEXT,
      name TEXT NOT NULL,
      dosage TEXT NOT NULL,
      unit TEXT NOT NULL,
      frequency TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS medication_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id TEXT,
      medication_id UUID NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
      taken_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      notes TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS lab_results (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id TEXT NOT NULL,
      test_name TEXT NOT NULL,
      value NUMERIC NOT NULL,
      unit TEXT,
      test_date DATE NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;
}
