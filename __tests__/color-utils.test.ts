import { describe, it, expect } from "vitest";
import { clamp, lerp, hslToRgb, rgbToHex, rgbToHSL } from "@/lib/color-utils";

describe("clamp", () => {
  it("clamps below min", () => expect(clamp(-5, 0, 100)).toBe(0));
  it("clamps above max", () => expect(clamp(150, 0, 100)).toBe(100));
  it("passes through in range", () => expect(clamp(50, 0, 100)).toBe(50));
});

describe("lerp", () => {
  it("returns a at t=0", () => expect(lerp(10, 20, 0)).toBe(10));
  it("returns b at t=1", () => expect(lerp(10, 20, 1)).toBe(20));
  it("returns midpoint at t=0.5", () => expect(lerp(10, 20, 0.5)).toBe(15));
});

describe("hslToRgb", () => {
  it("pure red", () => expect(hslToRgb(0, 100, 50)).toEqual([255, 0, 0]));
  it("pure green", () => expect(hslToRgb(120, 100, 50)).toEqual([0, 255, 0]));
  it("pure blue", () => expect(hslToRgb(240, 100, 50)).toEqual([0, 0, 255]));
  it("white", () => expect(hslToRgb(0, 0, 100)).toEqual([255, 255, 255]));
  it("black", () => expect(hslToRgb(0, 0, 0)).toEqual([0, 0, 0]));
  it("gray", () => expect(hslToRgb(0, 0, 50)).toEqual([128, 128, 128]));
  it("hue 360 equals hue 0", () => {
    expect(hslToRgb(360, 80, 50)).toEqual(hslToRgb(0, 80, 50));
  });
});

describe("rgbToHex", () => {
  it("pure red", () => expect(rgbToHex(255, 0, 0)).toBe("#FF0000"));
  it("black", () => expect(rgbToHex(0, 0, 0)).toBe("#000000"));
  it("pads single digits", () => expect(rgbToHex(1, 2, 3)).toBe("#010203"));
});

describe("rgbToHSL", () => {
  it("pure red", () => {
    const { h, s, l } = rgbToHSL(255, 0, 0);
    expect(h).toBeCloseTo(0, 0);
    expect(s).toBeCloseTo(100, 0);
    expect(l).toBeCloseTo(50, 0);
  });
  it("white", () => {
    const { s, l } = rgbToHSL(255, 255, 255);
    expect(s).toBeCloseTo(0, 0);
    expect(l).toBeCloseTo(100, 0);
  });
  it("round-trips with hslToRgb", () => {
    const [r, g, b] = hslToRgb(30, 75, 55);
    const hsl = rgbToHSL(r, g, b);
    expect(hsl.h).toBeCloseTo(30, 0);
    expect(hsl.s).toBeCloseTo(75, 0);
    expect(hsl.l).toBeCloseTo(55, 0);
  });
});
