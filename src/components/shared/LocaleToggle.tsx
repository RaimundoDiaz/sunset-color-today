"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSunsetStore } from "@/store/useSunsetStore";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/constants/translations";

export function LocaleToggle() {
  const locale = useSunsetStore((s) => s.locale);
  const setLocale = useSunsetStore((s) => s.setLocale);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const pick = (l: Locale) => {
    setLocale(l);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 rounded-full border border-white/20 px-[8px] py-[2px] text-[9px] font-medium tracking-wider text-white/70 transition-colors hover:border-white/40 hover:text-white"
        aria-label="Switch language"
      >
        {LOCALE_LABELS[locale]}
        <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          <path d="M3 5l3 3 3-3" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-0 mb-1 flex flex-col rounded-lg border border-white/15 bg-black/60 backdrop-blur-xl overflow-hidden z-50"
          >
            {LOCALES.map((l) => (
              <button
                key={l}
                onClick={() => pick(l)}
                className={`px-3 py-[5px] text-[9px] font-medium tracking-wider text-left transition-colors
                  ${l === locale ? "text-white bg-white/15" : "text-white/50 hover:text-white hover:bg-white/10"}`}
              >
                {LOCALE_LABELS[l]}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
