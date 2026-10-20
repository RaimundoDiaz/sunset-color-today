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
  /** 0–1 open fraction of the sunset path; when known, local cloud/rain only count where it's blocked */
  horizonGap?: number | null;
  /** 0–1: overhead clouds lit from below through an open horizon */
  underlit?: number;
}): number {
  const { effectiveAOD, cloudHigh, cloudLow, totalCloud, humidity, visKm, isRaining, weatherCode, aod, horizonGap, underlit = 0 } = params;
  const blocked = horizonGap == null ? 1 : 1 - horizonGap;
  let q = 50;
  q += clamp((1 - effectiveAOD / 0.5) * 12, -10, 12);
  q += cloudHigh >= 30 && cloudHigh <= 70 ? 15 : cloudHigh > 10 ? 5 : -3;
  q -= (cloudLow / 100) * 25 * blocked;
  q -= totalCloud > 90 ? 20 * blocked : 0;
  if (isRaining) q -= 30 * blocked;
  q -= humidity > 70 ? 10 : humidity > 55 ? 3 : 0;
  // In rain, low visibility is the precipitation itself (already scaled above)
  q += visKm > 25 ? 10 : visKm > 12 ? 5 : visKm < 5 ? -10 * (isRaining ? blocked : 1) : 0;
  if (!isRaining && weatherCode <= 3 && visKm > 20 && aod < 0.1 && cloudHigh > 15) q += 10;
  q += underlit * 40;
  return clamp(Math.round(q), 0, 100);
}
