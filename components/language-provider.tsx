"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  type Locale,
  defaultLocale,
  getStoredLocale,
  setStoredLocale as persistLocale,
  t as translate,
} from "@/lib/i18n";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    return {
      locale: defaultLocale,
      setLocale: () => {},
      t: (key: string) => key,
    };
  }
  return ctx;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLocaleState(getStoredLocale());
    setMounted(true);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    persistLocale(next);
    if (typeof document !== "undefined") {
      document.documentElement.lang = next === "tr" ? "tr" : "en";
    }
  }, []);

  useEffect(() => {
    if (mounted && typeof document !== "undefined") {
      document.documentElement.lang = locale === "tr" ? "tr" : "en";
    }
  }, [mounted, locale]);

  const t = useCallback(
    (key: string) => translate(locale, key),
    [locale]
  );

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
