/**
 * Extract lab marker values and test date from PDF text using regex.
 * Handles common lab report formats (e.g. "HbA1c: 6.2 %", "Glucose 98 mg/dL").
 */

export interface ExtractedLabEntry {
  test_name: string;
  value: number;
  unit: string | null;
}

/**
 * Try to parse a date from PDF text.
 * Supports: YYYY-MM-DD, DD/MM/YYYY, DD.MM.YYYY (e.g. 26.01.2026), "Date: ...", etc.
 */
export function extractTestDate(text: string): string | null {
  const normalized = text.replace(/\s+/g, " ");

  // ISO-style
  const iso = normalized.match(/\b(20\d{2})-(\d{2})-(\d{2})\b/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;

  // DD.MM.YYYY (e.g. e-Nabız / Turkish reports: 26.01.2026)
  const dot = normalized.match(/\b(\d{1,2})\.(\d{1,2})\.(\d{4})\b/);
  if (dot) {
    const [, d, m, year] = dot;
    const day = d!.length === 1 ? `0${d}` : d!;
    const month = m!.length === 1 ? `0${m}` : m!;
    const dayNum = parseInt(d!, 10);
    const monthNum = parseInt(m!, 10);
    if (monthNum >= 1 && monthNum <= 12 && dayNum >= 1 && dayNum <= 31) {
      return `${year}-${month}-${day}`;
    }
  }

  // DD/MM/YYYY or MM/DD/YYYY
  const slash = normalized.match(/\b(\d{1,2})\/(\d{1,2})\/(\d{4})\b/);
  if (slash) {
    const [, a, b, year] = slash;
    const month = a!.length === 1 ? `0${a}` : a!;
    const day = b!.length === 1 ? `0${b}` : b!;
    const monthNum = parseInt(month, 10);
    const dayNum = parseInt(day, 10);
    if (monthNum >= 1 && monthNum <= 12 && dayNum >= 1 && dayNum <= 31) {
      return `${year}-${month}-${day}`;
    }
  }

  // "Date:" or "Report Date:" or "Collection Date:" followed by date
  const dateLabel = normalized.match(/(?:Report\s+)?(?:Collection\s+)?Date\s*[:]\s*(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})/i);
  if (dateLabel) {
    const [, d, m, y] = dateLabel;
    const year = (y!.length === 2) ? `20${y}` : y!;
    const month = m!.length === 1 ? `0${m}` : m!;
    const day = d!.length === 1 ? `0${d}` : d!;
    return `${year}-${month}-${day}`;
  }

  return null;
}

/** Extract one marker: "Name" optional ":" spaces number. */
function extractOne(
  text: string,
  def: { name: string; testName: string; unit: string | null }
): ExtractedLabEntry | null {
  const escaped = def.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(
    `${escaped}\\s*[:]?\\s*([\\d]+[.,]?[\\d]*)\\s*(?:%|mg/dL|mmHg)?`,
    "i"
  );
  const match = text.match(regex);
  if (!match) return null;
  const valueStr = match[1].replace(",", ".");
  const value = parseFloat(valueStr);
  return Number.isFinite(value) ? { test_name: def.testName, value, unit: def.unit } : null;
}

const MARKER_DEFS: { name: string; testName: string; unit: string | null }[] = [
  { name: "HbA1c", testName: "HbA1c", unit: "%" },
  { name: "A1C", testName: "HbA1c", unit: "%" },
  { name: "Hemoglobin A1c", testName: "HbA1c", unit: "%" },
  { name: "Glukoz", testName: "Glucose", unit: "mg/dL" },
  { name: "Fasting Glucose", testName: "Glucose", unit: "mg/dL" },
  { name: "Glucose", testName: "Glucose", unit: "mg/dL" },
  { name: "Blood Glucose", testName: "Glucose", unit: "mg/dL" },
  { name: "Kreatinin", testName: "Creatinine", unit: "mg/dL" },
  { name: "Creatinine", testName: "Creatinine", unit: "mg/dL" },
  { name: "HDL", testName: "HDL", unit: "mg/dL" },
  { name: "HDL Cholesterol", testName: "HDL", unit: "mg/dL" },
  { name: "LDL", testName: "LDL", unit: "mg/dL" },
  { name: "LDL Cholesterol", testName: "LDL", unit: "mg/dL" },
  { name: "Triglycerides", testName: "Triglycerides", unit: "mg/dL" },
  { name: "TRIG", testName: "Triglycerides", unit: "mg/dL" },
  { name: "Systolic", testName: "BP_Systolic", unit: "mmHg" },
  { name: "BP Systolic", testName: "BP_Systolic", unit: "mmHg" },
  { name: "Diastolic", testName: "BP_Diastolic", unit: "mmHg" },
  { name: "BP Diastolic", testName: "BP_Diastolic", unit: "mmHg" },
];

export function extractLabEntriesFromText(text: string): {
  date: string | null;
  entries: ExtractedLabEntry[];
} {
  const date = extractTestDate(text) ?? null;
  const t = text.replace(/\s+/g, " ");
  const byName = new Map<string, ExtractedLabEntry>();
  for (const def of MARKER_DEFS) {
    const entry = extractOne(t, def);
    if (entry && !byName.has(entry.test_name)) byName.set(entry.test_name, entry);
  }
  return { date, entries: Array.from(byName.values()) };
}
