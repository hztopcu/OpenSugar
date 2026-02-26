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
    });
  } catch (err: unknown) {
    // Başarılı girişte NextAuth NEXT_REDIRECT fırlatır — onu yeniden fırlatıyoruz.
    const d = (err as { digest?: string })?.digest;
    if (d === "NEXT_REDIRECT") throw err;
    // Giriş başarısız (CredentialsSignin): login sayfasına hata ile yönlendir
    redirect(`/login?error=CredentialsSignin&callbackUrl=${encodeURIComponent(safeCallback)}`);
  }
}
