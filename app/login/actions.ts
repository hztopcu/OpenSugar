"use server";

import { signIn } from "@/auth";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const username = formData.get("username") as string | null;
  const password = formData.get("password") as string | null;
  const callbackUrl = (formData.get("callbackUrl") as string) || "/";
  const safeCallback = callbackUrl.startsWith("/") ? callbackUrl : "/";

  try {
    await signIn("credentials", {
      username: username?.trim() ?? "",
      password: password ?? "",
      redirectTo: safeCallback,
      redirect: false,
    });
  } catch (err: unknown) {
    const d = (err as { digest?: string })?.digest;
    if (d === "NEXT_REDIRECT") {
      throw err;
    }
    redirect(`/login?error=CredentialsSignin&callbackUrl=${encodeURIComponent(safeCallback)}`);
  }

  redirect(safeCallback);
}
