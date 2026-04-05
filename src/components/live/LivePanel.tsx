"use client";

import { LiveClock } from "./LiveClock";
import { SunInfoCards } from "./SunInfoCards";
import { SunsetCountdown } from "./SunsetCountdown";
import { SkyPhase } from "./SkyPhase";
import { LiveColorDisplay } from "./LiveColorDisplay";
import type { LiveSkyState } from "@/types";
import type { Locale } from "@/constants/translations";
import { useSunsetStore } from "@/store/useSunsetStore";
import { dateTimeLocale } from "@/lib/locale-format";

function formatTime(iso: string, locale: Locale): string {
  return new Date(iso).toLocaleTimeString(dateTimeLocale(locale), {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function LivePanel({
  live,
  sunsetIso,
  sunriseIso,
}: {
  live: LiveSkyState;
  sunsetIso?: string;
  sunriseIso?: string;
}) {
  const locale = useSunsetStore((s) => s.locale);
  const elevIcon = live.elevation > 0
    ? "\u2600\uFE0F"
    : live.elevation > -6
      ? "\uD83C\uDF05"
      : "\uD83C\uDF19";

  return (
    <>
      <LiveClock time={live.timeStr} date={live.dateStr} />
      <SunInfoCards
        elevation={live.elevation}
        elevIcon={elevIcon}
        sunsetTime={sunsetIso ? formatTime(sunsetIso, locale) : "--:--"}
        sunriseTime={sunriseIso ? formatTime(sunriseIso, locale) : "--:--"}
      />
      <SunsetCountdown
        value={live.countdown.value}
        label={live.countdown.label}
        isActive={live.countdown.isActive}
      />
      <SkyPhase phase={live.phase} />
      <LiveColorDisplay hex={live.skyHex} />
    </>
  );
}
