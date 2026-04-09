"use client";

import { motion } from "framer-motion";
import { useSunsetStore } from "@/store/useSunsetStore";

export function LocaleToggle() {
  const locale = useSunsetStore((s) => s.locale);
  const setLocale = useSunsetStore((s) => s.setLocale);

  return (
    <button
      onClick={() => setLocale(locale === "en" ? "es" : "en")}
      className="relative flex items-center gap-[2px] rounded-full border border-white/20 px-[6px] py-[2px] text-[9px] font-medium tracking-wide transition-colors hover:border-white/40"
      aria-label="Switch language"
    >
      <span className={`relative z-10 px-[4px] py-[1px] transition-colors duration-300 ${locale === "en" ? "text-white" : "text-white/30"}`}>
        EN
      </span>
      <span className={`relative z-10 px-[4px] py-[1px] transition-colors duration-300 ${locale === "es" ? "text-white" : "text-white/30"}`}>
        ES
      </span>
      <motion.div
        className="absolute top-[1px] bottom-[1px] rounded-full bg-white/15"
        initial={false}
        animate={{
          left: locale === "en" ? 3 : "50%",
          right: locale === "es" ? 3 : "50%",
        }}
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
      />
    </button>
  );
}
