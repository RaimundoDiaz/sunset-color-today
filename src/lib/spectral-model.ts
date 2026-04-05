import { WL, CIE_X, CIE_Y, CIE_Z, SOLAR, O3_XS, H2O_K } from "@/constants/spectral-data";
import { clamp } from "./color-utils";

/**
 * Rayleigh optical depth at sea level — Bucholtz (1995)
 *   τ_R(λ) = 0.008569 λ⁻⁴ (1 + 0.0113 λ⁻² + 0.00013 λ⁻⁴)   [λ in μm]
 *   Pressure correction: τ × P/1013.25
 */
export function rayleighOD(lam_nm: number, P_hPa: number): number {
  const l = lam_nm / 1000;
  const l2 = l * l, l4 = l2 * l2;
  return (0.008569 / l4) * (1 + 0.0113 / l2 + 0.00013 / l4) * (P_hPa / 1013.25);
}

/**
 * Compute transmitted solar spectrum through atmosphere (Beer-Lambert)
 *   I(λ) = I₀(λ) × exp(-(τ_Rayleigh + τ_Aerosol + τ_Ozone + τ_H2O) × AM)
 */
export function computeSpectrum(
  AM: number,
  P_hPa: number,
  aod550: number,
  angstrom: number,
  ozoneDU: number,
  pwCm: number,
): number[] {
  const ozCol = 8.06e18 * (ozoneDU / 300);
  const pw = pwCm || 0;
  return WL.map((lam, i) => {
    const tR = rayleighOD(lam, P_hPa);
    const tA = aod550 * Math.pow(lam / 550, -angstrom);
    const tO3 = O3_XS[i] * 1e-21 * ozCol;
    const tH2O = H2O_K[i] * pw;
    return SOLAR[i] * Math.exp(-(tR + tA + tO3 + tH2O) * AM);
  });
}

/**
 * Convert spectral power distribution to sRGB via CIE 1931 XYZ
 */
export function spectrumToRGB(spectrum: number[]): { r: number; g: number; b: number } {
  let X = 0, Y = 0, Z = 0;
  for (let i = 0; i < WL.length; i++) {
    const w = spectrum[i] * 20; // dλ = 20nm
    X += w * CIE_X[i];
    Y += w * CIE_Y[i];
    Z += w * CIE_Z[i];
  }
  // XYZ → linear sRGB (D65 illuminant)
  let r =  3.2406 * X - 1.5372 * Y - 0.4986 * Z;
  let g = -0.9689 * X + 1.8758 * Y + 0.0415 * Z;
  let b =  0.0557 * X - 0.2040 * Y + 1.0570 * Z;

  // Normalize to preserve chromaticity
  const mx = Math.max(r, g, b, 1e-10);
  r = Math.max(0, r / mx);
  g = Math.max(0, g / mx);
  b = Math.max(0, b / mx);

  // sRGB gamma correction
  const gamma = (c: number) =>
    c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;

  return {
    r: Math.round(clamp(gamma(r) * 255, 0, 255)),
    g: Math.round(clamp(gamma(g) * 255, 0, 255)),
    b: Math.round(clamp(gamma(b) * 255, 0, 255)),
  };
}
