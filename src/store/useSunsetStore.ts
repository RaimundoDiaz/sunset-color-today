"use client";

import { create } from "zustand";
import type { AtmosphericData } from "@/types";
import { type Locale, detectLocale } from "@/constants/translations";

export interface LocationData {
  name: string;
  country: string;
  admin1?: string;
  lat: number;
  lon: number;
  tz: string;
}

/** Where the current location came from — IP lookup only overrides "default". */
export type LocationSource = "default" | "saved" | "ip" | "gps" | "search";

interface SunsetStore {
  locale: Locale;
  setLocale: (l: Locale) => void;

  location: LocationData;
  locationSource: LocationSource;
  /** False until we know which location to load (avoids fetching Santiago first). */
  locationReady: boolean;
  setLocation: (loc: LocationData, source: LocationSource) => void;
  markLocationReady: () => void;

  activeTab: "prediction" | "live";
  setTab: (tab: "prediction" | "live") => void;

  atmosphericData: AtmosphericData | null;
  setAtmosphericData: (d: AtmosphericData) => void;

  showWeatherDetail: boolean;
  toggleWeatherDetail: () => void;
}

const DEFAULT_LOCATION: LocationData = {
  name: "Santiago",
  country: "Chile",
  admin1: "Santiago Metropolitan",
  lat: -33.4489,
  lon: -70.6693,
  tz: "America/Santiago",
};

const STORAGE_KEY = "sunset:location";

function loadSavedLocation(): LocationData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const loc = JSON.parse(raw);
    if (typeof loc?.lat !== "number" || typeof loc?.lon !== "number" || typeof loc?.tz !== "string") return null;
    return loc;
  } catch {
    return null;
  }
}

function saveLocation(loc: LocationData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
  } catch {
    // Storage unavailable (private mode etc.) — location just won't persist
  }
}

const savedLocation = typeof window !== "undefined" ? loadSavedLocation() : null;

export const useSunsetStore = create<SunsetStore>((set) => ({
  locale: "en",
  setLocale: (locale) => set({ locale }),

  location: savedLocation ?? DEFAULT_LOCATION,
  locationSource: savedLocation ? "saved" : "default",
  locationReady: !!savedLocation,
  setLocation: (location, source) => {
    // Only explicit user choices are remembered; IP guesses are re-resolved each visit
    if (source === "gps" || source === "search") saveLocation(location);
    set({ location, locationSource: source, locationReady: true });
  },
  markLocationReady: () => set({ locationReady: true }),

  activeTab: "prediction",
  setTab: (tab) => set({ activeTab: tab }),

  atmosphericData: null,
  setAtmosphericData: (atmosphericData) => set({ atmosphericData }),

  showWeatherDetail: false,
  toggleWeatherDetail: () => set((s) => ({ showWeatherDetail: !s.showWeatherDetail })),
}));

export function initLocale() {
  useSunsetStore.getState().setLocale(detectLocale());
}
