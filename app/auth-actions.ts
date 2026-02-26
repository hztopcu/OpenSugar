"use server";

import { redirect } from "next/navigation";
import { sql } from "@vercel/postgres";
import bcrypt from "bcryptjs";

export async function signUpAction(formData: FormData) {
  const username = (formData.get("username") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  if (!username || !password || password.length < 6) {
    redirect("/signup?error=invalid");
  }
  const hash = await bcrypt.hash(password, 10);
  try {
    await sql`INSERT INTO users (username, password_hash) VALUES (${username}, ${hash})`;
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && (e as { code: string }).code === "23505") {
      redirect("/signup?error=exists");
    }
    throw e;
  }
  redirect("/login?registered=1");
}
