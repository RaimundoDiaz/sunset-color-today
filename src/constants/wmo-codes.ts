import type { Locale } from "@/constants/translations";

const WMO_EN: Record<number, string> = {
  0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Fog", 48: "Depositing rime fog", 51: "Light drizzle", 53: "Moderate drizzle",
  55: "Dense drizzle", 56: "Light freezing drizzle", 57: "Dense freezing drizzle",
  61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
  66: "Light freezing rain", 67: "Heavy freezing rain",
  71: "Slight snow", 73: "Moderate snow", 75: "Heavy snow",
  77: "Snow grains", 80: "Slight rain showers", 81: "Moderate rain showers", 82: "Violent rain showers",
  85: "Slight snow showers", 86: "Heavy snow showers", 95: "Thunderstorm", 96: "Thunderstorm with hail", 99: "Thunderstorm with heavy hail",
};

const WMO_ES: Record<number, string> = {
  0: "Cielo despejado", 1: "Mayormente despejado", 2: "Parcialmente nublado", 3: "Nublado",
  45: "Niebla", 48: "Niebla escarchada", 51: "Llovizna leve", 53: "Llovizna moderada",
  55: "Llovizna densa", 56: "Llovizna helada", 57: "Llovizna helada densa",
  61: "Lluvia leve", 63: "Lluvia moderada", 65: "Lluvia fuerte",
  66: "Lluvia helada", 67: "Lluvia helada fuerte",
  71: "Nieve leve", 73: "Nieve moderada", 75: "Nieve fuerte",
  77: "Granizo", 80: "Chubascos leves", 81: "Chubascos moderados", 82: "Chubascos fuertes",
  85: "Nieve leve", 86: "Nieve fuerte", 95: "Tormenta", 96: "Tormenta con granizo", 99: "Tormenta con granizo fuerte",
};

export const RAIN_CODES = [45, 48, 51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99] as const;

/** English labels only — use {@link wmoLabel} for UI strings */
export const WMO_CODES = WMO_EN;

export function wmoLabel(code: number, locale: Locale): string {
  const table = locale === "es" ? WMO_ES : WMO_EN;
  return table[code] ?? (locale === "es" ? "Precipitación" : "Precipitation");
}
