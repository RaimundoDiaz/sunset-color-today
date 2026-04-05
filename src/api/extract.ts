import type { AirAtSunset } from "@/types";

export function getSunsetHourIndex(hourlyTimes: string[], sunsetIso: string): number {
  const sunsetHour = new Date(sunsetIso).getHours();
  for (let i = 0; i < hourlyTimes.length; i++) {
    if (new Date(hourlyTimes[i]).getHours() === sunsetHour) return i;
  }
  return Math.min(sunsetHour, hourlyTimes.length - 1);
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function airAtSunset(air: any | null, idx: number): AirAtSunset {
  if (!air) return { aod: 0.15, pm25: 10, pm10: 15, dust: 0, ozone: 60 };
  const h = air.hourly;
  return {
    aod:   h?.aerosol_optical_depth?.[idx] ?? air.current?.aerosol_optical_depth ?? 0.15,
    pm25:  h?.pm2_5?.[idx]                 ?? air.current?.pm2_5 ?? 10,
    pm10:  h?.pm10?.[idx]                  ?? air.current?.pm10 ?? 15,
    dust:  h?.dust?.[idx]                  ?? air.current?.dust ?? 0,
    ozone: h?.ozone?.[idx]                 ?? 60,
  };
}

export function extractPowerOzone(power: any | null): number | null {
  if (!power?.properties?.parameter?.TO3) return null;
  const to3 = power.properties.parameter.TO3;
  const vals = Object.values(to3).filter((v): v is number => typeof v === "number" && v > 0 && v < 600);
  if (vals.length === 0) return null;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

export function extractPowerWaterVapor(power: any | null): number | null {
  if (!power?.properties?.parameter?.TQV) return null;
  const tqv = power.properties.parameter.TQV;
  const vals = Object.values(tqv).filter((v): v is number => typeof v === "number" && v > 0 && v < 100);
  if (vals.length === 0) return null;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}
