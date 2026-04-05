"use client";

import { motion } from "framer-motion";
import type { TimelineStop } from "@/types";

export function SunsetGradient({
  timeline,
  peak,
}: {
  timeline: TimelineStop[];
  peak: TimelineStop;
}) {
  if (timeline.length === 0) return null;

  // Build CSS gradient from timeline stops
  const gradientStops = timeline
    .map((s, i) => `${s.hex} ${(i / (timeline.length - 1)) * 100}%`)
    .join(", ");

  return (
    <motion.div
      className="mb-5"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Gradient bar */}
      <div
        className="w-full h-10 rounded-xl overflow-hidden shadow-inner"
        style={{ background: `linear-gradient(to right, ${gradientStops})` }}
      />

      {/* Labels */}
      <div className="flex justify-between mt-2 text-[10px] text-black/35 font-light">
        <span>{timeline[0].elevation.toFixed(0)}°</span>
        <span className="font-medium text-black/60">
          Peak: {peak.hex}
          <span className="ml-2 text-black/35">
            rgb({peak.r}, {peak.g}, {peak.b})
          </span>
        </span>
        <span>{timeline[timeline.length - 1].elevation.toFixed(0)}°</span>
      </div>
    </motion.div>
  );
}
