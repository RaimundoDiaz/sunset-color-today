"use client";

import { SunsetTimeRow } from "./SunsetTimeRow";
import { QualityBar } from "./QualityBar";
import { SunsetGradient } from "./SunsetGradient";
import { ColorDisplay } from "./ColorDisplay";
import { WeatherGrid } from "./WeatherGrid";
import { Explanation } from "./Explanation";
import type { SunsetResult } from "@/types";
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

export function PredictionPanel({ result }: { result: SunsetResult }) {
  const locale = useSunsetStore((s) => s.locale);
  const { h, s, l, r, g, b, factors, weatherData, timeline, peak } = result;

  return (
    <>
      <SunsetTimeRow time={formatTime(weatherData.sunsetTime, locale)} />
      <QualityBar quality={weatherData.quality} />
      <SunsetGradient timeline={timeline} peak={peak} />
      <ColorDisplay hex={result.hex} r={r} g={g} b={b} h={h} s={s} l={l} />
      <WeatherGrid data={weatherData} />
      <Explanation factors={factors} />
    </>
  );
}
