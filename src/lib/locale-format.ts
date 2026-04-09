import type { Locale } from "@/constants/translations";

const BCP47: Record<Locale, string> = {
  en: "en-US",
  es: "es-CL",
  pt: "pt-BR",
  fr: "fr-FR",
  de: "de-DE",
  it: "it-IT",
  ja: "ja-JP",
};

/** BCP 47 tag for `Intl` date/time formatting from the active UI locale */
export function dateTimeLocale(locale: Locale): string {
  return BCP47[locale] ?? "en-US";
}
