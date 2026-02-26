import { NextResponse } from "next/server";
import { ensureAllTables } from "@/lib/db";

/**
 * One-time setup: create glucose_logs, medications, medication_logs tables.
 * Call GET /api/setup once after setting POSTGRES_URL.
 */
export async function GET() {
  try {
    await ensureAllTables();
    return NextResponse.json({ ok: true, message: "Tables ready." });
  } catch (e) {
    console.error("Setup error:", e);
    return NextResponse.json(
      { ok: false, error: String(e) },
      { status: 500 }
    );
  }
}
