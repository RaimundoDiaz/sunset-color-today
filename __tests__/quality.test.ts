import { describe, it, expect } from "vitest";
import { calculateQuality } from "@/lib/quality";

const base = {
  effectiveAOD: 0.15,
  cloudHigh: 0,
  cloudLow: 0,
  totalCloud: 0,
  humidity: 40,
  visKm: 20,
  isRaining: false,
  weatherCode: 0,
  aod: 0.1,
};

describe("calculateQuality", () => {
  it("returns 0-100 range", () => {
    const q = calculateQuality(base);
    expect(q).toBeGreaterThanOrEqual(0);
    expect(q).toBeLessThanOrEqual(100);
  });

  it("ideal conditions: high score", () => {
    const q = calculateQuality({
      ...base,
      effectiveAOD: 0.05,
      cloudHigh: 50,
      visKm: 30,
      aod: 0.05,
    });
    expect(q).toBeGreaterThanOrEqual(75);
  });

  it("rain kills score", () => {
    const q = calculateQuality({ ...base, isRaining: true, weatherCode: 63 });
    expect(q).toBeLessThanOrEqual(30);
  });

  it("total overcast is poor", () => {
    const q = calculateQuality({ ...base, totalCloud: 95, cloudLow: 80 });
    expect(q).toBeLessThan(35);
  });

  it("post-rain bonus applies", () => {
    const withBonus = calculateQuality({
      ...base,
      weatherCode: 1,
      visKm: 25,
      aod: 0.05,
      cloudHigh: 20,
    });
    const without = calculateQuality({
      ...base,
      weatherCode: 1,
      visKm: 25,
      aod: 0.2,
      cloudHigh: 20,
    });
    expect(withBonus).toBeGreaterThan(without);
  });

  it("high humidity penalizes", () => {
    const dry = calculateQuality({ ...base, humidity: 30 });
    const humid = calculateQuality({ ...base, humidity: 80 });
    expect(dry).toBeGreaterThan(humid);
  });

  it("low visibility penalizes", () => {
    const clear = calculateQuality({ ...base, visKm: 30 });
    const hazy = calculateQuality({ ...base, visKm: 3 });
    expect(clear).toBeGreaterThan(hazy);
  });
});
