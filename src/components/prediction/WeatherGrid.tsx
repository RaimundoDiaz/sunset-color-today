"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { WeatherCard } from "./WeatherCard";
import { useT } from "@/hooks/useTranslation";
import type { WeatherDisplayData } from "@/types";

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } };

function WIcon({ src, alt, w, h }: { src: string; alt: string; w: number; h: number }) {
  return <Image src={src} alt={alt} width={w} height={h} className="brightness-0 invert opacity-90" />;
}

export function WeatherGrid({ data }: { data: WeatherDisplayData }) {
  const t = useT();
  const cards = [
    { icon: <WIcon src="/icons/temperature.svg" alt="temperature" w={10} h={22} />, value: `${data.temp}\u00B0C`, label: t("temperature") },
    { icon: <WIcon src="/icons/humidity.svg" alt="humidity" w={14} h={22} />, value: `${data.humidity}%`, label: `${t("humidity")} (${data.dewpoint.toFixed(0)}\u00B0 ${t("dewpoint")})` },
    { icon: <WIcon src="/icons/clud_cover.svg" alt="cloud cover" w={27} h={16} />, value: `${data.totalCloud}%`, label: t("cloudCover") },
    { icon: <WIcon src="/icons/visibility.svg" alt="visibility" w={25} h={16} />, value: `${(data.visibility / 1000).toFixed(1)} km`, label: t("visibility") },
    { icon: <WIcon src="/icons/aod.svg" alt="aod" w={24} h={22} />, value: data.effectiveAOD.toFixed(2), label: `${t("aodLabel")} (${data.aod.toFixed(2)} ${t("aodRaw")})` },
    { icon: <WIcon src="/icons/pm25.svg" alt="pm2.5" w={22} h={22} />, value: data.pm25.toFixed(1), label: "PM2.5" },
    { icon: <WIcon src="/icons/wind.svg" alt="wind" w={20} h={16} />, value: `${data.windSpeed} km/h`, label: t("wind") },
    { icon: <WIcon src="/icons/high_clouds.svg" alt="high clouds" w={23} h={22} />, value: `${data.cloudHigh}%`, label: t("highClouds") },
    { icon: <WIcon src="/icons/ozone.svg" alt="ozone" w={22} h={22} />, value: `${data.ozoneDU.toFixed(0)} DU`, label: `${t("ozone")} (${data.ozoneSource})` },
  ];

  return (
    <motion.div
      className="grid grid-cols-3 gap-2 mb-5 max-sm:grid-cols-2"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {cards.map((c, i) => (
        <motion.div key={i} variants={item}>
          <WeatherCard icon={c.icon} value={c.value} label={c.label} />
        </motion.div>
      ))}
    </motion.div>
  );
}
