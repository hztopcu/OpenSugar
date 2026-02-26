/**
 * Reference ranges and trend helpers for lab analysis (single + comparative).
 */

export type LabInterpretation = "good" | "attention" | "high" | "low";

export interface RefRange {
  good: (v: number) => boolean;
  attention?: (v: number) => boolean;
  high?: (v: number) => boolean;
  low?: (v: number) => boolean;
  /** Lower is better (e.g. HbA1c, LDL). For HDL, lower is worse so we use invert. */
  lowerIsBetter?: boolean;
}

export const REF_RANGES: Record<string, RefRange> = {
  HbA1c: {
    lowerIsBetter: true,
    good: (v) => v < 5.7,
    attention: (v) => v >= 5.7 && v < 6.5,
    high: (v) => v >= 6.5,
  },
  HDL: {
    lowerIsBetter: false,
    good: (v) => v >= 60,
    attention: (v) => v >= 40 && v < 60,
    low: (v) => v < 40,
  },
  LDL: {
    lowerIsBetter: true,
    good: (v) => v < 100,
    attention: (v) => v >= 100 && v < 130,
    high: (v) => v >= 130,
  },
  Triglycerides: {
    lowerIsBetter: true,
    good: (v) => v < 150,
    attention: (v) => v >= 150 && v < 200,
    high: (v) => v >= 200,
  },
  BP_Systolic: {
    lowerIsBetter: true,
    good: (v) => v < 120,
    attention: (v) => v >= 120 && v < 130,
    high: (v) => v >= 130,
  },
  BP_Diastolic: {
    lowerIsBetter: true,
    good: (v) => v < 80,
    attention: (v) => v >= 80 && v < 85,
    high: (v) => v >= 85,
  },
};

export function interpretValue(
  testName: string,
  value: number
): LabInterpretation | null {
  const ref = REF_RANGES[testName];
  if (!ref) return null;
  if (ref.good(value)) return "good";
  if (ref.high && ref.high(value)) return "high";
  if (ref.low && ref.low(value)) return "low";
  if (ref.attention && ref.attention(value)) return "attention";
  return "good";
}

export function compareTrend(
  testName: string,
  previous: number,
  latest: number
): "improved" | "worsened" | "unchanged" {
  const ref = REF_RANGES[testName];
  const delta = latest - previous;
  if (delta === 0) return "unchanged";
  if (!ref) return "unchanged";
  const lowerIsBetter = ref.lowerIsBetter ?? false;
  if (lowerIsBetter) {
    return delta < 0 ? "improved" : "worsened";
  }
  return delta > 0 ? "improved" : "worsened";
}
