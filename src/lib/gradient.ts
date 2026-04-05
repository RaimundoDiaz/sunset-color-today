import { clamp, hslToRgb, rgbToHex } from "./color-utils";

/** 3 hex color stops for the SVG circle gradient */
export function buildGradientStops(h: number, s: number, l: number) {
  const topH = (h + 35) % 360;
  const topS = clamp(s - 12, 5, 100);
  const topL = clamp(l - 20, 10, 65);
  const botH = ((h - 5) + 360) % 360;
  const botS = clamp(s + 5, 5, 100);
  const botL = clamp(l + 14, 20, 85);
  return {
    top: rgbToHex(...hslToRgb(topH, topS, topL)),
    mid: rgbToHex(...hslToRgb(h, s, l)),
    bottom: rgbToHex(...hslToRgb(botH, botS, botL)),
  };
}

export function buildGradient(h: number, s: number, l: number): string {
  const topH = (h + 35) % 360;
  const topS = clamp(s - 12, 5, 100);
  const topL = clamp(l - 20, 10, 65);
  const botH = ((h - 5) + 360) % 360;
  const botS = clamp(s + 5, 5, 100);
  const botL = clamp(l + 14, 20, 85);
  return `linear-gradient(to bottom, hsl(${topH},${topS}%,${topL}%) 0%, hsl(${h},${s}%,${l}%) 55%, hsl(${botH},${botS}%,${botL}%) 100%)`;
}

export function computeTextColor(l: number): {
  color: string;
  textShadow: string;
} {
  if (l > 60) {
    return { color: "rgba(0,0,0,0.85)", textShadow: "0 1px 2px rgba(255,255,255,0.3)" };
  }
  return { color: "rgba(255,255,255,0.95)", textShadow: "0 1px 3px rgba(0,0,0,0.3)" };
}
