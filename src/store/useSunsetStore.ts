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

interface SunsetStore {
  locale: Locale;
  setLocale: (l: Locale) => void;

  location: LocationData;
  setLocation: (loc: LocationData) => void;

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

export const useSunsetStore = create<SunsetStore>((set) => ({
  locale: "en",
  setLocale: (locale) => set({ locale }),

  location: DEFAULT_LOCATION,
  setLocation: (location) => set({ location }),

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
