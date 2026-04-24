import type { TranslationKey } from "@/constants/translations";

/**
 * Map an HSL triplet to a sunset-appropriate color name key.
 * Bucketing assumes typical sunset hues: red→orange→yellow→pink→magenta.
 * Low-saturation or very dark/light colors collapse to "muted".
 */
export function colorNameKey(h: number, s: number, l: number): TranslationKey {
  if (s < 18 || l < 15 || l > 88) return "colorMuted";

  // Normalize hue to [0, 360)
  const hue = ((h % 360) + 360) % 360;

  if (hue < 12 || hue >= 345) {
    return l < 45 ? "colorCrimson" : "colorRed";
  }
  if (hue < 28) return "colorOrange";
  if (hue < 42) return "colorAmber";
  if (hue < 55) return "colorGold";
  if (hue < 72) return "colorYellow";
  if (hue < 260) return "colorMuted"; // greens/blues — rare but possible
  if (hue < 295) return "colorViolet";
  if (hue < 325) return "colorMagenta";
  return "colorPink"; // 325–345: soft pinks
}
