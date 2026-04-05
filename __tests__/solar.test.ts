import { describe, it, expect } from "vitest";
import { dayOfYear, solarElevation, airMassFromElevation } from "@/lib/solar";

describe("dayOfYear", () => {
  it("Jan 1 = day 1", () => expect(dayOfYear(new Date(2026, 0, 1))).toBe(1));
  it("Dec 31 non-leap = day 365", () => expect(dayOfYear(new Date(2026, 11, 31))).toBe(365));
  it("Mar 1 non-leap = day 60", () => expect(dayOfYear(new Date(2026, 2, 1))).toBe(60));
});

describe("solarElevation", () => {
  it("equator at solar noon on equinox: elevation near 90°", () => {
    // March equinox ~March 20, UTC noon at lon=0
    const d = new Date("2026-03-20T12:00:00Z");
    const elev = solarElevation(0, 0, d);
    expect(elev).toBeGreaterThan(80);
  });

  it("equator at midnight: negative elevation", () => {
    const d = new Date("2026-03-20T00:00:00Z");
    const elev = solarElevation(0, 0, d);
    expect(elev).toBeLessThan(0);
  });

  it("Santiago afternoon: positive elevation", () => {
    // ~18:00 UTC = ~15:00 local Chile (before sunset)
    const d = new Date("2026-04-01T18:00:00Z");
    const elev = solarElevation(-33.45, -70.67, d);
    expect(elev).toBeGreaterThan(5);
    expect(elev).toBeLessThan(50);
  });

  it("Santiago night: negative", () => {
    // ~06:00 UTC = ~03:00 local Chile
    const d = new Date("2026-04-01T06:00:00Z");
    const elev = solarElevation(-33.45, -70.67, d);
    expect(elev).toBeLessThan(0);
  });

  it("high latitude summer: elevation stays positive most of day", () => {
    // Stockholm, June 21, 14:00 UTC
    const d = new Date("2026-06-21T14:00:00Z");
    const elev = solarElevation(59.33, 18.07, d);
    expect(elev).toBeGreaterThan(30);
  });
});

describe("airMassFromElevation", () => {
  it("zenith (90°) returns 1", () => {
    expect(airMassFromElevation(90)).toBeCloseTo(1, 1);
  });

  it("horizon (0°) returns ~38", () => {
    const am = airMassFromElevation(0);
    expect(am).toBeGreaterThan(35);
    expect(am).toBeLessThan(42);
  });

  it("30° returns ~2", () => {
    expect(airMassFromElevation(30)).toBeCloseTo(2, 0);
  });

  it("below horizon caps at 40", () => {
    expect(airMassFromElevation(-5)).toBe(40);
  });

  it("monotonically decreasing with elevation", () => {
    const am10 = airMassFromElevation(10);
    const am30 = airMassFromElevation(30);
    const am60 = airMassFromElevation(60);
    expect(am10).toBeGreaterThan(am30);
    expect(am30).toBeGreaterThan(am60);
  });
});
