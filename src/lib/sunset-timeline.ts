import { computeSunsetTimeline } from "./sky-scattering";
import { spectrumToRGB } from "./spectral-model";
import { rgbToHex, rgbToHSL } from "./color-utils";

export interface TimelineStop {
  elevation: number;
  r: number;
  g: number;
  b: number;
  hex: string;
  h: number;
  s: number;
  l: number;
}

export interface SunsetTimelineResult {
  stops: TimelineStop[];
  peak: TimelineStop;
  peakIndex: number;
}

/**
 * Compute the full sunset color timeline using the single-scattering model.
 * Returns colors at multiple sun elevations + the peak (most vivid) color.
 */
export function buildSunsetTimeline(
  P_hPa: number,
  aod550: number,
  angstrom: number,
  ozoneDU: number,
  pwCm: number,
  numStops = 12,
): SunsetTimelineResult {
  const raw = computeSunsetTimeline(P_hPa, aod550, angstrom, ozoneDU, pwCm, numStops);

  const stops: TimelineStop[] = raw.map(({ elevation, spectrum }) => {
    const rgb = spectrumToRGB(spectrum);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    const hsl = rgbToHSL(rgb.r, rgb.g, rgb.b);
    return {
      elevation,
      r: rgb.r,
      g: rgb.g,
      b: rgb.b,
      hex,
      h: hsl.h,
      s: hsl.s,
      l: hsl.l,
    };
  });

  // Peak = highest saturation (most vivid color)
  let peakIndex = 0;
  let maxSat = 0;
  for (let i = 0; i < stops.length; i++) {
    // Weight saturation by lightness to avoid picking very dark or very light colors
    const score = stops[i].s * (1 - Math.abs(stops[i].l - 50) / 50);
    if (score > maxSat) {
      maxSat = score;
      peakIndex = i;
    }
  }

  return { stops, peak: stops[peakIndex], peakIndex };
}
