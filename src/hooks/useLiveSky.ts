"use client";

import { useEffect, useState, useCallback } from "react";
import { formatInTimeZone } from "date-fns-tz";
import { enUS, es, ptBR, fr, de, it, ja, zhCN, ko, ru, ar, hi, tr as trLocale, nl, pl } from "date-fns/locale";
import { t as tr } from "@/constants/translations";
import type { LocationData } from "@/store/useSunsetStore";
import { solarElevation } from "@/lib/solar";
import { liveSkyColor, getSkyPhaseI18n } from "@/lib/live-sky";
import { hslToRgb, rgbToHex } from "@/lib/color-utils";
import { useSunsetStore } from "@/store/useSunsetStore";
import type { LiveSkyState } from "@/types";

const DEFAULT_STATE: LiveSkyState = {
  timeStr: "--:--:--",
  dateStr: "--",
  elevation: 0,
  phase: { name: "...", desc: "", icon: "" },
  sky: { h: 235, s: 8, l: 10 },
  skyHex: "#1A1A2E",
  countdown: { value: "--", label: "--", isActive: false },
};

export function useLiveSky(loc: LocationData, sunsetIso?: string, sunriseIso?: string): LiveSkyState {
  const atmosphericData = useSunsetStore((s) => s.atmosphericData);
  const locale = useSunsetStore((s) => s.locale);
  const [state, setState] = useState<LiveSkyState>(DEFAULT_STATE);

  const tick = useCallback(() => {
    const now = new Date();
    const dateFnsMap = { en: enUS, es, pt: ptBR, fr, de, it, ja, zh: zhCN, ko, ru, ar, hi, tr: trLocale, nl, pl } as const;
    const dateFnsLocale = dateFnsMap[locale] ?? enUS;
    const timeStr = formatInTimeZone(now, loc.tz, "HH:mm:ss", { locale: dateFnsLocale });
    const dateStr = formatInTimeZone(now, loc.tz, "EEEE, d MMMM yyyy", { locale: dateFnsLocale });

    const elevation = solarElevation(loc.lat, loc.lon, now);
    const phase = getSkyPhaseI18n(elevation, locale);
    const sky = liveSkyColor(elevation, atmosphericData ?? {});
    const [r, g, b] = hslToRgb(sky.h, sky.s, sky.l);
    const skyHex = rgbToHex(r, g, b);

    // Countdown
    let countdown = { value: "--", label: "--", isActive: false };
    if (sunsetIso) {
      const diff = new Date(sunsetIso).getTime() - now.getTime();
      const absDiff = Math.abs(diff);
      const h = Math.floor(absDiff / 3600000);
      const m = Math.floor((absDiff % 3600000) / 60000);

      const ago = tr(locale, "ago");
      if (diff > 0 && diff < 15 * 60 * 1000) {
        countdown = { value: `${Math.ceil(diff / 60000)} min`, label: tr(locale, "sunsetImminent"), isActive: true };
      } else if (diff <= 0 && absDiff < 15 * 60 * 1000) {
        countdown = { value: `${ago} ${Math.ceil(absDiff / 60000)} min`, label: tr(locale, "sunsetHappening"), isActive: true };
      } else if (diff > 0) {
        countdown = { value: h > 0 ? `${h}h ${m}m` : `${m} min`, label: tr(locale, "forSunset"), isActive: false };
      } else {
        countdown = { value: h > 0 ? `${ago} ${h}h ${m}m` : `${ago} ${m} min`, label: tr(locale, "sinceSunset"), isActive: false };
      }
    }

    setState({ timeStr, dateStr, elevation, phase, sky, skyHex, countdown });
  }, [loc, atmosphericData, sunsetIso, locale]);

  useEffect(() => {
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tick]);

  return state;
}
