/**
 * Simplified single-scattering sky radiance model (Nishita-inspired).
 *
 * Instead of computing the direct beam color (Beer-Lambert),
 * this calculates the light SCATTERED toward the observer from
 * the atmosphere — which is what a human actually sees at sunset.
 *
 * For each sample point along the viewing ray:
 *   L(λ) += β_scat(λ,h) × P(Θ) × I_sun(λ) × exp(-τ_sun) × exp(-τ_obs) × ds
 */

import { WL, SOLAR, O3_XS, H2O_K } from "@/constants/spectral-data";
import { rayleighOD } from "./spectral-model";
import { clamp } from "./color-utils";

const R_EARTH = 6371000; // meters
const H_RAYLEIGH = 8500;  // Rayleigh scale height (m)
const H_MIE = 1200;       // Mie/aerosol scale height (m)
const NUM_SAMPLES = 16;
const MAX_DISTANCE = 300000; // 300 km ray length

// Pre-computed sea-level Rayleigh scattering coefficients (m⁻¹)
// β_R(λ) = rayleighOD(λ, 1013) / H_RAYLEIGH  (total OD / scale height)
function betaRayleighSea(lam_nm: number): number {
  return rayleighOD(lam_nm, 1013) / (H_RAYLEIGH / 1000); // convert to per-km then back
}

// Rayleigh phase function: P(θ) = (3/16π)(1 + cos²θ)
function rayleighPhase(cosTheta: number): number {
  return (3 / (16 * Math.PI)) * (1 + cosTheta * cosTheta);
}

// Henyey-Greenstein phase function for Mie: P(θ) = (1-g²) / (4π(1+g²-2g·cosθ)^1.5)
function miePhase(cosTheta: number, g = 0.76): number {
  const g2 = g * g;
  const denom = 1 + g2 - 2 * g * cosTheta;
  return (1 - g2) / (4 * Math.PI * Math.pow(denom, 1.5));
}

// Height at distance d along a ray at elevation θ from the surface
function heightAtDistance(d: number, elevRad: number): number {
  // Account for Earth's curvature
  return d * Math.sin(elevRad) + (d * d) / (2 * R_EARTH);
}

/**
 * Compute scattered sky color at a given viewing direction.
 *
 * @param sunElevDeg  Sun elevation angle (degrees, 0 = horizon)
 * @param viewElevDeg Viewing elevation (degrees above horizon, e.g. 5-10)
 * @param viewAzDeg   Azimuth from sun direction (0 = looking at sun, 90 = perpendicular)
 * @param P_hPa       Surface pressure
 * @param aod550      Aerosol optical depth at 550nm
 * @param angstrom    Ångström exponent
 * @param ozoneDU     Ozone column (Dobson Units)
 * @param pwCm        Precipitable water (cm)
 * @returns Spectrum array (19 wavelengths) of scattered radiance
 */
export function computeScatteredSpectrum(
  sunElevDeg: number,
  viewElevDeg: number,
  viewAzDeg: number,
  P_hPa: number,
  aod550: number,
  angstrom: number,
  ozoneDU: number,
  pwCm: number,
): number[] {
  const sunElev = (sunElevDeg * Math.PI) / 180;
  const viewElev = (viewElevDeg * Math.PI) / 180;
  const viewAz = (viewAzDeg * Math.PI) / 180;

  // Scattering angle between sun and view direction
  const cosTheta =
    Math.sin(sunElev) * Math.sin(viewElev) +
    Math.cos(sunElev) * Math.cos(viewElev) * Math.cos(viewAz);

  const phaseR = rayleighPhase(cosTheta);
  const phaseM = miePhase(cosTheta);

  const stepSize = MAX_DISTANCE / NUM_SAMPLES;
  const ozColumn = 8.06e18 * (ozoneDU / 300);

  // Accumulate scattered radiance at each wavelength
  const radiance = new Array(WL.length).fill(0);

  // Running optical depth from observer to current sample point
  const tauObs = new Array(WL.length).fill(0);

  for (let i = 0; i < NUM_SAMPLES; i++) {
    const d = (i + 0.5) * stepSize;
    const h = heightAtDistance(d, viewElev);
    if (h > 80000) break; // above atmosphere

    // Density at height h
    const densityR = Math.exp(-h / H_RAYLEIGH);
    const densityM = Math.exp(-h / H_MIE);

    // Pressure at height (for Rayleigh OD scaling)
    const P_h = P_hPa * Math.exp(-h / 8500);

    // Sun's air mass as seen from height h
    // Sun appears higher from altitude h: effective elevation += arctan(h / distance_to_horizon)
    const effectiveSunElev = sunElevDeg + (h / R_EARTH) * (180 / Math.PI);
    const z = 90 - effectiveSunElev;
    let amSun: number;
    if (z >= 91.5) amSun = 40;
    else if (z <= 0) amSun = 1;
    else amSun = 1 / (Math.cos((z * Math.PI) / 180) + 0.50572 * Math.pow(96.07995 - z, -1.6364));

    for (let w = 0; w < WL.length; w++) {
      const lam = WL[w];

      // Scattering coefficients at this height (per meter)
      const betaR = (rayleighOD(lam, P_hPa) / (H_RAYLEIGH)) * densityR;
      const betaM = (aod550 * Math.pow(lam / 550, -angstrom) / H_MIE) * densityM;

      // Extinction coefficients (scattering + absorption)
      const extR = betaR;
      const extM = betaM;

      // Optical depth from sun to this point
      const tauR_sun = rayleighOD(lam, P_h) * amSun;
      const tauM_sun = aod550 * Math.pow(lam / 550, -angstrom) * amSun * densityM;
      const tauO3_sun = O3_XS[w] * 1e-21 * ozColumn * amSun;
      const tauH2O_sun = H2O_K[w] * pwCm * amSun;
      const tauSun = tauR_sun + tauM_sun + tauO3_sun + tauH2O_sun;

      // Sunlight reaching this point
      const sunIntensity = SOLAR[w] * Math.exp(-tauSun);

      // In-scattered radiance
      const scattered = (betaR * phaseR + betaM * phaseM) * sunIntensity * Math.exp(-tauObs[w]) * stepSize;
      radiance[w] += scattered;

      // Accumulate optical depth from observer to next point
      tauObs[w] += (extR + extM) * stepSize;
    }
  }

  return radiance;
}

/**
 * Compute a sunset color timeline — colors at multiple sun elevations.
 * Returns array from highest to lowest sun position.
 */
export function computeSunsetTimeline(
  P_hPa: number,
  aod550: number,
  angstrom: number,
  ozoneDU: number,
  pwCm: number,
  steps = 12,
): { elevation: number; spectrum: number[] }[] {
  const elevations: number[] = [];
  // From 8° to -6° in even steps
  for (let i = 0; i < steps; i++) {
    elevations.push(8 - (i * 14) / (steps - 1));
  }

  return elevations.map((elev) => ({
    elevation: elev,
    spectrum: computeScatteredSpectrum(
      elev,
      clamp(elev + 5, 2, 20), // view slightly above sun
      5, // 5° off center (not staring at sun disk)
      P_hPa,
      aod550,
      angstrom,
      ozoneDU,
      pwCm,
    ),
  }));
}
