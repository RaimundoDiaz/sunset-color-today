// Visible spectrum sampled every 20nm (nm)
export const WL = [380,400,420,440,460,480,500,520,540,560,580,600,620,640,660,680,700,720,740] as const;

// CIE 1931 2° standard observer color matching functions (x̄, ȳ, z̄)
export const CIE_X = [0.0014,0.0143,0.1344,0.3483,0.2908,0.0956,0.0049,0.0633,0.2904,0.5945,0.9163,1.0622,0.8544,0.4479,0.1649,0.0468,0.0114,0.0025,0.0005] as const;
export const CIE_Y = [0.0000,0.0004,0.0040,0.0230,0.0600,0.1390,0.3230,0.7100,0.9540,0.9950,0.8700,0.6310,0.3810,0.1750,0.0610,0.0170,0.0041,0.0010,0.0002] as const;
export const CIE_Z = [0.0065,0.0679,0.6456,1.7471,1.6692,0.8130,0.2720,0.0782,0.0203,0.0039,0.0017,0.0008,0.0002,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000] as const;

// Solar spectral irradiance (5778K blackbody, Planck function, normalized)
export const SOLAR = [0.82,0.88,0.93,0.96,0.98,1.00,1.00,1.00,0.99,0.97,0.96,0.93,0.91,0.88,0.85,0.82,0.79,0.76,0.73] as const;

// Ozone Chappuis band absorption cross-sections (×10⁻²¹ cm²)
// Data from Bogumil et al. (2003) at 293K, sampled at WL
export const O3_XS = [0.00,0.00,0.05,0.15,0.35,0.60,2.05,3.20,3.98,4.60,4.82,5.01,3.61,2.00,1.00,0.40,0.15,0.05,0.02] as const;

// Water vapor absorption coefficients (cm⁻¹ per cm precipitable water)
// From HITRAN line-by-line, convolved to 20nm. Only significant at 700nm+.
// Usage: τ_H2O(λ) = H2O_K[i] × PW_cm × AM   where PW_cm = TQV(kg/m²) / 10
export const H2O_K = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0.0005, 0.002, 0.008] as const;
