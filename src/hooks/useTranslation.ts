"use client";

import { useCallback } from "react";
import { useSunsetStore } from "@/store/useSunsetStore";
import { t, type TranslationKey } from "@/constants/translations";

export function useT() {
  const locale = useSunsetStore((s) => s.locale);
  return useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>) => t(locale, key, vars),
    [locale],
  );
}

export function useLocale() {
  return useSunsetStore((s) => s.locale);
}
