"use client";

import { useEffect } from "react";
import { useSunsetStore, type LocationData } from "@/store/useSunsetStore";
import { t, type Locale } from "@/constants/translations";

interface IpLocation {
  name: string | null;
  countryCode: string | null;
  lat: number;
  lon: number;
  tz: string;
}

const IP_TIMEOUT_MS = 2000;
// GPS fix within this distance of the IP city reuses the city's name
const SAME_CITY_KM = 50;

let ipLocationPromise: Promise<IpLocation | null> | null = null;

/** Fetched once per page load and shared by the startup lookup and the GPS button. */
function fetchIpLocation(): Promise<IpLocation | null> {
  ipLocationPromise ??= fetch("/api/ip-location", { signal: AbortSignal.timeout(IP_TIMEOUT_MS) })
    .then((res) => (res.status === 200 ? res.json() : null))
    .catch(() => null);
  return ipLocationPromise;
}

function countryName(code: string | null, locale: Locale): string {
  if (!code) return "";
  try {
    return new Intl.DisplayNames([locale], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}

function distanceKm(aLat: number, aLon: number, bLat: number, bLon: number): number {
  const rad = Math.PI / 180;
  const dLat = (bLat - aLat) * rad;
  const dLon = (bLon - aLon) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(aLat * rad) * Math.cos(bLat * rad) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

/**
 * On first visit (no saved location), swap the Santiago default for the
 * visitor's IP-based city. Weather queries wait on `locationReady`.
 */
export function useAutoLocation() {
  useEffect(() => {
    const { locationSource, markLocationReady } = useSunsetStore.getState();
    if (locationSource !== "default") return;

    fetchIpLocation().then((ip) => {
      const state = useSunsetStore.getState();
      // User may have picked a location while we were waiting
      if (state.locationSource !== "default") return;
      if (!ip?.name) {
        markLocationReady();
        return;
      }
      state.setLocation(
        { name: ip.name, country: countryName(ip.countryCode, state.locale), lat: ip.lat, lon: ip.lon, tz: ip.tz },
        "ip",
      );
    });
  }, []);
}

/** Precise location via the browser permission prompt. Rejects if denied or unavailable. */
export async function requestGpsLocation(locale: Locale): Promise<LocationData> {
  const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error("unsupported"));
    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000, maximumAge: 10 * 60 * 1000 });
  });
  const lat = pos.coords.latitude;
  const lon = pos.coords.longitude;
  // The device is where the user is, so its timezone matches the fix
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const ip = await fetchIpLocation();
  if (ip?.name && distanceKm(lat, lon, ip.lat, ip.lon) < SAME_CITY_KM) {
    return { name: ip.name, country: countryName(ip.countryCode, locale), lat, lon, tz };
  }
  return { name: t(locale, "myLocation"), country: "", lat, lon, tz };
}
