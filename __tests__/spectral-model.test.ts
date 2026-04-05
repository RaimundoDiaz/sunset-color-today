import { describe, it, expect } from "vitest";
import { rayleighOD, computeSpectrum, spectrumToRGB } from "@/lib/spectral-model";

describe("rayleighOD", () => {
  it("higher OD for shorter wavelengths (1/λ⁴)", () => {
    expect(rayleighOD(380, 1013)).toBeGreaterThan(rayleighOD(700, 1013));
  });

  it("blue scatters ~5-6x more than red", () => {
    const ratio = rayleighOD(450, 1013) / rayleighOD(700, 1013);
    expect(ratio).toBeGreaterThan(4);
    expect(ratio).toBeLessThan(8);
  });

  it("scales linearly with pressure", () => {
    const full = rayleighOD(550, 1013);
    const half = rayleighOD(550, 506.5);
    expect(half).toBeCloseTo(full / 2, 4);
  });

  it("at 550nm sea level is ~0.097", () => {
    expect(rayleighOD(550, 1013)).toBeCloseTo(0.097, 2);
  });
});

describe("computeSpectrum", () => {
  it("returns 19 elements", () => {
    const s = computeSpectrum(1, 1013, 0.15, 1.3, 300, 0);
    expect(s).toHaveLength(19);
  });

  it("all values between 0 and 1", () => {
    const s = computeSpectrum(20, 1013, 0.15, 1.3, 300, 1);
    for (const v of s) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    }
  });

  it("at AM=1 most wavelengths have high transmission", () => {
    const s = computeSpectrum(1, 1013, 0, 1.3, 300, 0);
    // At 600nm with clean air and AM=1, ozone Chappuis absorbs ~4%
    expect(s[11]).toBeGreaterThan(0.8); // index 11 = 600nm
  });

  it("at AM=38 blue is essentially zero", () => {
    const s = computeSpectrum(38, 1013, 0, 1.3, 300, 0);
    // 380nm and 400nm should be near zero
    expect(s[0]).toBeLessThan(0.001);
    expect(s[1]).toBeLessThan(0.001);
    // 700nm should still have noticeable transmission
    expect(s[16]).toBeGreaterThan(0.1);
  });

  it("higher AOD reduces all transmissions", () => {
    const clean = computeSpectrum(20, 1013, 0.05, 1.3, 300, 0);
    const dirty = computeSpectrum(20, 1013, 0.5, 1.3, 300, 0);
    for (let i = 0; i < 19; i++) {
      expect(dirty[i]).toBeLessThanOrEqual(clean[i]);
    }
  });

  it("water vapor absorbs at 720-740nm", () => {
    const dry = computeSpectrum(20, 1013, 0.15, 1.3, 300, 0);
    const wet = computeSpectrum(20, 1013, 0.15, 1.3, 300, 5); // 5cm PW = very humid
    // 740nm (index 18) should show more absorption with water vapor
    expect(wet[18]).toBeLessThan(dry[18]);
    // 500nm (index 6) should be unchanged (no H2O absorption there)
    expect(wet[6]).toBeCloseTo(dry[6], 6);
  });
});

describe("spectrumToRGB", () => {
  it("sunset spectrum (AM=30 clean) produces warm orange-red", () => {
    const s = computeSpectrum(30, 1013, 0.1, 1.3, 300, 1);
    const rgb = spectrumToRGB(s);
    expect(rgb.r).toBeGreaterThan(200);
    expect(rgb.r).toBeGreaterThan(rgb.g);
    expect(rgb.r).toBeGreaterThan(rgb.b);
  });

  it("returns values in 0-255 range", () => {
    const s = computeSpectrum(20, 1013, 0.15, 1.3, 300, 1);
    const rgb = spectrumToRGB(s);
    for (const c of [rgb.r, rgb.g, rgb.b]) {
      expect(c).toBeGreaterThanOrEqual(0);
      expect(c).toBeLessThanOrEqual(255);
    }
  });

  it("heavily polluted sunset is deep red", () => {
    const s = computeSpectrum(25, 1013, 0.4, 0.8, 300, 2);
    const rgb = spectrumToRGB(s);
    expect(rgb.r).toBe(255); // max channel after normalization
    expect(rgb.g).toBeLessThan(80);
  });
});
