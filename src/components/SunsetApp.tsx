"use client";

import { useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSunsetStore, initLocale } from "@/store/useSunsetStore";
import type { Locale } from "@/constants/translations";
import { useWeatherQueries } from "@/hooks/useWeatherQueries";
import { useSunsetPrediction } from "@/hooks/useSunsetPrediction";
import { useLiveSky } from "@/hooks/useLiveSky";
import { useT } from "@/hooks/useTranslation";
import { dateTimeLocale } from "@/lib/locale-format";
import { AtmosphericBackground } from "./AtmosphericBackground";
import { TimelineSlider } from "./TimelineSlider";
import { WeatherWidget } from "./WeatherWidget";
import { LocationSearch } from "./shared/LocationSearch";
import { Footer } from "./shared/Footer";
import { ErrorBanner } from "./shared/ErrorBanner";

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

export function SunsetApp() {
  const location = useSunsetStore((s) => s.location);
  const locale = useSunsetStore((s) => s.locale);
  const setAtmosphericData = useSunsetStore((s) => s.setAtmosphericData);
  const showWeatherDetail = useSunsetStore((s) => s.showWeatherDetail);
  const toggleWeatherDetail = useSunsetStore((s) => s.toggleWeatherDetail);
  const t = useT();

  useEffect(() => {
    initLocale();
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "es" ? "es" : "en";
  }, [locale]);

  const { weather, air, power, ecmwf, isLoading, isError, warnings } =
    useWeatherQueries(location);

  const prediction = useSunsetPrediction(weather, air, power, ecmwf, location.lat, location.lon);

  // Keep live sky hook running (used later when live tab returns)
  useLiveSky(
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

  const isReady = !!prediction && !isLoading;
  const sunsetTime = prediction ? formatSunsetTime(prediction.weatherData.sunsetTime, locale) : "--:--";
  const dateStr = formatDate(location.tz, locale);
  const updateTime = new Date().toLocaleTimeString(dateTimeLocale(locale), {
    hour: "2-digit",
    minute: "2-digit",
  });

  const peakEndTime = useMemo(() => {
    if (!prediction) return "--:--";
    const d = new Date(prediction.weatherData.sunsetTime);
    d.setMinutes(d.getMinutes() + 20);
    return d.toLocaleTimeString(dateTimeLocale(locale), { hour: "2-digit", minute: "2-digit", hour12: false });
  }, [prediction, locale]);

  const defaultTimeline = [{ elevation: 0, r: 200, g: 150, b: 100, hex: "#C89664", h: 30, s: 40, l: 60 }];
  const defaultPeak = defaultTimeline[0];

  return (
    <div className="min-h-dvh relative overflow-hidden">
      {/* Layer 0: Animated atmospheric background */}
      <AtmosphericBackground
        timeline={prediction?.timeline ?? defaultTimeline}
        peak={prediction?.peak ?? defaultPeak}
        quality={prediction?.weatherData.quality ?? 50}
        isLoading={isLoading && !prediction}
      />

      {/* Layer 1: Hero section — top left */}
      <div className="absolute top-0 left-0 z-10 flex flex-col justify-between min-h-dvh pl-[60px] pt-[60px] pb-[60px] max-sm:pl-6 max-sm:pt-10 max-sm:pb-6 max-sm:pr-6 max-sm:relative max-sm:min-h-0">
        <div className="flex flex-col gap-6 items-start max-w-[300px] max-sm:max-w-full">
          {/* Title */}
          <motion.h1
            className="text-[20px] font-medium uppercase text-white max-sm:text-[16px]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {t("title")}
          </motion.h1>

          {/* Location search */}
          <motion.div
            className="w-[300px] max-sm:w-full"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <LocationSearch />
          </motion.div>

          {/* Date & sunset info */}
          <motion.div
            className="flex flex-col gap-2 text-[14px] font-light text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <p>{dateStr}</p>
            <p>
              {t("sunset")}{" "}
              <span className="font-semibold">{sunsetTime}</span>
            </p>
            {prediction && (
              <p>
                {t("peakLight")} {sunsetTime} — {peakEndTime}
              </p>
            )}
          </motion.div>

          {/* Peak color */}
          {isReady && prediction && (
            <motion.div
              className="flex flex-col gap-2"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <p className="text-[12px] text-white tracking-[-0.4px]">{t("peakColor")}</p>
              <div className="flex items-center gap-2">
                <div
                  className="w-[30px] h-[30px] rounded-full shrink-0"
                  style={{ backgroundColor: prediction.peak.hex }}
                />
                <span className="text-[14px] font-semibold text-white">{prediction.peak.hex}</span>
              </div>
            </motion.div>
          )}

          {/* Toggle details button */}
          {isReady && prediction && (
            <motion.button
              onClick={toggleWeatherDetail}
              className="border border-white/[0.6] rounded-full px-6 py-1 text-[12px] font-medium text-white hover:bg-white/10 transition-colors"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {showWeatherDetail ? `\u2190 ${t("hideDetails")}` : t("seeShapes")}
            </motion.button>
          )}

          {/* Error warnings */}
          <ErrorBanner warnings={warnings} />
        </div>

        {/* Footer — bottom left */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="max-sm:mt-8"
        >
          <Footer updateTime={updateTime} />
        </motion.div>
      </div>

      {/* Layer 2: Weather widget — top right (desktop only) */}
      <AnimatePresence>
        {showWeatherDetail && isReady && prediction && (
          <motion.div
            className="absolute top-10 right-10 z-10 hidden md:block"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <WeatherWidget data={prediction.weatherData} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading/error overlay */}
      {(isLoading || isError) && !prediction && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <p className="text-sm text-white/40">
            {isError ? t("errorConnect") : t("loadingData")}
          </p>
        </div>
      )}

      {/* Layer 3: Timeline slider — bottom (desktop only) */}
      {isReady && prediction && (
        <TimelineSlider
          timeline={prediction.timeline}
          sunsetTime={prediction.weatherData.sunsetTime}
        />
      )}
    </div>
  );
}
