"use client";

import { motion } from "framer-motion";
import { WeatherCard } from "./WeatherCard";
import { useT } from "@/hooks/useTranslation";
import type { WeatherDisplayData } from "@/types";

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } };

export function WeatherGrid({ data }: { data: WeatherDisplayData }) {
  const t = useT();
  const cards = [
    { icon: "\uD83C\uDF21\uFE0F", value: `${data.temp}\u00B0C`, label: t("temperature") },
    { icon: "\uD83D\uDCA7", value: `${data.humidity}%`, label: `${t("humidity")} (${data.dewpoint.toFixed(0)}\u00B0 ${t("dewpoint")})` },
    { icon: "\u2601\uFE0F", value: `${data.totalCloud}%`, label: t("cloudCover") },
    { icon: "\uD83D\uDC41\uFE0F", value: `${(data.visibility / 1000).toFixed(1)} km`, label: t("visibility") },
    { icon: "\uD83C\uDF2B\uFE0F", value: data.effectiveAOD.toFixed(2), label: `${t("aodLabel")} (${data.aod.toFixed(2)} ${t("aodRaw")})` },
    { icon: "\uD83D\uDEE1\uFE0F", value: data.pm25.toFixed(1), label: "PM2.5" },
    { icon: "\uD83D\uDCA8", value: `${data.windSpeed} km/h`, label: t("wind") },
    { icon: "\u2B06\uFE0F", value: `${data.cloudHigh}%`, label: t("highClouds") },
    { icon: "\uD83C\uDF0D", value: `${data.ozoneDU.toFixed(0)} DU`, label: `${t("ozone")} (${data.ozoneSource})` },
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
