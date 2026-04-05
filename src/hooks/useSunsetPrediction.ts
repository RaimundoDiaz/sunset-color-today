"use client";

import { useMemo } from "react";
import { calculateSunsetColor } from "@/lib/sunset-color";
import { useSunsetStore } from "@/store/useSunsetStore";
import type { SunsetResult } from "@/types";

export function useSunsetPrediction(
  weather: unknown | null,
  air: unknown | null,
  power: unknown | null,
  ecmwf: unknown | null,
  lat: number,
  lon: number,
): SunsetResult | null {
  const locale = useSunsetStore((s) => s.locale);
  return useMemo(() => {
    if (!weather) return null;
    return calculateSunsetColor(weather, air, power, ecmwf, lat, lon, locale);
  }, [weather, air, power, ecmwf, lat, lon, locale]);
}
