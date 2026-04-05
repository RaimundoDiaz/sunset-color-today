import type { AtmosphericData, SkyPhase } from "@/types";
import { type Locale, t as tr } from "@/constants/translations";
import { clamp, lerp, rgbToHSL } from "./color-utils";
import { computeSpectrum, spectrumToRGB } from "./spectral-model";
import { airMassFromElevation } from "./solar";

/**
 * Compute real-time sky color from current sun elevation and atmospheric data.
 * 5 regimes: daytime, golden hour, civil twilight, nautical/astronomical, night.
 */
export function liveSkyColor(
  elev: number,
  atm: Partial<AtmosphericData>,
): { h: number; s: number; l: number } {
  const P = atm.pressure || 1013;
  const aod = atm.effectiveAOD || 0.15;
  const ang = atm.effectiveAngstrom || 1.3;
  const oz = atm.ozoneDU || 300;
  const cloud = atm.totalCloud || 0;
  const pw = (atm.columnWV || 18) / 10;

  if (elev > 20) {
    // Daytime blue sky
    const w = clamp((30 - elev) / 30, 0, 1);
    let h = 210 - w * 12, s = 52 + w * 15, l = 58 + w * 4;
    if (cloud > 80) { s -= 30; l += 5; }
    else if (cloud > 50) { s -= 12; }
    if (aod > 0.3) { s -= 15; l += 8; }
    return { h, s: clamp(s, 5, 100), l: clamp(l, 20, 80) };
  }

  if (elev > 0) {
    // Golden hour: blend from blue to spectral sunset
    const am = clamp(airMassFromElevation(elev), 1, 40);
    const spectrum = computeSpectrum(am, P, aod, ang, oz, pw);
    const rgb = spectrumToRGB(spectrum);
    const hsl = rgbToHSL(rgb.r, rgb.g, rgb.b);

    const t = clamp((20 - elev) / 20, 0, 1);
    let dayH = 205, targetH = hsl.h;
    if (targetH < 60 && dayH > 180) targetH += 360;
    let h = lerp(dayH, targetH, t * t);
    h = ((h % 360) + 360) % 360;
    let s = lerp(55, clamp(hsl.s, 50, 100), t);
    let l = lerp(58, 55, t);
    if (cloud > 85) { s *= 0.3; l = 42; }
    return { h, s: clamp(s, 5, 100), l: clamp(l, 20, 80) };
  }

  if (elev > -6) {
    // Civil twilight
    const t = clamp(-elev / 6, 0, 1);
    const spectrum = computeSpectrum(38, P, aod, ang, oz, pw);
    const rgb = spectrumToRGB(spectrum);
    const hsl = rgbToHSL(rgb.r, rgb.g, rgb.b);

    let sunsetH = hsl.h;
    if (sunsetH < 60) sunsetH += 360;
    let h = lerp(sunsetH, 250, t);
    h = ((h % 360) + 360) % 360;
    return {
      h,
      s: clamp(lerp(hsl.s, 20, t), 5, 100),
      l: clamp(lerp(50, 22, t), 10, 80),
    };
  }

  if (elev > -18) {
    // Nautical / astronomical twilight
    const t = clamp((-elev - 6) / 12, 0, 1);
    return { h: 235, s: clamp(22 - t * 16, 5, 100), l: clamp(20 - t * 10, 10, 80) };
  }

  // Night
  return { h: 235, s: 8, l: 10 };
}

export function getSkyPhase(elev: number): SkyPhase {
  return getSkyPhaseI18n(elev, "en");
}

export function getSkyPhaseI18n(elev: number, locale: Locale): SkyPhase {
  if (elev > 20) return { name: tr(locale, "phaseDay"), desc: tr(locale, "phaseDayDesc"), icon: "\u2600\uFE0F" };
  if (elev > 6) return { name: tr(locale, "phaseAfternoon"), desc: tr(locale, "phaseAfternoonDesc"), icon: "\uD83C\uDF24\uFE0F" };
  if (elev > 0) return { name: tr(locale, "phaseGoldenHour"), desc: tr(locale, "phaseGoldenHourDesc"), icon: "\uD83C\uDF1E" };
  if (elev > -0.83) return { name: tr(locale, "phaseSunset"), desc: tr(locale, "phaseSunsetDesc"), icon: "\uD83C\uDF05" };
  if (elev > -6) return { name: tr(locale, "phaseCivilTwilight"), desc: tr(locale, "phaseCivilTwilightDesc"), icon: "\uD83C\uDF06" };
  if (elev > -12) return { name: tr(locale, "phaseNauticalTwilight"), desc: tr(locale, "phaseNauticalTwilightDesc"), icon: "\uD83C\uDF03" };
  if (elev > -18) return { name: tr(locale, "phaseAstroTwilight"), desc: tr(locale, "phaseAstroTwilightDesc"), icon: "\uD83C\uDF0C" };
  return { name: tr(locale, "phaseNight"), desc: tr(locale, "phaseNightDesc"), icon: "\uD83C\uDF19" };
}
