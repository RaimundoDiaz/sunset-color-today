import type { Locale } from "@/constants/translations";

/** BCP 47 tag for `Intl` date/time formatting from the active UI locale */
export function dateTimeLocale(locale: Locale): string {
  return locale === "es" ? "es-CL" : "en-US";
}
