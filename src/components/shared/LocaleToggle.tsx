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

  const code = locale.toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-center rounded-full border-[0.5px] border-white/60 w-[40px] h-[18px] text-[10px] font-medium text-white transition-colors hover:bg-white/10"
        aria-label="Switch language"
      >
        {code}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-0 mb-1 flex flex-col rounded-lg border border-white/15 bg-black/60 backdrop-blur-xl overflow-hidden z-50 max-h-[240px] overflow-y-auto"
          >
            {LOCALES.map((l) => (
              <button
                key={l}
                onClick={() => pick(l)}
                className={`px-3 py-[5px] text-[9px] font-medium tracking-wider text-left transition-colors whitespace-nowrap
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
