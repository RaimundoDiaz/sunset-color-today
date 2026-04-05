import { clamp } from "./color-utils";

/** Ångström exponent estimate from PM2.5 / PM10 ratio */
export function estimateAngstrom(pm25: number, pm10: number): number {
  if (!pm10 || pm10 <= 0) return 1.3;
  return clamp(0.2 + clamp(pm25 / pm10, 0, 1) * 2.0, 0, 2.2);
}

/** Ozone column estimate (Dobson Units) from UV index and latitude */
export function estimateOzoneDU(uvMax: number, latAbs: number): number {
  let base = latAbs > 50 ? 340 : latAbs > 30 ? 310 : latAbs < 15 ? 260 : 300;
  if (uvMax > 10) base -= 30;
  else if (uvMax > 7) base -= 15;
  return clamp(base, 200, 450);
}

/**
 * Hygroscopic growth factor: humidity swells aerosol particles
 *   f(RH) ≈ (1 - RH/100)^(-0.5)
 */
export function hygroscopicGrowth(rh: number): number {
  return Math.pow(1 / (1 - Math.min(rh, 95) / 100), 0.5);
}

/**
 * Effective air mass for sunset light.
 * High clouds at 10km see sun ~3° higher → AM≈18.
 * Clear sky → AM≈30.
 */
export function effectiveSunsetAM(cloudHigh: number, cloudMid: number): number {
  return 30 - clamp((cloudHigh + cloudMid * 0.5) / 100, 0, 1) * 12;
}
