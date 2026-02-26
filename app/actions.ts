"use server";

import { revalidatePath } from "next/cache";
import { sql } from "@vercel/postgres";
import { auth } from "@/auth";
import type { LabResultRow } from "@/lib/db";
import type { AddGlucoseState, AddMedicationState, AddMedicationLogState, AddLabResultState, UploadLabPdfState } from "./action-types";
import { extractLabEntriesFromText } from "@/lib/pdf-lab-extract";

const VALID_GLUCOSE_TYPES = ["Fasting", "Pre-Meal", "Post-Meal", "Bedtime", "Other"] as const;

async function getUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

function parseMeasuredAt(value: string | null): Date {
  if (!value) return new Date();
  const trimmed = value.trim();
  if (!trimmed) return new Date();
  const [datePart, timePart] = trimmed.split("T");
  if (!datePart || !timePart) return new Date();
  const [yearStr, monthStr, dayStr] = datePart.split("-");
  const [hourStr, minuteStr] = timePart.split(":");
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);
  const hour = Number(hourStr);
  const minute = Number(minuteStr);
  const d = new Date(
    Number.isFinite(year) ? year : new Date().getFullYear(),
    Number.isFinite(month) ? month - 1 : new Date().getMonth(),
    Number.isFinite(day) ? day : new Date().getDate(),
    Number.isFinite(hour) ? hour : 0,
    Number.isFinite(minute) ? minute : 0
  );
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

// ---- Glucose ----
export async function addGlucoseLog(
  _prev: AddGlucoseState,
  formData: FormData
): Promise<AddGlucoseState> {
  const userId = await getUserId();
  const valueStr = formData.get("value") as string | null;
  const type = (formData.get("type") as string)?.trim();
  const notes = (formData.get("notes") as string | null)?.trim() || null;
  const measuredAtStr = formData.get("measured_at") as string | null;

  if (!valueStr || !type) return { error: "Value and type are required." };

  const value = parseInt(valueStr, 10);
  if (Number.isNaN(value) || value < 0 || value > 999)
    return { error: "Value must be 0–999 mg/dL." };

  if (!VALID_GLUCOSE_TYPES.includes(type as (typeof VALID_GLUCOSE_TYPES)[number]))
    return { error: "Type must be Fasting, Pre-Meal, Post-Meal, Bedtime, or Other." };

  try {
    const measuredAt = parseMeasuredAt(measuredAtStr);
    const createdAt = measuredAt.toISOString();
    await sql`
      INSERT INTO glucose_logs (user_id, value, type, notes, created_at)
      VALUES (${userId}, ${value}, ${type}, ${notes}, ${createdAt})
    `;
    revalidatePath("/");
    revalidatePath("/report");
    return { success: true, value };
  } catch (e) {
    console.error("addGlucoseLog:", e);
    return { error: "Failed to save. Check database connection." };
  }
}

export async function getGlucoseLogs(): Promise<
  { id: string; value: number; type: string; notes: string | null; created_at: Date }[]
> {
  const userId = await getUserId();
  try {
    const q = userId
      ? sql`SELECT id, value, type, notes, created_at FROM glucose_logs WHERE user_id = ${userId} ORDER BY created_at DESC`
      : sql`SELECT id, value, type, notes, created_at FROM glucose_logs WHERE user_id IS NULL ORDER BY created_at DESC`;
    const { rows } = await q;
    return rows as { id: string; value: number; type: string; notes: string | null; created_at: Date }[];
  } catch (e) {
    console.error("getGlucoseLogs:", e);
    return [];
  }
}

export async function getGlucoseLogsInRange(days: number): Promise<
  { value: number; type: string; created_at: Date }[]
> {
  const userId = await getUserId();
  try {
    const q = userId
      ? sql`SELECT value, type, created_at FROM glucose_logs WHERE user_id = ${userId} AND created_at >= NOW() - INTERVAL '1 day' * ${days} ORDER BY created_at ASC`
      : sql`SELECT value, type, created_at FROM glucose_logs WHERE user_id IS NULL AND created_at >= NOW() - INTERVAL '1 day' * ${days} ORDER BY created_at ASC`;
    const { rows } = await q;
    return rows as { value: number; type: string; created_at: Date }[];
  } catch (e) {
    console.error("getGlucoseLogsInRange:", e);
    return [];
  }
}

// ---- Medications ----
export async function addMedication(
  _prev: AddMedicationState,
  formData: FormData
): Promise<AddMedicationState> {
  const userId = await getUserId();
  const name = (formData.get("name") as string)?.trim();
  const dosage = (formData.get("dosage") as string)?.trim();
  const unit = (formData.get("unit") as string)?.trim();
  const frequency = (formData.get("frequency") as string)?.trim();

  if (!name || !dosage || !unit || !frequency)
    return { error: "Name, dosage, unit, and frequency are required." };

  try {
    await sql`
      INSERT INTO medications (user_id, name, dosage, unit, frequency)
      VALUES (${userId}, ${name}, ${dosage}, ${unit}, ${frequency})
    `;
    revalidatePath("/medications");
    revalidatePath("/add");
    revalidatePath("/report");
    return { success: true };
  } catch (e) {
    console.error("addMedication:", e);
    return { error: "Failed to save medication." };
  }
}

export async function getMedications(): Promise<
  { id: string; name: string; dosage: string; unit: string; frequency: string; created_at: Date }[]
> {
  const userId = await getUserId();
  try {
    const q = userId
      ? sql`SELECT id, name, dosage, unit, frequency, created_at FROM medications WHERE user_id = ${userId} ORDER BY name ASC`
      : sql`SELECT id, name, dosage, unit, frequency, created_at FROM medications WHERE user_id IS NULL ORDER BY name ASC`;
    const { rows } = await q;
    return rows as { id: string; name: string; dosage: string; unit: string; frequency: string; created_at: Date }[];
  } catch (e) {
    console.error("getMedications:", e);
    return [];
  }
}

// ---- Medication logs ----
export async function addMedicationLog(
  _prev: AddMedicationLogState,
  formData: FormData
): Promise<AddMedicationLogState> {
  const userId = await getUserId();
  const medicationId = formData.get("medication_id") as string | null;
  const notes = (formData.get("notes") as string | null)?.trim() || null;

  if (!medicationId) return { error: "Please select a medication." };

  try {
    await sql`
      INSERT INTO medication_logs (user_id, medication_id, notes)
      VALUES (${userId}, ${medicationId}, ${notes})
    `;
    revalidatePath("/");
    revalidatePath("/add");
    revalidatePath("/report");
    return { success: true };
  } catch (e) {
    console.error("addMedicationLog:", e);
    return { error: "Failed to log medication." };
  }
}

export async function getMedicationLogs(): Promise<
  { id: string; medication_id: string; taken_at: Date; notes: string | null; created_at: Date }[]
> {
  const userId = await getUserId();
  try {
    const q = userId
      ? sql`SELECT id, medication_id, taken_at, notes, created_at FROM medication_logs WHERE user_id = ${userId} ORDER BY taken_at DESC`
      : sql`SELECT id, medication_id, taken_at, notes, created_at FROM medication_logs WHERE user_id IS NULL ORDER BY taken_at DESC`;
    const { rows } = await q;
    return rows as { id: string; medication_id: string; taken_at: Date; notes: string | null; created_at: Date }[];
  } catch (e) {
    console.error("getMedicationLogs:", e);
    return [];
  }
}

export async function getMedicationLogsInRange(days: number): Promise<
  { medication_id: string; taken_at: Date; medication_name?: string }[]
> {
  const userId = await getUserId();
  try {
    const q = userId
      ? sql`
        SELECT ml.medication_id, ml.taken_at, m.name AS medication_name
        FROM medication_logs ml
        LEFT JOIN medications m ON m.id = ml.medication_id
        WHERE ml.user_id = ${userId} AND ml.taken_at >= NOW() - INTERVAL '1 day' * ${days}
        ORDER BY ml.taken_at ASC
      `
      : sql`
        SELECT ml.medication_id, ml.taken_at, m.name AS medication_name
        FROM medication_logs ml
        LEFT JOIN medications m ON m.id = ml.medication_id
        WHERE ml.user_id IS NULL AND ml.taken_at >= NOW() - INTERVAL '1 day' * ${days}
        ORDER BY ml.taken_at ASC
      `;
    const { rows } = await q;
    return rows as { medication_id: string; taken_at: Date; medication_name?: string }[];
  } catch (e) {
    console.error("getMedicationLogsInRange:", e);
    return [];
  }
}

// ---- Lab results (normalized: test_name, value, unit, test_date) ----
export async function addLabResult(
  _prev: AddLabResultState,
  formData: FormData
): Promise<AddLabResultState> {
  const userId = await getUserId();
  if (!userId) return { error: "Sign in to add lab results." };

  const testDate = (formData.get("test_date") as string)?.trim();
  if (!testDate) return { error: "Test date is required." };

  const entries: { test_name: string; value: number; unit: string }[] = [];
  const num = (v: FormDataEntryValue | null) => (v && String(v).trim() !== "" ? parseFloat(String(v)) : NaN);
  if (!Number.isNaN(num(formData.get("hba1c")))) entries.push({ test_name: "HbA1c", value: num(formData.get("hba1c")), unit: "%" });
  if (!Number.isNaN(num(formData.get("hdl")))) entries.push({ test_name: "HDL", value: num(formData.get("hdl")), unit: "mg/dL" });
  if (!Number.isNaN(num(formData.get("ldl")))) entries.push({ test_name: "LDL", value: num(formData.get("ldl")), unit: "mg/dL" });
  if (!Number.isNaN(num(formData.get("triglycerides")))) entries.push({ test_name: "Triglycerides", value: num(formData.get("triglycerides")), unit: "mg/dL" });
  const sys = num(formData.get("bp_systolic"));
  const dia = num(formData.get("bp_diastolic"));
  if (!Number.isNaN(sys)) entries.push({ test_name: "BP_Systolic", value: sys, unit: "mmHg" });
  if (!Number.isNaN(dia)) entries.push({ test_name: "BP_Diastolic", value: dia, unit: "mmHg" });

  if (entries.length === 0) return { error: "Enter at least one metric." };

  try {
    for (const e of entries) {
      await sql`
        INSERT INTO lab_results (user_id, test_name, value, unit, test_date)
        VALUES (${userId}, ${e.test_name}, ${e.value}, ${e.unit}, ${testDate})
      `;
    }
    revalidatePath("/lab");
    revalidatePath("/report");
    return { success: true };
  } catch (err) {
    console.error("addLabResult:", err);
    return { error: "Failed to save lab result." };
  }
}

export async function getLabResults(): Promise<LabResultRow[]> {
  const userId = await getUserId();
  if (!userId) return [];
  try {
    const { rows } = await sql`
      SELECT id, test_name, value, unit, test_date::text AS test_date, created_at
      FROM lab_results WHERE user_id = ${userId} ORDER BY test_date DESC, created_at DESC
    `;
    return rows as LabResultRow[];
  } catch (e) {
    console.error("getLabResults:", e);
    return [];
  }
}

const MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

/** Parse uploaded PDF, extract lab markers, and save to lab_results. */
export async function parseAndSaveLabPdf(
  _prev: UploadLabPdfState,
  formData: FormData
): Promise<UploadLabPdfState> {
  const userId = await getUserId();
  if (!userId) return { error: "Sign in to upload a lab report." };

  const file = formData.get("file") as File | null;
  if (!file || !(file instanceof File)) return { error: "No file provided." };
  if (file.type !== "application/pdf")
    return { error: "Only PDF files are allowed." };
  if (file.size > MAX_PDF_SIZE_BYTES)
    return { error: "File is too large (max 10 MB)." };

  try {
    const arrayBuffer = await file.arrayBuffer();
    const { extractTextFromPdfBuffer } = await import("@/lib/pdf-text-extract");
    const text = await extractTextFromPdfBuffer(arrayBuffer);

    console.log("[parseAndSaveLabPdf] raw text length:", text.length);
    console.log("[parseAndSaveLabPdf] raw text (first 2000 chars):", text.slice(0, 2000));

    if (!text.trim()) return { error: "Could not extract text from this PDF." };

    const { date, entries } = extractLabEntriesFromText(text);
    if (entries.length === 0)
      return { error: "No lab markers (e.g. Glukoz, Kreatinin, HbA1c, HDL, LDL) found in the PDF." };

    const testDate =
      date &&
      /^\d{4}-\d{2}-\d{2}$/.test(date) &&
      !Number.isNaN(Date.parse(date))
        ? date
        : new Date().toISOString().slice(0, 10);

    for (const e of entries) {
      await sql`
        INSERT INTO lab_results (user_id, test_name, value, unit, test_date)
        VALUES (${userId}, ${e.test_name}, ${e.value}, ${e.unit}, ${testDate})
      `;
    }

    revalidatePath("/lab");
    revalidatePath("/report");
    return { success: true, extractedCount: entries.length };
  } catch (err) {
    console.error("parseAndSaveLabPdf:", err);
    return { error: "Failed to process PDF. The file may be scanned or corrupted." };
  }
}

/** Latest value per test_name for report summary */
export async function getLatestLabResultsForReport(): Promise<{ test_name: string; value: number; unit: string | null; test_date: string }[]> {
  const userId = await getUserId();
  if (!userId) return [];
  try {
    const { rows } = await sql`
      SELECT DISTINCT ON (test_name) test_name, value, unit, test_date::text AS test_date
      FROM lab_results WHERE user_id = ${userId} ORDER BY test_name, test_date DESC
    `;
    return rows as { test_name: string; value: number; unit: string | null; test_date: string }[];
  } catch (e) {
    console.error("getLatestLabResultsForReport:", e);
    return [];
  }
}

// ---- Report: combined data ----
export async function getReportData(): Promise<{
  glucose: { id: string; value: number; type: string; notes: string | null; created_at: Date }[];
  medicationLogs: { id: string; medication_id: string; taken_at: Date; notes: string | null; medication_name?: string }[];
  medications: { id: string; name: string; dosage: string; unit: string; frequency: string }[];
  labResultsLatest: { test_name: string; value: number; unit: string | null; test_date: string }[];
  timeInRange: { hypo: number; inRange: number; slightlyHigh: number; high: number };
}> {
  const userId = await getUserId();
  const [glucose, medicationLogs, medications, labResultsLatest, logsForTir] = await Promise.all([
    getGlucoseLogs(),
    getMedicationLogs(),
    getMedications(),
    getLatestLabResultsForReport(),
    userId
      ? sql`SELECT value FROM glucose_logs WHERE user_id = ${userId} ORDER BY created_at ASC`
      : sql`SELECT value FROM glucose_logs WHERE user_id IS NULL ORDER BY created_at ASC`,
  ]);
  const medMap = Object.fromEntries(medications.map((m) => [m.id, m]));
  const medicationLogsWithName = medicationLogs.map((log) => ({
    ...log,
    medication_name: medMap[log.medication_id]?.name ?? "—",
  }));

  const values = (logsForTir.rows as { value: number }[]).map((r) => r.value);
  let hypo = 0, inRange = 0, slightlyHigh = 0, high = 0;
  for (const v of values) {
    if (v < 70) hypo++;
    else if (v <= 140) inRange++;
    else if (v <= 180) slightlyHigh++;
    else high++;
  }
  const total = values.length;
  const timeInRange = total > 0
    ? { hypo: Math.round((hypo / total) * 100), inRange: Math.round((inRange / total) * 100), slightlyHigh: Math.round((slightlyHigh / total) * 100), high: Math.round((high / total) * 100) }
    : { hypo: 0, inRange: 0, slightlyHigh: 0, high: 0 };

  return {
    glucose,
    medicationLogs: medicationLogsWithName,
    medications,
    labResultsLatest,
    timeInRange,
  };
}
