import { wmoLabel, RAIN_CODES } from "@/constants/wmo-codes";
import { t as tr, type Locale } from "@/constants/translations";
import { clamp, hslToRgb, rgbToHex, rgbToHSL } from "./color-utils";
import { spectrumToRGB } from "./spectral-model";
import { computeScatteredSpectrum } from "./sky-scattering";
import { buildSunsetTimeline, type SunsetTimelineResult } from "./sunset-timeline";
import { estimateAngstrom, estimateOzoneDU, hygroscopicGrowth } from "./atmosphere";
import { calculateQuality } from "./quality";
import { getSunsetHourIndex, airAtSunset, extractPowerOzone, extractPowerWaterVapor } from "@/api/extract";
import type { SunsetResult } from "@/types";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function calculateSunsetColor(
  weather: any,
  air: any | null,
  power: any | null,
  ecmwf: any | null,
  lat: number,
  lon: number,
  locale: Locale = "en",
): SunsetResult {
  const hourly = weather.hourly;
  const daily = weather.daily;
  const sunsetIso = daily.sunset[0];
  const idx = getSunsetHourIndex(hourly.time, sunsetIso);

  // ── 1. Extract variables at sunset hour ──
  const cloudLow    = hourly.cloud_cover_low?.[idx]  ?? 0;
  const cloudMid    = hourly.cloud_cover_mid?.[idx]  ?? 0;
  const cloudHigh   = hourly.cloud_cover_high?.[idx] ?? 0;
  const totalCloud  = hourly.cloud_cover?.[idx]      ?? weather.current.cloud_cover ?? 0;
  const humidity    = hourly.relative_humidity_2m?.[idx] ?? weather.current.relative_humidity_2m ?? 40;
  const visibility  = hourly.visibility?.[idx]       ?? weather.current.visibility ?? 24140;
  const temp        = hourly.temperature_2m?.[idx]   ?? weather.current.temperature_2m ?? 20;
  const dewpoint    = hourly.dew_point_2m?.[idx]     ?? weather.current.dew_point_2m ?? 10;
  const pressure    = hourly.pressure_msl?.[idx]     ?? weather.current.pressure_msl ?? 1013;
  const weatherCode = hourly.weather_code?.[idx]     ?? weather.current.weather_code ?? 0;
  const windSpeed   = hourly.wind_speed_10m?.[idx]   ?? weather.current.wind_speed_10m ?? 0;
  const uvMax       = daily.uv_index_max?.[0]        ?? 5;
  const preIdx      = Math.max(0, idx - 2);
  const directRad   = hourly.direct_radiation?.[preIdx]  ?? null;
  const diffuseRad  = hourly.diffuse_radiation?.[preIdx] ?? null;
  const aq = airAtSunset(air, idx);
  const factors: string[] = [];

  // ── 2. Atmospheric parameters ──
  const rawAngstrom = estimateAngstrom(aq.pm25, aq.pm10);
  const growth = hygroscopicGrowth(humidity);
  let effectiveAOD = aq.aod * growth;
  const rhN = Math.min(humidity, 95) / 100;
  let effectiveAngstrom = rawAngstrom * (1 - 0.4 * rhN * rhN);
  const visKm = visibility / 1000;

  if (visKm > 0 && visKm < 50) {
    effectiveAOD = Math.max(effectiveAOD, (3.912 / visKm) * 0.8 * 0.12);
  }
  if (directRad !== null && diffuseRad !== null && (directRad + diffuseRad) > 50) {
    const dr = diffuseRad / (directRad + diffuseRad);
    if (dr > 0.65) {
      const hb = (dr - 0.65) / 0.35;
      effectiveAOD = Math.max(effectiveAOD, 0.2 + hb * 0.5);
      effectiveAngstrom *= (1 - hb * 0.3);
    }
  }

  // Column water vapor cross-check
  const ecmwfWV = ecmwf?.hourly?.total_column_integrated_water_vapour?.[idx] ?? null;
  const colWV = ecmwfWV ?? extractPowerWaterVapor(power) ?? null;
  if (colWV !== null) {
    const expectedWV = humidity * 0.5;
    if (colWV > expectedWV * 1.3) {
      const extra = clamp((colWV - expectedWV) / expectedWV, 0, 1);
      effectiveAOD *= (1 + extra * 0.2);
      effectiveAngstrom *= (1 - extra * 0.15);
    }
  }

  effectiveAOD = clamp(effectiveAOD, 0, 3);
  effectiveAngstrom = clamp(effectiveAngstrom, 0, 2.2);

  // Ozone: real data > estimate
  const realOzone = extractPowerOzone(power);
  let ozoneDU: number, ozoneSource: string;
  if (realOzone) {
    ozoneDU = realOzone;
    ozoneSource = "NASA POWER/GMAO";
  } else {
    ozoneDU = estimateOzoneDU(uvMax, Math.abs(lat));
    ozoneSource = locale === "es" ? "estimado" : "estimated";
  }

  const columnWV = ecmwfWV ?? extractPowerWaterVapor(power) ?? (humidity * 0.45);
  const pwCm = columnWV / 10;

  // ── 3. Can the observer actually SEE the sunset? ──
  // This determines if scattering colors reach the eyes or if everything is gray.
  const isRaining = RAIN_CODES.includes(weatherCode as typeof RAIN_CODES[number]);

  // Sunset visibility score: 0 = invisible (gray), 1 = fully visible (vivid)
  let sunsetVisibility = 1.0;

  // Rain/fog = can't see sunset at all
  if (isRaining) sunsetVisibility = 0;

  // Low clouds block the horizon (most important blocker)
  if (cloudLow > 20) sunsetVisibility *= clamp(1 - (cloudLow - 20) / 50, 0, 1);

  // Heavy total overcast dims everything
  if (totalCloud > 70) sunsetVisibility *= clamp(1 - (totalCloud - 70) / 25, 0.05, 1);

  // Very low visibility = can't see far enough
  if (visKm < 8) sunsetVisibility *= clamp(visKm / 8, 0.1, 1);

  // Heavy aerosols make sunset brownish/gray even without clouds
  if (effectiveAOD > 0.3) sunsetVisibility *= clamp(1 - (effectiveAOD - 0.3) / 0.7, 0.15, 1);

  // High humidity washes out colors significantly
  if (humidity > 65) sunsetVisibility *= clamp(1 - (humidity - 65) / 35, 0.3, 1);

  sunsetVisibility = clamp(sunsetVisibility, 0, 1);

  // ── 3b. Quality score (computed early to enforce consistency) ──
  const quality = calculateQuality({
    effectiveAOD, cloudHigh, cloudLow, totalCloud, humidity,
    visKm, isRaining, weatherCode, aod: aq.aod,
  });

  // Quality and visibility MUST be consistent:
  // If quality says "Poor" (< 20), you can't have vivid orange.
  // Quality 0-20 → max visibility 0-0.33
  // Quality 20-50 → max visibility 0.33-0.83
  // Quality 50+ → no cap
  const qualityCap = quality < 50 ? quality / 60 : 1.0;
  sunsetVisibility = Math.min(sunsetVisibility, qualityCap);

  // ── 4. Compute the "ideal" sunset color from scattering ──
  const sunElevAtSunset = 1.0;
  const spectrum = computeScatteredSpectrum(
    sunElevAtSunset, 8, 5,
    pressure, effectiveAOD, effectiveAngstrom, ozoneDU, pwCm,
  );
  const baseRGB = spectrumToRGB(spectrum);
  const baseHSL = rgbToHSL(baseRGB.r, baseRGB.g, baseRGB.b);

  // Ideal sunset hue from scattering
  let idealH = baseHSL.h;

  // AOD shifts the ideal hue
  let idealS: number;
  if (effectiveAOD < 0.1) {
    idealS = 88;
  } else if (effectiveAOD < 0.4) {
    idealS = 88 + (effectiveAOD / 0.4) * 8;
    idealH -= (effectiveAOD / 0.4) * 8;
  } else {
    const mieWash = clamp((effectiveAOD - 0.4) / 0.6, 0, 1);
    idealS = 88 - mieWash * 55;
    idealH += mieWash * 20;
  }

  // Humidity reduces ideal saturation
  const humFactor = humidity / 100;
  idealS -= humFactor * 18;
  idealS += (1 - humFactor) * 5;

  const idealL = 55;

  // ── 5. Blend between ideal sunset and "gray sky" based on visibility ──
  // Gray overcast sky: h=220 (steel blue-gray), s=8, l=45
  const grayH = 220, grayS = 8, grayL = 45;
  const v = sunsetVisibility;

  let h = v > 0.05 ? idealH * v + grayH * (1 - v) : grayH;
  // Handle hue wrapping for blend
  if (Math.abs(idealH - grayH) > 180 && v > 0.05) {
    const adjIdeal = idealH < 180 ? idealH + 360 : idealH;
    h = adjIdeal * v + grayH * (1 - v);
    h = ((h % 360) + 360) % 360;
  }
  let s = idealS * v + grayS * (1 - v);
  let l = idealL * v + grayL * (1 - v);

  // ── 5b. Sunset timeline (apply visibility blend to match reality) ──
  const rawTimeline = buildSunsetTimeline(pressure, effectiveAOD, effectiveAngstrom, ozoneDU, pwCm);
  // Blend each timeline stop with gray using the same visibility factor
  const grayRGB = { r: 160, g: 163, b: 168 }; // steel gray
  const blendedStops = rawTimeline.stops.map((stop) => {
    const br = Math.round(stop.r * v + grayRGB.r * (1 - v));
    const bg = Math.round(stop.g * v + grayRGB.g * (1 - v));
    const bb = Math.round(stop.b * v + grayRGB.b * (1 - v));
    const bHex = rgbToHex(br, bg, bb);
    const bHsl = rgbToHSL(br, bg, bb);
    return { ...stop, r: br, g: bg, b: bb, hex: bHex, h: bHsl.h, s: bHsl.s, l: bHsl.l };
  });
  // Recompute peak from blended stops
  let peakIdx = 0, maxScore = 0;
  for (let i = 0; i < blendedStops.length; i++) {
    const score = blendedStops[i].s * (1 - Math.abs(blendedStops[i].l - 50) / 50);
    if (score > maxScore) { maxScore = score; peakIdx = i; }
  }
  const timelineResult = { stops: blendedStops, peak: blendedStops[peakIdx], peakIndex: peakIdx };

  // ── 6. Explanation factors ──
  // Visibility summary
  if (sunsetVisibility < 0.05) {
    if (isRaining) {
      factors.push(tr(locale, "factorRain", { condition: wmoLabel(weatherCode, locale) }));
    } else {
      factors.push(tr(locale, "factorSunsetBlockedGeneral"));
    }
  } else if (sunsetVisibility < 0.4) {
    factors.push(tr(locale, "factorSunsetMostlyHidden", { pct: Math.round(sunsetVisibility * 100) }));
  } else if (sunsetVisibility < 0.7) {
    factors.push(tr(locale, "factorSunsetPartlyVisible", { pct: Math.round(sunsetVisibility * 100) }));
  }

  // Aerosol factors (only if sunset is visible enough to matter)
  if (sunsetVisibility > 0.3) {
    if (effectiveAOD < 0.08) factors.push(tr(locale, "factorCleanAir", { aod: aq.aod.toFixed(2) }));
    else if (effectiveAOD < 0.35) {
      factors.push(tr(locale, "factorModerateAerosol", { aod: aq.aod.toFixed(2), effAod: effectiveAOD.toFixed(2) }));
    } else {
      factors.push(tr(locale, "factorHighAerosol", { aod: aq.aod.toFixed(2), effAod: effectiveAOD.toFixed(2) }));
    }
  }

  // Humidity
  if (humidity > 70) {
    let msg = tr(locale, "factorHighHumidity", {
      hum: humidity,
      dew: dewpoint.toFixed(1),
      growth: growth.toFixed(2),
    });
    if (columnWV > humidity * 0.65) msg += tr(locale, "factorHighHumidityWV", { wv: columnWV.toFixed(0) });
    factors.push(msg);
  } else if (humidity < 40) {
    factors.push(tr(locale, "factorLowHumidity", { hum: humidity }));
  }

  // Cloud details
  if (cloudLow > 40) factors.push(tr(locale, "factorLowCloudsHorizon", { pct: cloudLow }));
  if (totalCloud > 80) factors.push(tr(locale, "factorHeavyCloudCover", { pct: totalCloud }));
  else if (cloudHigh >= 30 && cloudHigh <= 70 && cloudLow < 20) {
    factors.push(tr(locale, "factorHighCloudsIdeal", { pct: cloudHigh }));
  } else if (totalCloud < 15) factors.push(tr(locale, "factorClearSky"));

  // High clouds ENHANCE if sunset is visible
  if (sunsetVisibility > 0.5 && cloudHigh >= 20 && cloudHigh <= 70 && cloudLow < 25) {
    const fx = Math.min(cloudHigh / 40, 1) * (1 - Math.max(0, (cloudHigh - 70)) / 30);
    s = clamp(s + fx * 10, 5, 100);
    h -= fx * 4;
  }

  // Temperature
  if (temp > 30) { h -= 2; factors.push(tr(locale, "factorHighTemp", { temp: temp })); }
  if (temp < 5) { h += 2; factors.push(tr(locale, "factorLowTemp", { temp: temp })); }
  if (visKm < 8) factors.push(tr(locale, "factorLowVis", { vis: visKm.toFixed(1) }));

  // Post-rain bonus
  if (!isRaining && weatherCode <= 3 && visKm > 20 && aq.aod < 0.1 && cloudHigh > 15 && cloudLow < 15) {
    s = clamp(s + 8, 5, 100); l += 3;
    factors.push(tr(locale, "factorPostRain"));
  }

  // ── 7. Clamp and convert ──
  h = ((h % 360) + 360) % 360;
  s = clamp(s, 5, 100);
  l = clamp(l, 20, 80);
  const [r, g, b] = hslToRgb(h, s, l);
  const hex = rgbToHex(r, g, b);

  // ── 8. Technical summary ──
  const wvEstimated = locale === "es" ? "estimado" : "estimated";
  const wvSrc = ecmwfWV != null ? "ECMWF" : (extractPowerWaterVapor(power) ? "NASA POWER" : wvEstimated);
  factors.push(
    `${tr(locale, "factorTechnical", {
      am: "0",
      p: pressure.toFixed(0),
      oz: ozoneDU.toFixed(0),
      ozSrc: ozoneSource,
      wv: columnWV.toFixed(1),
      wvSrc,
      alpha: effectiveAngstrom.toFixed(2),
    })} peak=${timelineResult.peak.hex}.`,
  );

  const weatherData = {
    temp, humidity, dewpoint, totalCloud, cloudLow, cloudMid, cloudHigh,
    visibility, aod: aq.aod, effectiveAOD, effectiveAngstrom, pm25: aq.pm25, pm10: aq.pm10,
    dust: aq.dust, weatherCode, windSpeed, pressure, ozoneDU, ozoneSource, columnWV,
    sunsetTime: sunsetIso, sunrise: daily.sunrise[0], AM: 0, quality,
  };

  return {
    h, s, l, r, g, b, hex, factors, weatherData,
    timeline: timelineResult.stops,
    peak: timelineResult.peak,
  };
}
