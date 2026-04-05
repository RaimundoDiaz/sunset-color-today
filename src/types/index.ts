export interface City {
  name: string;
  lat: number;
  lon: number;
  tz: string;
}

export interface TimelineStop {
  elevation: number;
  r: number; g: number; b: number;
  hex: string;
  h: number; s: number; l: number;
}

export interface SunsetResult {
  h: number;
  s: number;
  l: number;
  r: number;
  g: number;
  b: number;
  hex: string;
  factors: string[];
  weatherData: WeatherDisplayData;
  timeline: TimelineStop[];
  peak: TimelineStop;
}

export interface WeatherDisplayData {
  temp: number;
  humidity: number;
  dewpoint: number;
  totalCloud: number;
  cloudLow: number;
  cloudMid: number;
  cloudHigh: number;
  visibility: number;
  aod: number;
  effectiveAOD: number;
  effectiveAngstrom: number;
  pm25: number;
  pm10: number;
  dust: number;
  weatherCode: number;
  windSpeed: number;
  pressure: number;
  ozoneDU: number;
  ozoneSource: string;
  columnWV: number;
  sunsetTime: string;
  sunrise: string;
  AM: number;
  quality: number;
}

export interface AtmosphericData {
  pressure: number;
  effectiveAOD: number;
  effectiveAngstrom: number;
  ozoneDU: number;
  totalCloud: number;
  columnWV: number;
}

export interface SkyPhase {
  name: string;
  desc: string;
  icon: string;
}

export interface LiveSkyState {
  timeStr: string;
  dateStr: string;
  elevation: number;
  phase: SkyPhase;
  sky: { h: number; s: number; l: number };
  skyHex: string;
  countdown: { value: string; label: string; isActive: boolean };
}

export interface AirAtSunset {
  aod: number;
  pm25: number;
  pm10: number;
  dust: number;
  ozone: number;
}
