"use client";

import { useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSunsetStore, initLocale } from "@/store/useSunsetStore";
import type { Locale } from "@/constants/translations";
import { useWeatherQueries } from "@/hooks/useWeatherQueries";
import { useSunsetPrediction } from "@/hooks/useSunsetPrediction";
import { useLiveSky } from "@/hooks/useLiveSky";
import { useT } from "@/hooks/useTranslation";
import { buildGradientStops } from "@/lib/gradient";
import { dateTimeLocale } from "@/lib/locale-format";
import { SunsetCircle } from "./SunsetCircle";
import { LocationSearch } from "./shared/LocationSearch";
import { TabBar } from "./shared/TabBar";
import { ErrorBanner } from "./shared/ErrorBanner";
import { Footer } from "./shared/Footer";
import { PredictionPanel } from "./prediction/PredictionPanel";
import { LivePanel } from "./live/LivePanel";

function formatSunsetTime(iso: string, locale: Locale): string {
  return new Date(iso).toLocaleTimeString(dateTimeLocale(locale), {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatDate(tz: string, locale: Locale): string {
  return new Date().toLocaleDateString(dateTimeLocale(locale), {
    timeZone: tz,
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function getTonesLabel(h: number, s: number, l: number, t: (k: Parameters<ReturnType<typeof useT>>[0]) => string): string {
  if (s < 20) return t("mutedTones");
  if (h >= 0 && h < 30 && s > 60) return t("goldenTones");
  if (h >= 30 && h < 60) return t("warmGoldenTones");
  if ((h >= 330 || (h >= 0 && h < 15)) && s > 40) return t("intensePinkTones");
  if (h >= 200) return t("mutedTones");
  return t("pinkTones");
}

export function SunsetApp() {
  const location = useSunsetStore((s) => s.location);
  const activeTab = useSunsetStore((s) => s.activeTab);
  const locale = useSunsetStore((s) => s.locale);
  const setAtmosphericData = useSunsetStore((s) => s.setAtmosphericData);
  const t = useT();

  useEffect(() => {
    initLocale();
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "es" ? "es" : "en";
  }, [locale]);

  const { weather, air, power, ecmwf, isLoading, isError, error, warnings } =
    useWeatherQueries(location);

  const prediction = useSunsetPrediction(weather, air, power, ecmwf, location.lat, location.lon);

  const live = useLiveSky(
    location,
    prediction?.weatherData.sunsetTime,
    prediction?.weatherData.sunrise,
  );

  useEffect(() => {
    if (!prediction) return;
    const wd = prediction.weatherData;
    setAtmosphericData({
      pressure: wd.pressure,
      effectiveAOD: wd.effectiveAOD,
      effectiveAngstrom: wd.effectiveAngstrom,
      ozoneDU: wd.ozoneDU,
      totalCloud: wd.totalCloud,
      columnWV: wd.columnWV,
    });
  }, [prediction, setAtmosphericData]);

  const stops = useMemo(() => {
    if (activeTab === "prediction" && prediction && prediction.timeline && prediction.timeline.length >= 3) {
      const tl = prediction.timeline;
      return {
        top: tl[1].hex,
        mid: prediction.peak.hex,
        bottom: tl[tl.length - 2].hex,
      };
    }
    if (activeTab === "prediction" && prediction) {
      return buildGradientStops(prediction.h, prediction.s, prediction.l);
    }
    if (activeTab === "live") {
      return buildGradientStops(live.sky.h, live.sky.s, live.sky.l);
    }
    return { top: "#D7C6FF", mid: "#FDB7EA", bottom: "#FF8C82" };
  }, [activeTab, prediction, live.sky]);

  const cityName = location.name;
  const isReady = !!prediction && !isLoading;
  const sunsetTime = prediction ? formatSunsetTime(prediction.weatherData.sunsetTime, locale) : "--:--";
  const dateStr = formatDate(location.tz, locale);
  const tonesLabel = prediction
    ? getTonesLabel(prediction.h, prediction.s, prediction.l, t)
    : "";
  const updateTime = new Date().toLocaleTimeString(dateTimeLocale(locale), {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-dvh relative overflow-hidden">
      {/* Text overlay — top left */}
      <div className="absolute top-0 left-0 z-10 p-10 max-w-[420px] max-sm:p-6 max-sm:max-w-[280px]">
        <motion.h1
          className="text-[20px] font-medium uppercase tracking-[0.01em] text-black mb-5 max-sm:text-[16px]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          {t("title")}
        </motion.h1>

        <motion.div
          className="flex flex-col gap-[6px] text-[14px] font-light text-black/60 max-sm:text-[12px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <p>
            {cityName}&ensp;/&ensp;{dateStr}
          </p>
          <p>
            {t("sunset")} <span className="font-medium text-black">{sunsetTime}</span>
          </p>
          {prediction && (
            <p>
              {t("peakLight")} {sunsetTime} — {
                (() => {
                  const d = new Date(prediction.weatherData.sunsetTime);
                  d.setMinutes(d.getMinutes() + 20);
                  return d.toLocaleTimeString(dateTimeLocale(locale), { hour: "2-digit", minute: "2-digit", hour12: false });
                })()
              }
            </p>
          )}
        </motion.div>

        {isReady && (
          <motion.div
            className="mt-5 inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 text-[13px] text-black/75 font-light max-sm:text-[11px]"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <span className="text-[10px]">&#x2726;</span>
            {tonesLabel}
          </motion.div>
        )}

        <motion.p
          className="mt-4 text-[11px] font-light italic text-black/35 max-sm:text-[10px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          {t("generatedFrom")}
        </motion.p>
      </div>

      {/* Circle — large, offset right, centered */}
      <div className="absolute inset-0 flex items-center justify-center translate-x-[15%] translate-y-[8%] max-sm:translate-x-[10%] max-sm:translate-y-[12%]">
        {isLoading || isError ? (
          <div className="w-[min(920px,85vw)] h-[min(920px,85vw)] max-sm:w-[min(647px,95vw)] max-sm:h-[min(647px,95vw)] rounded-full bg-black/[0.03] flex items-center justify-center">
            <p className="text-sm text-black/30">
              {isError ? t("errorConnect") : t("loadingData")}
            </p>
          </div>
        ) : (
          <SunsetCircle stops={stops} isLoaded={isReady} />
        )}
      </div>

      {/* Detail panel — fixed position, scrollable content */}
      {isReady && (
        <motion.div
          className="absolute top-[280px] left-6 z-10 w-[380px] max-sm:relative max-sm:top-auto max-sm:left-auto max-sm:w-full max-sm:px-4 max-sm:pb-6 max-sm:pt-[70vh]"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="bg-white/65 backdrop-blur-xl rounded-2xl p-5 shadow-sm border border-black/[0.06] max-h-[calc(100vh-310px)] flex flex-col">
            <LocationSearch />
            <TabBar />
            <ErrorBanner warnings={warnings} />

            <div className="overflow-y-auto flex-1 min-h-0 pr-1 scrollbar-thin">
              <AnimatePresence mode="wait">
                {activeTab === "prediction" && prediction ? (
                  <motion.div
                    key="prediction"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <PredictionPanel result={prediction} />
                  </motion.div>
                ) : activeTab === "live" ? (
                  <motion.div
                    key="live"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <LivePanel
                      live={live}
                      sunsetIso={prediction?.weatherData.sunsetTime}
                      sunriseIso={prediction?.weatherData.sunrise}
                    />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            <Footer updateTime={updateTime} />
          </div>
        </motion.div>
      )}
    </div>
  );
}
