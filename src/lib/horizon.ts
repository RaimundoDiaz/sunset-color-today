import { clamp } from "./color-utils";
import { dayOfYear } from "./solar";

/**
 * Sunset light reaches the clouds over the observer by skimming the horizon.
 * If the sky is overcast overhead but open toward the sun, the clouds are lit
 * from below and glow red — the "fire sky" a point forecast can't see.
 * We sample cloud cover at a few points along the sunset azimuth.
 */
export const HORIZON_DISTANCES_KM = [50, 150, 300] as const;
// Mid-range dominates: that's where the beam passes under a ~3–6 km cloud base
const HORIZON_WEIGHTS = [0.3, 0.4, 0.3] as const;

const EARTH_RADIUS_KM = 6371;
const rad = Math.PI / 180;

/** Sunset azimuth in degrees clockwise from north (elevation 0, no refraction). */
export function sunsetAzimuth(lat: number, date: Date): number {
  const decl = 23.45 * Math.sin((360 / 365) * (dayOfYear(date) + 284) * rad);
  const cosAz = clamp(Math.sin(decl * rad) / Math.cos(lat * rad), -1, 1);
  return 360 - Math.acos(cosAz) / rad;
}

/** Great-circle destination from a start point, bearing (deg) and distance (km). */
export function destinationPoint(lat: number, lon: number, bearing: number, km: number) {
  const d = km / EARTH_RADIUS_KM;
  const p1 = lat * rad;
  const l1 = lon * rad;
  const b = bearing * rad;
  const p2 = Math.asin(Math.sin(p1) * Math.cos(d) + Math.cos(p1) * Math.sin(d) * Math.cos(b));
  const l2 = l1 + Math.atan2(Math.sin(b) * Math.sin(d) * Math.cos(p1), Math.cos(d) - Math.sin(p1) * Math.sin(p2));
  return { lat: p2 / rad, lon: ((l2 / rad + 540) % 360) - 180 };
}

/** Sample points along today's sunset direction. */
export function horizonPoints(lat: number, lon: number, date: Date) {
  const az = sunsetAzimuth(lat, date);
  return HORIZON_DISTANCES_KM.map((km) => destinationPoint(lat, lon, az, km));
}

export interface HorizonSample {
  cloudLow: number;
  cloudMid: number;
  weatherCode: number;
}

/** How much a sample point blocks the low-angle beam (0 = open, 1 = blocked). */
function sampleOpacity(s: HorizonSample): number {
  // Low cloud blocks the beam outright; mid cloud partly (beam can pass under its base)
  let o = clamp((s.cloudLow + 0.5 * s.cloudMid) / 100, 0, 1);
  const c = s.weatherCode;
  if (c === 45 || c === 48) o = Math.max(o, 0.9);              // fog
  else if (c >= 51 && c <= 57) o = Math.max(o, 0.4);           // drizzle
  else if (c >= 61) o = Math.max(o, 0.8);                      // rain, snow, showers, storms
  return o;
}

/** Fraction of the sunset path that is open (0 = blocked, 1 = clear to the horizon). */
export function horizonGap(samples: HorizonSample[]): number {
  if (samples.length !== HORIZON_WEIGHTS.length) return 0;
  let blocked = 0;
  for (let i = 0; i < samples.length; i++) blocked += HORIZON_WEIGHTS[i] * sampleOpacity(samples[i]);
  return clamp(1 - blocked, 0, 1);
}
