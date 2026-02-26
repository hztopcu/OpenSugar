"use client";

import { Toaster } from "sonner";
import { PwaRegister } from "@/components/pwa-register";
import { LanguageProvider } from "@/components/language-provider";
import { AppShell } from "@/components/app-shell";

export function AppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <AppShell>{children}</AppShell>
      <Toaster position="top-center" richColors closeButton />
      <PwaRegister />
    </LanguageProvider>
  );
}
