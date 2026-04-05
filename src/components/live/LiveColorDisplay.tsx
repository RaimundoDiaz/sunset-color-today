"use client";

import { motion } from "framer-motion";
import { useT } from "@/hooks/useTranslation";

export function LiveColorDisplay({ hex }: { hex: string }) {
  const t = useT();
  return (
    <div className="flex items-center gap-4 p-4 bg-white/50 rounded-xl max-sm:flex-col max-sm:text-center">
      <motion.div
        className="w-16 h-16 rounded-full border-2 border-black/10 shrink-0"
        animate={{ backgroundColor: hex }}
        transition={{ duration: 2, ease: "easeOut" }}
      />
      <div>
        <div className="text-lg font-medium font-mono text-black/70">{hex}</div>
        <div className="text-[11px] text-black/40 mt-0.5">{t("skyColorNow")}</div>
      </div>
    </div>
  );
}
