import { clamp } from "./color-utils";

export function calculateQuality(params: {
  effectiveAOD: number;
  cloudHigh: number;
  cloudLow: number;
  totalCloud: number;
  humidity: number;
  visKm: number;
  isRaining: boolean;
  weatherCode: number;
  aod: number;
}): number {
  const { effectiveAOD, cloudHigh, cloudLow, totalCloud, humidity, visKm, isRaining, weatherCode, aod } = params;
  let q = 50;
  q += clamp((1 - effectiveAOD / 0.5) * 12, -10, 12);
  q += cloudHigh >= 30 && cloudHigh <= 70 ? 15 : cloudHigh > 10 ? 5 : -3;
  q -= (cloudLow / 100) * 25;
  q -= totalCloud > 90 ? 20 : 0;
  if (isRaining) q -= 30;
  q -= humidity > 70 ? 10 : humidity > 55 ? 3 : 0;
  q += visKm > 25 ? 10 : visKm > 12 ? 5 : visKm < 5 ? -10 : 0;
  if (!isRaining && weatherCode <= 3 && visKm > 20 && aod < 0.1 && cloudHigh > 15) q += 10;
  return clamp(Math.round(q), 0, 100);
}
