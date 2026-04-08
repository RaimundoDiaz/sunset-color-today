"use client";

import { motion } from "framer-motion";
import { useT } from "@/hooks/useTranslation";
import type { TranslationKey } from "@/constants/translations";

const levels: { min: number; key: TranslationKey; color: string }[] = [
  { min: 80, key: "qualityExceptional", color: "#4caf50" },
  { min: 60, key: "qualityGood", color: "#8bc34a" },
  { min: 40, key: "qualityModerate", color: "#e0a800" },
  { min: 20, key: "qualityLow", color: "#e67e00" },
  { min: 0, key: "qualityPoor", color: "#999" },
];

export function QualityBar({ quality }: { quality: number }) {
  const t = useT();
  const level = levels.find((l) => quality >= l.min) ?? levels[levels.length - 1];

  return (
    <div className="flex items-center gap-3 mb-5 text-sm">
      <span className="text-white/50 text-xs font-light whitespace-nowrap">{t("quality")}</span>
      <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${quality}%`, backgroundColor: level.color }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>
      <span className="font-medium text-xs text-white/70 min-w-[90px] text-right">
        {quality}/100 — {t(level.key)}
      </span>
    </div>
  );
}
