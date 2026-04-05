"use client";

import { useQueries } from "@tanstack/react-query";
import { useSunsetStore, type LocationData } from "@/store/useSunsetStore";
import { t as tr } from "@/constants/translations";
import {
  fetchWeather,
  fetchAirQuality,
  fetchNasaPower,
  fetchEcmwf,
} from "@/api/fetchers";

// Query key uses lat/lon rounded to 2 decimals to avoid unnecessary refetches
function locKey(loc: LocationData) {
  return `${loc.lat.toFixed(2)},${loc.lon.toFixed(2)}`;
}

export function useWeatherQueries(loc: LocationData) {
  const k = locKey(loc);

  const [weatherQ, airQ, powerQ, ecmwfQ] = useQueries({
    queries: [
      {
        queryKey: ["weather", "forecast", k],
        queryFn: () => fetchWeather(loc.lat, loc.lon, loc.tz),
        staleTime: 10 * 60 * 1000,
      },
      {
        queryKey: ["weather", "air-quality", k],
        queryFn: () => fetchAirQuality(loc.lat, loc.lon, loc.tz),
        staleTime: 10 * 60 * 1000,
        retry: 1,
      },
      {
        queryKey: ["weather", "nasa-power", k],
        queryFn: () => fetchNasaPower(loc.lat, loc.lon),
        staleTime: 60 * 60 * 1000,
        retry: 1,
      },
      {
        queryKey: ["weather", "ecmwf", k],
        queryFn: () => fetchEcmwf(loc.lat, loc.lon, loc.tz),
        staleTime: 10 * 60 * 1000,
        retry: 1,
      },
    ],
  });

  const locale = useSunsetStore.getState().locale;
  const warnings: string[] = [];
  if (airQ.isError) warnings.push(tr(locale, "warnAirQuality"));
  if (powerQ.isError) warnings.push(tr(locale, "warnNasaPower"));
  if (ecmwfQ.isError) warnings.push(tr(locale, "warnEcmwf"));

  return {
    weather: weatherQ.data ?? null,
    air: airQ.data ?? null,
    power: powerQ.data ?? null,
    ecmwf: ecmwfQ.data ?? null,
    isLoading: weatherQ.isLoading,
    isError: weatherQ.isError,
    error: weatherQ.error,
    warnings,
  };
}
