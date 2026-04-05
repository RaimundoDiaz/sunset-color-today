import { clamp } from "./color-utils";

export function dayOfYear(d: Date): number {
  const s = new Date(d.getFullYear(), 0, 0);
  return Math.floor((d.getTime() - s.getTime()) / 86400000);
}

/**
 * Solar elevation angle in degrees.
 * Uses UTC time directly with longitude correction — no timezone conversion needed.
 */
export function solarElevation(lat: number, lon: number, date: Date): number {
  const doy = dayOfYear(date);
  const declRad =
    23.45 * Math.sin(((360 / 365) * (doy + 284) * Math.PI) / 180) * (Math.PI / 180);
  // Equation of time (minutes)
  const B = ((360 / 365) * (doy - 81) * Math.PI) / 180;
  const EoT = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
  // Solar time from UTC
  const utcH =
    date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  const solarTime = utcH + lon / 15 + EoT / 60;
  const haRad = ((solarTime - 12) * 15 * Math.PI) / 180;
  const latRad = (lat * Math.PI) / 180;
  const sinElev =
    Math.sin(latRad) * Math.sin(declRad) +
    Math.cos(latRad) * Math.cos(declRad) * Math.cos(haRad);
  return (Math.asin(clamp(sinElev, -1, 1)) * 180) / Math.PI;
}

/** Kasten-Young (1989) air mass from sun elevation */
export function airMassFromElevation(elev: number): number {
  if (elev > 89) return 1;
  const z = 90 - elev;
  if (z >= 91.5) return 40;
  return (
    1 /
    (Math.cos((z * Math.PI) / 180) +
      0.50572 * Math.pow(96.07995 - z, -1.6364))
  );
}
