import type { Locale } from "@/constants/translations";

const WMO: Record<string, Record<number, string>> = {
  en: {
    0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Fog", 48: "Depositing rime fog", 51: "Light drizzle", 53: "Moderate drizzle",
    55: "Dense drizzle", 56: "Light freezing drizzle", 57: "Dense freezing drizzle",
    61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
    66: "Light freezing rain", 67: "Heavy freezing rain",
    71: "Slight snow", 73: "Moderate snow", 75: "Heavy snow",
    77: "Snow grains", 80: "Slight rain showers", 81: "Moderate rain showers", 82: "Violent rain showers",
    85: "Slight snow showers", 86: "Heavy snow showers", 95: "Thunderstorm", 96: "Thunderstorm with hail", 99: "Thunderstorm with heavy hail",
  },
  es: {
    0: "Cielo despejado", 1: "Mayormente despejado", 2: "Parcialmente nublado", 3: "Nublado",
    45: "Niebla", 48: "Niebla escarchada", 51: "Llovizna leve", 53: "Llovizna moderada",
    55: "Llovizna densa", 56: "Llovizna helada", 57: "Llovizna helada densa",
    61: "Lluvia leve", 63: "Lluvia moderada", 65: "Lluvia fuerte",
    66: "Lluvia helada", 67: "Lluvia helada fuerte",
    71: "Nieve leve", 73: "Nieve moderada", 75: "Nieve fuerte",
    77: "Granizo", 80: "Chubascos leves", 81: "Chubascos moderados", 82: "Chubascos fuertes",
    85: "Nieve leve", 86: "Nieve fuerte", 95: "Tormenta", 96: "Tormenta con granizo", 99: "Tormenta con granizo fuerte",
  },
  pt: {
    0: "C\u00E9u limpo", 1: "Predominantemente limpo", 2: "Parcialmente nublado", 3: "Nublado",
    45: "Nevoeiro", 48: "Nevoeiro com geada", 51: "Garoa leve", 53: "Garoa moderada",
    55: "Garoa densa", 56: "Garoa congelante leve", 57: "Garoa congelante densa",
    61: "Chuva leve", 63: "Chuva moderada", 65: "Chuva forte",
    66: "Chuva congelante leve", 67: "Chuva congelante forte",
    71: "Neve leve", 73: "Neve moderada", 75: "Neve forte",
    77: "Gr\u00E3os de neve", 80: "Pancadas leves", 81: "Pancadas moderadas", 82: "Pancadas fortes",
    85: "Neve leve", 86: "Neve forte", 95: "Tempestade", 96: "Tempestade com granizo", 99: "Tempestade com granizo forte",
  },
  fr: {
    0: "Ciel d\u00E9gag\u00E9", 1: "Principalement d\u00E9gag\u00E9", 2: "Partiellement nuageux", 3: "Couvert",
    45: "Brouillard", 48: "Brouillard givrant", 51: "Bruine l\u00E9g\u00E8re", 53: "Bruine mod\u00E9r\u00E9e",
    55: "Bruine dense", 56: "Bruine verglacante l\u00E9g\u00E8re", 57: "Bruine verglacante dense",
    61: "Pluie l\u00E9g\u00E8re", 63: "Pluie mod\u00E9r\u00E9e", 65: "Pluie forte",
    66: "Pluie vergla\u00E7ante l\u00E9g\u00E8re", 67: "Pluie vergla\u00E7ante forte",
    71: "Neige l\u00E9g\u00E8re", 73: "Neige mod\u00E9r\u00E9e", 75: "Neige forte",
    77: "Grains de neige", 80: "Averses l\u00E9g\u00E8res", 81: "Averses mod\u00E9r\u00E9es", 82: "Averses violentes",
    85: "Averses de neige l\u00E9g\u00E8res", 86: "Averses de neige fortes", 95: "Orage", 96: "Orage avec gr\u00EAle", 99: "Orage avec forte gr\u00EAle",
  },
  de: {
    0: "Klarer Himmel", 1: "\u00DCberwiegend klar", 2: "Teilweise bew\u00F6lkt", 3: "Bedeckt",
    45: "Nebel", 48: "Raureifnebel", 51: "Leichter Nieselregen", 53: "M\u00E4\u00DFiger Nieselregen",
    55: "Dichter Nieselregen", 56: "Leichter gefrierender Nieselregen", 57: "Dichter gefrierender Nieselregen",
    61: "Leichter Regen", 63: "M\u00E4\u00DFiger Regen", 65: "Starker Regen",
    66: "Leichter gefrierender Regen", 67: "Starker gefrierender Regen",
    71: "Leichter Schneefall", 73: "M\u00E4\u00DFiger Schneefall", 75: "Starker Schneefall",
    77: "Schneek\u00F6rner", 80: "Leichte Regenschauer", 81: "M\u00E4\u00DFige Regenschauer", 82: "Heftige Regenschauer",
    85: "Leichte Schneeschauer", 86: "Starke Schneeschauer", 95: "Gewitter", 96: "Gewitter mit Hagel", 99: "Gewitter mit starkem Hagel",
  },
  it: {
    0: "Cielo sereno", 1: "Prevalentemente sereno", 2: "Parzialmente nuvoloso", 3: "Coperto",
    45: "Nebbia", 48: "Nebbia con brina", 51: "Pioviggine leggera", 53: "Pioviggine moderata",
    55: "Pioviggine densa", 56: "Pioviggine gelata leggera", 57: "Pioviggine gelata densa",
    61: "Pioggia leggera", 63: "Pioggia moderata", 65: "Pioggia forte",
    66: "Pioggia gelata leggera", 67: "Pioggia gelata forte",
    71: "Neve leggera", 73: "Neve moderata", 75: "Neve forte",
    77: "Granuli di neve", 80: "Rovesci leggeri", 81: "Rovesci moderati", 82: "Rovesci violenti",
    85: "Rovesci di neve leggeri", 86: "Rovesci di neve forti", 95: "Temporale", 96: "Temporale con grandine", 99: "Temporale con grandine forte",
  },
  ja: {
    0: "\u5FEB\u6674", 1: "\u6982\u306D\u6674\u308C", 2: "\u6674\u308C\u6642\u3005\u66C7\u308A", 3: "\u66C7\u308A",
    45: "\u9727", 48: "\u7740\u6C37\u9727", 51: "\u5F31\u3044\u9727\u96E8", 53: "\u9727\u96E8",
    55: "\u5F37\u3044\u9727\u96E8", 56: "\u5F31\u3044\u7740\u6C37\u9727\u96E8", 57: "\u5F37\u3044\u7740\u6C37\u9727\u96E8",
    61: "\u5F31\u3044\u96E8", 63: "\u96E8", 65: "\u5F37\u3044\u96E8",
    66: "\u5F31\u3044\u7740\u6C37\u96E8", 67: "\u5F37\u3044\u7740\u6C37\u96E8",
    71: "\u5F31\u3044\u96EA", 73: "\u96EA", 75: "\u5F37\u3044\u96EA",
    77: "\u96EA\u3042\u3089\u308C", 80: "\u5F31\u3044\u306B\u308F\u304B\u96E8", 81: "\u306B\u308F\u304B\u96E8", 82: "\u5F37\u3044\u306B\u308F\u304B\u96E8",
    85: "\u5F31\u3044\u306B\u308F\u304B\u96EA", 86: "\u5F37\u3044\u306B\u308F\u304B\u96EA", 95: "\u96F7\u96E8", 96: "\u96F9\u3092\u4F34\u3046\u96F7\u96E8", 99: "\u5F37\u3044\u96F9\u3092\u4F34\u3046\u96F7\u96E8",
  },
};

const FALLBACK: Record<string, string> = {
  en: "Precipitation", es: "Precipitaci\u00F3n", pt: "Precipita\u00E7\u00E3o",
  fr: "Pr\u00E9cipitations", de: "Niederschlag", it: "Precipitazioni", ja: "\u964D\u6C34",
  zh: "\u964D\u6C34", ko: "\uAC15\uC218", ru: "\u041E\u0441\u0430\u0434\u043A\u0438",
  ar: "\u0647\u0637\u0648\u0644", hi: "\u0935\u0930\u094D\u0937\u093E", tr: "Ya\u011F\u0131\u015F",
  nl: "Neerslag", pl: "Opady",
};

export const RAIN_CODES = [45, 48, 51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99] as const;

/** English labels only — use {@link wmoLabel} for UI strings */
export const WMO_CODES = WMO.en;

export function wmoLabel(code: number, locale: Locale): string {
  const table = WMO[locale] ?? WMO.en;
  return table[code] ?? FALLBACK[locale] ?? FALLBACK.en;
}
