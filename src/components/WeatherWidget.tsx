"use client";

import { type ReactNode, useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useT } from "@/hooks/useTranslation";
import type { WeatherDisplayData } from "@/types";

/* ------------------------------------------------------------------ */
/*  Icon helper                                                        */
/* ------------------------------------------------------------------ */

function WIcon({ src, alt, w, h }: { src: string; alt: string; w: number; h: number }) {
  return <Image src={src} alt={alt} width={w} height={h} className="brightness-0 invert opacity-90" />;
}

/* ------------------------------------------------------------------ */
/*  Card component                                                     */
/* ------------------------------------------------------------------ */

interface CardData {
  icon: ReactNode;
  value: string;
  label: string;
}

function WidgetCard({ icon, value, label }: CardData) {
  return (
    <div className="bg-white/10 border-[0.5px] border-white/60 rounded-[20px] p-3 w-[120px] flex flex-col gap-3">
      <div className="h-[26px] flex items-center">{icon}</div>
      <div className="flex flex-col tracking-[-0.4px]">
        <span className="text-[14px] font-semibold text-white leading-[21px]">{value}</span>
        <span className="text-[12px] font-normal text-white leading-[21px]">{label}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};
const item = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

/* ------------------------------------------------------------------ */
/*  Mobile card (compact 69px wide)                                    */
/* ------------------------------------------------------------------ */

function MobileWidgetCard({ icon, value, label }: CardData) {
  return (
    <div className="bg-white/10 border-[0.5px] border-white/60 rounded-[20px] px-2 py-3 w-[69px] flex flex-col gap-2 items-center">
      <div className="h-[16px] flex items-center justify-center">{icon}</div>
      <div className="flex flex-col items-center tracking-[-0.4px] leading-[13px] overflow-clip w-full text-center">
        <span className="text-[11px] font-semibold text-white">{value}</span>
        <span className="text-[8px] font-normal text-white">{label}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Desktop Widget (2-col, 120px cards)                                */
/* ------------------------------------------------------------------ */

export function WeatherWidget({ data }: { data: WeatherDisplayData }) {
  const t = useT();

  const col1: CardData[] = [
    { icon: <WIcon src="/icons/temperature.svg" alt="temperature" w={12} h={26} />, value: `${data.temp}\u00B0C`, label: t("temperature") },
    { icon: <WIcon src="/icons/humidity.svg" alt="humidity" w={17} h={26} />, value: `${data.humidity}%`, label: t("humidity") },
    { icon: <WIcon src="/icons/clud_cover.svg" alt="cloud cover" w={32} h={19} />, value: `${data.totalCloud}%`, label: t("cloudCover") },
  ];

  const col2: CardData[] = [
    { icon: <WIcon src="/icons/visibility.svg" alt="visibility" w={30} h={19} />, value: `${(data.visibility / 1000).toFixed(1)} km`, label: t("visibility") },
    { icon: <WIcon src="/icons/aod.svg" alt="aod" w={29} h={26} />, value: data.effectiveAOD.toFixed(2), label: `AOD (${data.aod.toFixed(2)} ${t("aodRaw")})` },
    { icon: <WIcon src="/icons/pm25.svg" alt="pm2.5" w={26} h={26} />, value: data.pm25.toFixed(1), label: "PM2.5" },
    { icon: <WIcon src="/icons/wind.svg" alt="wind" w={24} h={19} />, value: `${data.windSpeed} km/h`, label: t("wind") },
    { icon: <WIcon src="/icons/high_clouds.svg" alt="high clouds" w={27} h={26} />, value: `${data.cloudHigh}%`, label: t("highClouds") },
    { icon: <WIcon src="/icons/ozone.svg" alt="ozone" w={26} h={26} />, value: `${data.ozoneDU.toFixed(0)} DU`, label: `O\u2083 (${data.ozoneSource})` },
  ];

  return (
    <motion.div
      className="flex gap-3 items-start"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {/* Column 1 */}
      <div className="flex flex-col gap-3">
        {col1.map((c, i) => (
          <motion.div key={i} variants={item}>
            <WidgetCard {...c} />
          </motion.div>
        ))}
      </div>
      {/* Column 2 */}
      <div className="flex flex-col gap-3">
        {col2.map((c, i) => (
          <motion.div key={i} variants={item}>
            <WidgetCard {...c} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile Widget (single narrow column, scrollable)                   */
/* ------------------------------------------------------------------ */

export function MobileWeatherWidget({ data }: { data: WeatherDisplayData }) {
  const t = useT();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const cards: CardData[] = [
    { icon: <WIcon src="/icons/temperature.svg" alt="temperature" w={7} h={16} />, value: `${data.temp}\u00B0C`, label: t("temperature") },
    { icon: <WIcon src="/icons/humidity.svg" alt="humidity" w={11} h={16} />, value: `${data.humidity}%`, label: t("humidity") },
    { icon: <WIcon src="/icons/clud_cover.svg" alt="cloud cover" w={18} h={16} />, value: `${data.totalCloud}%`, label: t("cloudCover") },
    { icon: <WIcon src="/icons/visibility.svg" alt="visibility" w={18} h={16} />, value: `${(data.visibility / 1000).toFixed(1)} km`, label: t("visibility") },
    { icon: <WIcon src="/icons/aod.svg" alt="aod" w={17} h={16} />, value: data.effectiveAOD.toFixed(2), label: "AOD" },
    { icon: <WIcon src="/icons/pm25.svg" alt="pm2.5" w={16} h={16} />, value: data.pm25.toFixed(1), label: "PM2.5" },
    { icon: <WIcon src="/icons/wind.svg" alt="wind" w={20} h={16} />, value: `${data.windSpeed} km/h`, label: t("wind") },
    { icon: <WIcon src="/icons/high_clouds.svg" alt="high clouds" w={16} h={16} />, value: `${data.cloudHigh}%`, label: t("highClouds") },
    { icon: <WIcon src="/icons/ozone.svg" alt="ozone" w={16} h={16} />, value: `${data.ozoneDU.toFixed(0)} DU`, label: `O\u2083` },
  ];

  const totalDots = 4;

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    setScrollProgress(max > 0 ? el.scrollTop / max : 0);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const activeIdx = Math.round(scrollProgress * (totalDots - 1));

  return (
    <motion.div
      className="flex gap-2 items-start pt-10 shrink-0"
      style={{ height: "min(400px, 60dvh)" }}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      <div
        ref={scrollRef}
        className="flex flex-col gap-2 w-[69px] overflow-y-auto overflow-x-hidden scrollbar-none"
        style={{ maxHeight: "100%" }}
      >
        {cards.map((c, i) => (
          <motion.div key={i} variants={item} className="shrink-0">
            <MobileWidgetCard {...c} />
          </motion.div>
        ))}
      </div>
      {/* Scroll indicator dots */}
      <div className="flex flex-col gap-[2px] items-start justify-center h-full">
        {Array.from({ length: totalDots }, (_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-200"
            style={{
              width: 3,
              height: i === activeIdx ? 6 : 3,
              backgroundColor: i === activeIdx
                ? "rgba(255,255,255,1)"
                : i === activeIdx - 1 || i === activeIdx + 1
                  ? "rgba(255,255,255,0.5)"
                  : "rgba(255,255,255,0.3)",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
