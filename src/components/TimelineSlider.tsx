"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { TimelineStop } from "@/types";

interface TimelineSliderProps {
  timeline: TimelineStop[];
  sunsetTime: string;
  peak: TimelineStop;
}

/**
 * Slider uses its own T config — same 22s duration as AtmosphericBackground
 * (so they sync at every loop boundary) but with linear ease and a single
 * forward sweep so the handle moves at constant velocity. The bg keeps its
 * easeInOut/keyframed motion for natural atmospheric flow.
 */
const T = {
  duration: 22,
  repeat: Infinity,
  ease: "linear" as const,
  // 0 → 0.94 forward sweep at constant velocity. 0.94 → 1 fast loop-back.
  times: [0, 0.94, 1],
};

/** Sun descends ~0.25°/min near horizon → 1° = 4 min */
function computeTimeLabel(sunsetIso: string, elevation: number): string {
  const sunsetDate = new Date(sunsetIso);
  const minutesFromSunset = -elevation * 4;
  const time = new Date(sunsetDate.getTime() + minutesFromSunset * 60000);
  return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
}

export function TimelineSlider({ timeline, sunsetTime, peak }: Readonly<TimelineSliderProps>) {
  const len = timeline.length;

  const { gradientStr, startPct, endPct, startElev, endElev, initialLabel } = useMemo(() => {
    if (len < 3) {
      return {
        gradientStr: "",
        startPct: 0,
        endPct: 0,
        startElev: 0,
        endElev: 0,
        initialLabel: "--:--",
      };
    }
    // Sweep across the full timeline (0% to 100%) so the handle actually
    // touches both ends of the visible track.
    const startIdx = 0;
    const endIdx = len - 1;
    return {
      gradientStr: timeline
        .map((s, i) => `${s.hex} ${((i / (len - 1)) * 100).toFixed(1)}%`)
        .join(", "),
      startPct: 0,
      endPct: 100,
      startElev: timeline[startIdx].elevation,
      endElev: timeline[endIdx].elevation,
      initialLabel: computeTimeLabel(sunsetTime, timeline[startIdx].elevation),
    };
    // peak is intentionally not part of the deps — slider sweeps linearly
    // over the whole window, so peak doesn't influence keyframes.
  }, [timeline, sunsetTime, len]);

  const [label, setLabel] = useState(initialLabel);

  if (len < 3) return null;

  // Forward sweep then fast loop-back. 3 keyframes only.
  const sharedAnimate = {
    left: [`${startPct}%`, `${endPct}%`, `${startPct}%`],
    opacity: [1, 0.96, 1],
  };
  const span = endPct - startPct;
  const elevSpan = endElev - startElev;

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-20 w-[80vw] max-w-[1000px] hidden md:block">
      {/* Time label — follows the handle */}
      <motion.p
        className="absolute -top-10 text-center text-white font-semibold text-[20px] whitespace-nowrap -translate-x-1/2"
        animate={sharedAnimate}
        transition={T}
        onUpdate={(latest) => {
          const leftStr = typeof latest.left === "string" ? latest.left : `${latest.left}`;
          const currentPct = parseFloat(leftStr);
          const t = span === 0 ? 0 : Math.min(1, Math.max(0, (currentPct - startPct) / span));
          const elev = startElev + t * elevSpan;
          setLabel(computeTimeLabel(sunsetTime, elev));
        }}
      >
        {label}
      </motion.p>

      {/* Gradient line */}
      <motion.div
        className="h-px w-full rounded-full"
        style={{ background: `linear-gradient(to right, ${gradientStr})` }}
        initial={{ opacity: 0, scaleX: 0.8 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
        aria-label="Sunset color timeline"
      />

      {/* Handle — same animate prop as label so they stay glued together */}
      <motion.div
        className="absolute top-1/2 w-[17px] h-[17px] rounded-full border border-white/80 -translate-x-1/2 -translate-y-1/2 bg-white"
        animate={sharedAnimate}
        transition={T}
        aria-hidden
      />
    </div>
  );
}
