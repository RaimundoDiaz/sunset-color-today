"use client";

import { motion } from "framer-motion";
import type { TimelineStop } from "@/types";

interface TimelineSliderProps {
  timeline: TimelineStop[];
  sunsetTime: string;
}

function computeTimeLabel(sunsetIso: string, elevation: number): string {
  const sunsetDate = new Date(sunsetIso);
  const minutesFromSunset = -elevation * 4;
  const time = new Date(sunsetDate.getTime() + minutesFromSunset * 60000);
  return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
}

export function TimelineSlider({ timeline, sunsetTime }: TimelineSliderProps) {
  const gradientStr = timeline.map((s, i) => {
    const pct = (i / (timeline.length - 1)) * 100;
    return `${s.hex} ${pct.toFixed(1)}%`;
  }).join(", ");

  const midIndex = Math.floor(timeline.length / 2);
  const currentStop = timeline[midIndex];
  const timeLabel = currentStop
    ? computeTimeLabel(sunsetTime, currentStop.elevation)
    : "--:--";

  if (timeline.length < 3) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 w-[80vw] max-w-[900px] hidden md:block">
      {/* Time label */}
      <motion.p
        className="text-center text-white font-semibold text-[20px] mb-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        {timeLabel}
      </motion.p>

      {/* Color bar */}
      <motion.div
        className="h-[3px] rounded-full"
        style={{ background: `linear-gradient(to right, ${gradientStr})` }}
        initial={{ opacity: 0, scaleX: 0.8 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
        aria-label="Sunset color timeline"
      />
    </div>
  );
}
