import { describe, it, expect } from "vitest";
import {
  estimateAngstrom,
  estimateOzoneDU,
  hygroscopicGrowth,
  effectiveSunsetAM,
} from "@/lib/atmosphere";

describe("estimateAngstrom", () => {
  it("returns 1.3 when pm10 is zero", () => {
    expect(estimateAngstrom(5, 0)).toBe(1.3);
  });
  it("higher for fine-dominated (high PM2.5/PM10 ratio)", () => {
    expect(estimateAngstrom(20, 25)).toBeGreaterThan(estimateAngstrom(5, 25));
  });
  it("clamped between 0 and 2.2", () => {
    const v = estimateAngstrom(100, 100);
    expect(v).toBeGreaterThanOrEqual(0);
    expect(v).toBeLessThanOrEqual(2.2);
  });
});

describe("estimateOzoneDU", () => {
  it("high latitude gets higher ozone", () => {
    expect(estimateOzoneDU(5, 55)).toBeGreaterThan(estimateOzoneDU(5, 10));
  });
  it("high UV reduces estimate", () => {
    expect(estimateOzoneDU(12, 40)).toBeLessThan(estimateOzoneDU(5, 40));
  });
  it("returns 200-450 range", () => {
    const v = estimateOzoneDU(5, 30);
    expect(v).toBeGreaterThanOrEqual(200);
    expect(v).toBeLessThanOrEqual(450);
  });
});

describe("hygroscopicGrowth", () => {
  it("returns 1 at 0% RH", () => {
    expect(hygroscopicGrowth(0)).toBeCloseTo(1, 2);
  });
  it("~2.2 at 80% RH", () => {
    expect(hygroscopicGrowth(80)).toBeCloseTo(2.24, 1);
  });
  it("~3.2 at 90% RH", () => {
    expect(hygroscopicGrowth(90)).toBeCloseTo(3.16, 1);
  });
  it("caps at 95% (100% same as 95%)", () => {
    expect(hygroscopicGrowth(100)).toBe(hygroscopicGrowth(95));
  });
  it("monotonically increasing", () => {
    expect(hygroscopicGrowth(80)).toBeGreaterThan(hygroscopicGrowth(40));
  });
});

describe("effectiveSunsetAM", () => {
  it("clear sky returns ~30", () => {
    expect(effectiveSunsetAM(0, 0)).toBeCloseTo(30, 0);
  });
  it("full high clouds returns ~18", () => {
    expect(effectiveSunsetAM(100, 0)).toBeCloseTo(18, 0);
  });
  it("mid clouds contribute half weight", () => {
    const a = effectiveSunsetAM(0, 100);
    const b = effectiveSunsetAM(50, 0);
    expect(a).toBeCloseTo(b, 0);
  });
});
