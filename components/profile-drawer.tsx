"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { signOut } from "next-auth/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/components/language-provider";

type ProfileDrawerContextValue = { open: () => void; close: () => void };
const ProfileDrawerContext = createContext<ProfileDrawerContextValue | null>(null);

export function useProfileDrawer() {
  const ctx = useContext(ProfileDrawerContext);
  return ctx ?? { open: () => {}, close: () => {} };
}

export function ProfileDrawer() {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();
  const value: ProfileDrawerContextValue = {
    open: useCallback(() => setOpen(true), []),
    close: useCallback(() => setOpen(false), []),
  };

  return (
    <ProfileDrawerContext.Provider value={value}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Profile and settings"
        className={cn(
          "fixed inset-0 z-[60] md:hidden",
          "transition-opacity duration-150",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <div
          className="absolute inset-0 bg-black/20"
          onClick={() => setOpen(false)}
          aria-hidden
        />
        <div
          className={cn(
            "absolute right-0 top-0 h-full w-[min(100%,280px)] bg-card shadow-soft",
            "transition-transform duration-150 ease-out",
            open ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex flex-col p-4">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="text-lg font-semibold">Profile</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-smooth"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Language
                </p>
                <LanguageSwitcher />
              </div>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/login" })}
                className={cn(
                  "flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm font-medium",
                  "text-muted-foreground transition-smooth hover:bg-muted hover:text-foreground"
                )}
              >
                {t("nav.signOut")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProfileDrawerContext.Provider>
  );
}
