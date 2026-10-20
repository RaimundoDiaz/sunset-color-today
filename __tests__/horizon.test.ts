import { describe, it, expect } from "vitest";
import { sunsetAzimuth, destinationPoint, horizonPoints, horizonGap } from "@/lib/horizon";

const clear = { cloudLow: 0, cloudMid: 0, weatherCode: 0 };

describe("sunsetAzimuth", () => {
  it("sets due west at the equinox (within the declination approximation)", () => {
    expect(Math.abs(sunsetAzimuth(0, new Date(2026, 2, 20)) - 270)).toBeLessThan(1.5);
  });

  it("sets south of west in southern spring (Santiago, October)", () => {
    const az = sunsetAzimuth(-33.45, new Date(2026, 9, 8));
    expect(az).toBeGreaterThan(255);
    expect(az).toBeLessThan(268);
  });

  it("sets north of west in northern summer", () => {
    expect(sunsetAzimuth(40, new Date(2026, 5, 21))).toBeGreaterThan(295);
  });
});

describe("destinationPoint", () => {
  it("moves ~111 km per degree of latitude going north", () => {
    const p = destinationPoint(0, 0, 0, 111.2);
    expect(p.lat).toBeCloseTo(1, 1);
    expect(p.lon).toBeCloseTo(0, 5);
  });

  it("wraps longitude across the antimeridian", () => {
    const p = destinationPoint(0, 179.9, 90, 50);
    expect(p.lon).toBeLessThan(-179);
  });
});

describe("horizonPoints", () => {
  it("returns points west of the observer at sunset", () => {
    const pts = horizonPoints(-33.45, -70.67, new Date(2026, 9, 8));
    expect(pts).toHaveLength(3);
    for (const p of pts) expect(p.lon).toBeLessThan(-70.67);
  });
});

describe("horizonGap", () => {
  it("is 1 for a clear horizon", () => {
    expect(horizonGap([clear, clear, clear])).toBe(1);
  });

  it("is 0 for a fully blocked horizon", () => {
    const low = { cloudLow: 100, cloudMid: 0, weatherCode: 3 };
    expect(horizonGap([low, low, low])).toBe(0);
  });

  it("weighs mid cloud less than low cloud", () => {
    const low = { ...clear, cloudLow: 60 };
    const mid = { ...clear, cloudMid: 60 };
    expect(horizonGap([mid, mid, mid])).toBeGreaterThan(horizonGap([low, low, low]));
  });

  it("treats rain as mostly blocking even without cloud data", () => {
    const rain = { ...clear, weatherCode: 63 };
    expect(horizonGap([rain, rain, rain])).toBeLessThan(0.3);
  });

  it("returns 0 when samples are missing", () => {
    expect(horizonGap([clear])).toBe(0);
  });
});
