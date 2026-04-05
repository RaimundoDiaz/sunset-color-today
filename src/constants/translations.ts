export type Locale = "en" | "es";

export const translations = {
  en: {
    // Header
    title: "Today's Sunset Color",
    subtitle: "Today's predicted sunset color",
    generatedFrom: "Generated from real-time atmospheric data",
    sunset: "Sunset",
    peakLight: "Peak light",

    // Tones
    goldenTones: "Golden tones likely tonight",
    warmGoldenTones: "Warm golden tones likely tonight",
    pinkTones: "Soft pink tones likely tonight",
    intensePinkTones: "Intense pink tones likely tonight",
    mutedTones: "Muted tones likely tonight",

    // Tabs
    prediction: "Prediction",
    live: "Live",

    // Prediction
    sunsetLabel: "Sunset",
    quality: "Quality",
    qualityExceptional: "Exceptional",
    qualityGood: "Good",
    qualityModerate: "Moderate",
    qualityLow: "Low",
    qualityPoor: "Poor",
    copy: "Copy",
    copied: "Copied!",

    // Weather cards
    temperature: "Temperature",
    humidity: "Humidity",
    dewpoint: "dew",
    cloudCover: "Cloud cover",
    visibility: "Visibility",
    aodLabel: "AOD",
    aodRaw: "raw",
    wind: "Wind",
    highClouds: "High clouds",
    ozone: "O\u2083",

    // Live
    solarElevation: "Solar elevation",
    sunsetToday: "Sunset today",
    sunriseToday: "Sunrise today",
    skyColorNow: "Current sky color",
    forSunset: "until sunset",
    sinceSunset: "since sunset",
    sunsetImminent: "\uD83D\uDD25 Sunset imminent!",
    sunsetHappening: "\uD83C\uDF05 Sunset happening!",
    ago: "ago",

    // Phases
    phaseDay: "Daytime",
    phaseDayDesc: "Sun high, blue sky",
    phaseAfternoon: "Afternoon",
    phaseAfternoonDesc: "Sun descending, warm light",
    phaseGoldenHour: "Golden Hour",
    phaseGoldenHourDesc: "Low-angle light, intense warm colors",
    phaseSunset: "\uD83D\uDD25 Sunset",
    phaseSunsetDesc: "Sun setting \u2014 peak sunset colors",
    phaseCivilTwilight: "Civil Twilight",
    phaseCivilTwilightDesc: "Sun below horizon, sky still lit",
    phaseNauticalTwilight: "Nautical Twilight",
    phaseNauticalTwilightDesc: "Horizon visible, bright stars appear",
    phaseAstroTwilight: "Astronomical Twilight",
    phaseAstroTwilightDesc: "Last traces of sunlight",
    phaseNight: "Night",
    phaseNightDesc: "Dark sky",

    // Footer
    footerData: "Data: Open-Meteo API \u00B7 Updated:",
    footerModel: "Spectral model v2 \u00B7 Rayleigh + Mie + Chappuis + CIE 1931",

    // Errors
    loadingData: "Loading data...",
    errorConnect: "Connection error",
    warnAirQuality: "Air quality data unavailable, using estimates.",
    warnNasaPower: "NASA POWER unavailable, ozone estimated from latitude/UV.",
    warnEcmwf: "ECMWF unavailable, water vapor estimated.",

    // Factors (templates — use {var} placeholders)
    factorSunsetBlockedGeneral: "Sunset not visible: dense clouds or very low visibility.",
    factorSunsetMostlyHidden: "Sunset mostly hidden (visibility {pct}%): very muted colors.",
    factorSunsetPartlyVisible: "Sunset partly visible ({pct}%): moderate colors.",
    factorHeavyCloudCover: "Total cloud cover {pct}%: mostly overcast sky.",
    factorCleanAir: "Very clean air (AOD {aod}): pure Rayleigh \u2014 vivid oranges.",
    factorModerateAerosol: "Moderate aerosols (AOD {aod}, eff. {effAod}): deepen reds.",
    factorHighAerosol: "High aerosols (AOD {aod}, eff. {effAod}): Mie dominates \u2014 muted colors.",
    factorHighHumidity: "High humidity ({hum}%, dew {dew}\u00B0C): hygroscopic growth \u00D7{growth} \u2014 pinkish, diffuse tones.",
    factorHighHumidityWV: " Column vapor {wv} kg/m\u00B2 confirms upper-level moisture.",
    factorModHumidity: "Moderate humidity ({hum}%): slight diffusion.",
    factorLowHumidity: "Low humidity ({hum}%): sharp, saturated colors.",
    factorLowOvercast: "Dense low clouds: sunset hidden.",
    factorOvercast: "Fully overcast: colors severely muted.",
    factorHighCloudsIdeal: "High clouds ({pct}%): ideal canvas \u2014 amplifying reds and magentas.",
    factorHighCloudsHeavy: "High clouds ({pct}%): abundant, starting to block.",
    factorHighCloudsPartial: "High clouds ({pct}%): partial canvas catching last rays.",
    factorMidCloudsWarm: "Mid clouds ({pct}%): warm tones.",
    factorMidCloudsBlocking: "Mid clouds ({pct}%): partially blocking.",
    factorMidCloudsDense: "Mid clouds ({pct}%): dense, blocking.",
    factorLowCloudsHorizon: "Low clouds ({pct}%): horizon blocked.",
    factorLowCloudsPartial: "Low clouds ({pct}%): partially muting colors.",
    factorClearSky: "Clear sky: pure Rayleigh, no cloud canvas.",
    factorLowVis: "Reduced visibility ({vis} km).",
    factorHighTemp: "High temp ({temp}\u00B0C): warm particles.",
    factorLowTemp: "Low temp ({temp}\u00B0C): cooler tones.",
    factorRain: "{condition}: sunset hidden.",
    factorPostRain: "Post-rain: clean air + high clouds \u2014 vivid colors.",
    factorTechnical: "AM={am}, P={p} hPa, O\u2083={oz} DU ({ozSrc}), H\u2082O={wv} kg/m\u00B2 ({wvSrc}), \u03B1={alpha}.",
  },
  es: {
    title: "Color del Atardecer de Hoy",
    subtitle: "Color predicho del atardecer de hoy",
    generatedFrom: "Generado con datos atmosféricos en tiempo real",
    sunset: "Atardecer",
    peakLight: "Luz máxima",

    goldenTones: "Tonos dorados probables esta noche",
    warmGoldenTones: "Tonos dorados cálidos probables esta noche",
    pinkTones: "Tonos rosados suaves probables esta noche",
    intensePinkTones: "Tonos rosados intensos probables esta noche",
    mutedTones: "Tonos apagados probables esta noche",

    prediction: "Predicción",
    live: "En vivo",

    sunsetLabel: "Atardecer",
    quality: "Calidad",
    qualityExceptional: "Excepcional",
    qualityGood: "Buena",
    qualityModerate: "Moderada",
    qualityLow: "Baja",
    qualityPoor: "Pobre",
    copy: "Copiar",
    copied: "¡Copiado!",

    temperature: "Temperatura",
    humidity: "Humedad",
    dewpoint: "rocío",
    cloudCover: "Nubosidad",
    visibility: "Visibilidad",
    aodLabel: "AOD",
    aodRaw: "bruto",
    wind: "Viento",
    highClouds: "Nubes altas",
    ozone: "O\u2083",

    solarElevation: "Elevación solar",
    sunsetToday: "Atardecer hoy",
    sunriseToday: "Amanecer hoy",
    skyColorNow: "Color del cielo ahora",
    forSunset: "para el atardecer",
    sinceSunset: "desde el atardecer",
    sunsetImminent: "\uD83D\uDD25 ¡Atardecer inminente!",
    sunsetHappening: "\uD83C\uDF05 ¡Atardecer en curso!",
    ago: "hace",

    phaseDay: "Día",
    phaseDayDesc: "Sol alto, cielo azul",
    phaseAfternoon: "Tarde",
    phaseAfternoonDesc: "Sol descendiendo, luz cálida",
    phaseGoldenHour: "Hora dorada",
    phaseGoldenHourDesc: "Luz rasante, colores cálidos intensos",
    phaseSunset: "\uD83D\uDD25 Atardecer",
    phaseSunsetDesc: "El sol se pone — colores en su máximo",
    phaseCivilTwilight: "Crepúsculo civil",
    phaseCivilTwilightDesc: "Sol bajo el horizonte, cielo aún iluminado",
    phaseNauticalTwilight: "Crepúsculo náutico",
    phaseNauticalTwilightDesc: "Horizonte visible, aparecen estrellas",
    phaseAstroTwilight: "Crepúsculo astronómico",
    phaseAstroTwilightDesc: "Últimos vestigios de luz solar",
    phaseNight: "Noche",
    phaseNightDesc: "Cielo oscuro",

    footerData: "Datos: Open-Meteo API \u00B7 Actualizado:",
    footerModel: "Modelo espectral v2 \u00B7 Rayleigh + Mie + Chappuis + CIE 1931",

    loadingData: "Obteniendo datos...",
    errorConnect: "Error al conectar",
    warnAirQuality: "Calidad del aire no disponible, usando estimaciones.",
    warnNasaPower: "NASA POWER no disponible, ozono estimado por latitud/UV.",
    warnEcmwf: "ECMWF no disponible, vapor de agua estimado.",

    factorSunsetBlockedGeneral: "Atardecer no visible: nubes densas o visibilidad muy baja.",
    factorSunsetMostlyHidden: "Atardecer parcialmente oculto (visibilidad {pct}%): colores muy atenuados.",
    factorSunsetPartlyVisible: "Atardecer parcialmente visible ({pct}%): colores moderados.",
    factorHeavyCloudCover: "Nubosidad total {pct}%: cielo mayormente cubierto.",
    factorCleanAir: "Aire muy limpio (AOD {aod}): Rayleigh pura — naranjas vívidos.",
    factorModerateAerosol: "Aerosoles moderados (AOD {aod}, efect. {effAod}): profundizan rojos.",
    factorHighAerosol: "Aerosoles altos (AOD {aod}, efect. {effAod}): Mie domina — colores apagados.",
    factorHighHumidity: "Humedad alta ({hum}%, rocío {dew}\u00B0C): crecimiento higroscópico ×{growth} — tonos rosados y difusos.",
    factorHighHumidityWV: " Vapor columnar {wv} kg/m\u00B2 confirma humedad en altura.",
    factorModHumidity: "Humedad moderada ({hum}%): ligera difusión.",
    factorLowHumidity: "Humedad baja ({hum}%): colores nítidos y saturados.",
    factorLowOvercast: "Nubes bajas densas: atardecer oculto.",
    factorOvercast: "Totalmente nublado: colores muy atenuados.",
    factorHighCloudsIdeal: "Nubes altas ({pct}%): lienzo ideal — amplifican rojos y magentas.",
    factorHighCloudsHeavy: "Nubes altas ({pct}%): abundantes, empezando a tapar.",
    factorHighCloudsPartial: "Nubes altas ({pct}%): lienzo parcial que captura los últimos rayos.",
    factorMidCloudsWarm: "Nubes medias ({pct}%): tonos cálidos.",
    factorMidCloudsBlocking: "Nubes medias ({pct}%): bloqueando en parte.",
    factorMidCloudsDense: "Nubes medias ({pct}%): densas, bloqueando.",
    factorLowCloudsHorizon: "Nubes bajas ({pct}%): horizonte bloqueado.",
    factorLowCloudsPartial: "Nubes bajas ({pct}%): atenuando colores.",
    factorClearSky: "Cielo despejado: Rayleigh pura, sin lienzo de nubes.",
    factorLowVis: "Visibilidad reducida ({vis} km).",
    factorHighTemp: "Temp. alta ({temp}\u00B0C): partículas cálidas.",
    factorLowTemp: "Temp. baja ({temp}\u00B0C): tonos más fríos.",
    factorRain: "{condition}: atardecer oculto.",
    factorPostRain: "Post-lluvia: aire limpio + nubes altas — colores vívidos.",
    factorTechnical: "AM={am}, P={p} hPa, O\u2083={oz} DU ({ozSrc}), H\u2082O={wv} kg/m\u00B2 ({wvSrc}), \u03B1={alpha}.",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

/** Simple template replacement: "Hello {name}" + {name: "World"} → "Hello World" */
export function t(
  locale: Locale,
  key: TranslationKey,
  vars?: Record<string, string | number>,
): string {
  let str = translations[locale][key] as string;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replaceAll(`{${k}}`, String(v));
    }
  }
  return str;
}

/** Match UI locale to the browser language when possible */
export function detectLocale(): Locale {
  if (typeof navigator === "undefined") return "en";
  const lang = navigator.language || "en";
  return lang.startsWith("es") ? "es" : "en";
}
