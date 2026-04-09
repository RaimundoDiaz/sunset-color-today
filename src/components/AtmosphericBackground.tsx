"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { TimelineStop } from "@/types";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface AtmosphericBackgroundProps {
  timeline: TimelineStop[];
  peak: TimelineStop;
  quality: number;
  isLoading: boolean;
}

/* ------------------------------------------------------------------ */
/*  RGB helpers — mix in RGB space only (no HSL = no grays)            */
/* ------------------------------------------------------------------ */

type RGB = [number, number, number];

function mix(a: RGB, b: RGB, t: number): RGB {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

function rgb(c: RGB) { return `${c[0]},${c[1]},${c[2]}`; }

/* Reference tones */
const WARM_CREAM: RGB = [250, 235, 210];
const PINK_BASE: RGB  = [230, 150, 180];
const LAVENDER: RGB   = [195, 170, 220];
const DEEP_LAV: RGB   = [130, 120, 185];

/* ------------------------------------------------------------------ */
/*  Pick 4 stops from the timeline → 5 gradient colors per phase      */
/* ------------------------------------------------------------------ */

interface SkyColors {
  top: RGB; s22: RGB; mid: RGB; s74: RGB; bot: RGB;
}

function buildSkyColors(stop: TimelineStop, isTwilight: boolean): SkyColors {
  const c: RGB = [stop.r, stop.g, stop.b];
  return {
    top: mix(c, WARM_CREAM, 0.70),
    s22: mix(c, WARM_CREAM, 0.35),
    mid: c,
    s74: mix(c, PINK_BASE, isTwilight ? 0.55 : 0.40),
    bot: mix(c, isTwilight ? DEEP_LAV : LAVENDER, isTwilight ? 0.60 : 0.50),
  };
}

function pickStops(timeline: TimelineStop[], peak: TimelineStop) {
  const len = timeline.length;
  if (len < 4) return { p1: peak, p2: peak, p3: peak, p4: peak };
  return {
    p1: timeline[Math.floor(len * 0.10)],
    p2: timeline[Math.floor(len * 0.35)],
    p3: peak,
    p4: timeline[Math.min(Math.floor(len * 0.85), len - 1)],
  };
}

/* ------------------------------------------------------------------ */
/*  Shared transition — exact copy from Figma Make                     */
/* ------------------------------------------------------------------ */

const T = {
  duration: 22,
  repeat: Infinity,
  ease: "easeInOut" as const,
  times: [0, 0.28, 0.56, 0.84, 1],
};

/* ------------------------------------------------------------------ */
/*  Grain texture                                                      */
/* ------------------------------------------------------------------ */

const GRAIN_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function AtmosphericBackground({
  timeline,
  peak,
  isLoading,
}: AtmosphericBackgroundProps) {
  /* ---- Derive 4 sky palettes from timeline data ---- */
  const sky = useMemo(() => {
    const { p1, p2, p3, p4 } = pickStops(timeline, peak);
    const s1 = buildSkyColors(p1, false);
    const s2 = buildSkyColors(p2, false);
    const s3 = buildSkyColors(p3, false);
    const s4 = buildSkyColors(p4, true);
    // phase 5 = phase 1 for loop
    return [s1, s2, s3, s4, s1];
  }, [timeline, peak]);

  /* 5 sky gradient strings */
  const skyGrads = sky.map(
    (s) => `linear-gradient(to bottom, ${rgb(s.top)} 0%, ${rgb(s.s22)} 22%, ${rgb(s.mid)} 48%, ${rgb(s.s74)} 74%, ${rgb(s.bot)} 100%)`
      .replace(/(\d+,\d+,\d+)/g, "rgb($1)") // noop safety
  );
  // Actually let me fix this — the template already doesn't have rgb() wrapper
  const skyGradients = sky.map(
    (s) => `linear-gradient(to bottom, rgb(${rgb(s.top)}) 0%, rgb(${rgb(s.s22)}) 22%, rgb(${rgb(s.mid)}) 48%, rgb(${rgb(s.s74)}) 74%, rgb(${rgb(s.bot)}) 100%)`
  );

  /* Horizon/scatter base color per phase */
  const hc = sky.map((s) => s.mid);

  /* Sun warm color per phase — mix mid with cream */
  const sunWarm = sky.map((s) => mix(s.mid, WARM_CREAM, 0.65));
  const sunHot  = sky.map((s) => mix(s.mid, [255, 245, 220] as RGB, 0.80));

  if (isLoading) {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: [0.6, 0.8, 0.6] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ background: "linear-gradient(to bottom, #1a1a2e, #2d1b3d, #1a1a2e)" }}
        />
      </div>
    );
  }

  /* ================================================================ */
  /*  Render — exact same layer structure, positions, opacities,      */
  /*  and timing as Figma Make, only colors are dynamic               */
  /* ================================================================ */
  return (
    <div className="absolute inset-0 overflow-hidden">

      {/* 1. Base sky */}
      <motion.div
        className="absolute inset-0"
        animate={{ background: skyGradients }}
        transition={T}
      />

      {/* 2. Upper atmosphere soft wash */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            `radial-gradient(ellipse at 50% 22%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 28%, transparent 62%)`,
            `radial-gradient(ellipse at 50% 24%, rgba(${rgb(sunWarm[1])},0.10) 0%, rgba(${rgb(sunWarm[1])},0.03) 28%, transparent 64%)`,
            `radial-gradient(ellipse at 50% 24%, rgba(${rgb(sunWarm[2])},0.08) 0%, rgba(${rgb(sunWarm[2])},0.03) 28%, transparent 66%)`,
            `radial-gradient(ellipse at 50% 24%, rgba(235,220,255,0.08) 0%, rgba(235,220,255,0.03) 30%, transparent 68%)`,
            `radial-gradient(ellipse at 50% 22%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 28%, transparent 62%)`,
          ],
          opacity: [0.9, 0.95, 0.9, 0.85, 0.9],
        }}
        transition={T}
      />

      {/* 3. Horizon band */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-[42%]"
        animate={{
          background: [
            `linear-gradient(to top, rgba(${rgb(hc[0])},0.30) 0%, rgba(${rgb(hc[0])},0.14) 24%, rgba(${rgb(hc[0])},0.05) 46%, transparent 82%)`,
            `linear-gradient(to top, rgba(${rgb(hc[1])},0.34) 0%, rgba(${rgb(hc[1])},0.16) 24%, rgba(${rgb(hc[1])},0.05) 46%, transparent 82%)`,
            `linear-gradient(to top, rgba(${rgb(hc[2])},0.28) 0%, rgba(${rgb(hc[2])},0.14) 24%, rgba(${rgb(hc[2])},0.04) 46%, transparent 82%)`,
            `linear-gradient(to top, rgba(${rgb(hc[3])},0.22) 0%, rgba(${rgb(hc[3])},0.10) 24%, rgba(${rgb(hc[3])},0.04) 46%, transparent 82%)`,
            `linear-gradient(to top, rgba(${rgb(hc[0])},0.30) 0%, rgba(${rgb(hc[0])},0.14) 24%, rgba(${rgb(hc[0])},0.05) 46%, transparent 82%)`,
          ],
        }}
        transition={T}
      />

      {/* 4. Large atmospheric scattering field */}
      <motion.div
        className="absolute inset-x-[-8%] bottom-[-6%] h-[58%]"
        style={{ filter: "blur(70px)" }}
        animate={{
          background: [
            `radial-gradient(ellipse at 50% 88%, rgba(${rgb(hc[0])},0.42) 0%, rgba(${rgb(hc[0])},0.16) 34%, transparent 72%)`,
            `radial-gradient(ellipse at 50% 90%, rgba(${rgb(hc[1])},0.42) 0%, rgba(${rgb(hc[1])},0.16) 34%, transparent 74%)`,
            `radial-gradient(ellipse at 50% 92%, rgba(${rgb(hc[2])},0.34) 0%, rgba(${rgb(hc[2])},0.14) 36%, transparent 76%)`,
            `radial-gradient(ellipse at 50% 95%, rgba(${rgb(hc[3])},0.30) 0%, rgba(${rgb(hc[3])},0.12) 38%, transparent 78%)`,
            `radial-gradient(ellipse at 50% 88%, rgba(${rgb(hc[0])},0.42) 0%, rgba(${rgb(hc[0])},0.16) 34%, transparent 72%)`,
          ],
          opacity: [0.85, 1, 1, 0.9, 0.85],
          scaleX: [1.02, 1.04, 1.03, 1.01, 1.02],
        }}
        transition={T}
      />

      {/* 5. Sun system */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Wide glow */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 rounded-full"
          style={{ width: 760, height: 760, filter: "blur(90px)" }}
          animate={{
            top: ["18%", "34%", "54%", "86%", "18%"],
            background: [
              `radial-gradient(circle, rgba(${rgb(sunWarm[0])},0.28) 0%, rgba(${rgb(sunWarm[0])},0.12) 34%, transparent 70%)`,
              `radial-gradient(circle, rgba(${rgb(sunWarm[1])},0.28) 0%, rgba(${rgb(sunWarm[1])},0.12) 34%, transparent 72%)`,
              `radial-gradient(circle, rgba(${rgb(sunWarm[2])},0.24) 0%, rgba(${rgb(sunWarm[2])},0.10) 36%, transparent 74%)`,
              `radial-gradient(circle, rgba(217,153,210,0.16) 0%, rgba(217,153,210,0.07) 38%, transparent 76%)`,
              `radial-gradient(circle, rgba(${rgb(sunWarm[0])},0.28) 0%, rgba(${rgb(sunWarm[0])},0.12) 34%, transparent 70%)`,
            ],
            opacity: [0.7, 0.85, 0.9, 0.35, 0.7],
          }}
          transition={T}
        />

        {/* Main sun */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 rounded-full"
          style={{ width: 250, height: 250, filter: "blur(16px)" }}
          animate={{
            top: ["30%", "46%", "64%", "92%", "30%"],
            background: [
              `radial-gradient(circle, rgba(${rgb(sunHot[0])},0.98) 0%, rgba(${rgb(sunWarm[0])},0.95) 42%, rgba(${rgb(hc[0])},0.72) 82%, rgba(${rgb(hc[0])},0.10) 100%)`,
              `radial-gradient(circle, rgba(${rgb(sunHot[1])},0.98) 0%, rgba(${rgb(sunWarm[1])},0.94) 42%, rgba(${rgb(hc[1])},0.74) 82%, rgba(${rgb(hc[1])},0.10) 100%)`,
              `radial-gradient(circle, rgba(${rgb(sunHot[2])},0.96) 0%, rgba(${rgb(sunWarm[2])},0.92) 40%, rgba(${rgb(hc[2])},0.72) 82%, rgba(${rgb(hc[2])},0.08) 100%)`,
              `radial-gradient(circle, rgba(248,220,228,0.28) 0%, rgba(220,168,210,0.18) 42%, rgba(180,145,215,0.08) 82%, rgba(180,145,215,0) 100%)`,
              `radial-gradient(circle, rgba(${rgb(sunHot[0])},0.98) 0%, rgba(${rgb(sunWarm[0])},0.95) 42%, rgba(${rgb(hc[0])},0.72) 82%, rgba(${rgb(hc[0])},0.10) 100%)`,
            ],
            opacity: [1, 1, 0.96, 0.10, 1],
            scale: [1, 1.02, 1, 0.86, 1],
          }}
          transition={T}
        />

        {/* Core */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 rounded-full"
          style={{ width: 120, height: 120, filter: "blur(8px)" }}
          animate={{
            top: ["39%", "55%", "73%", "98%", "39%"],
            background: [
              `radial-gradient(circle, rgba(255,252,236,1) 0%, rgba(${rgb(sunWarm[0])},0.95) 52%, rgba(${rgb(hc[0])},0.62) 100%)`,
              `radial-gradient(circle, rgba(255,245,220,1) 0%, rgba(${rgb(sunWarm[1])},0.94) 52%, rgba(${rgb(hc[1])},0.60) 100%)`,
              `radial-gradient(circle, rgba(255,236,214,0.95) 0%, rgba(${rgb(sunWarm[2])},0.88) 52%, rgba(${rgb(hc[2])},0.56) 100%)`,
              `radial-gradient(circle, rgba(245,226,238,0.12) 0%, rgba(220,180,220,0.10) 60%, rgba(190,165,225,0.05) 100%)`,
              `radial-gradient(circle, rgba(255,252,236,1) 0%, rgba(${rgb(sunWarm[0])},0.95) 52%, rgba(${rgb(hc[0])},0.62) 100%)`,
            ],
            opacity: [1, 1, 0.92, 0.04, 1],
          }}
          transition={T}
        />
      </div>

      {/* 6. Post-sunset violet field */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ filter: "blur(50px)" }}
        animate={{
          background: [
            `radial-gradient(ellipse at 50% 72%, rgba(${rgb(hc[0])},0.05) 0%, rgba(${rgb(hc[0])},0.03) 26%, transparent 64%)`,
            `radial-gradient(ellipse at 50% 76%, rgba(${rgb(hc[1])},0.06) 0%, rgba(${rgb(hc[1])},0.03) 28%, transparent 66%)`,
            `radial-gradient(ellipse at 50% 80%, rgba(${rgb(hc[2])},0.06) 0%, rgba(${rgb(hc[2])},0.03) 30%, transparent 68%)`,
            `radial-gradient(ellipse at 50% 78%, rgba(160,125,215,0.16) 0%, rgba(160,125,215,0.08) 34%, transparent 72%)`,
            `radial-gradient(ellipse at 50% 72%, rgba(${rgb(hc[0])},0.05) 0%, rgba(${rgb(hc[0])},0.03) 26%, transparent 64%)`,
          ],
          opacity: [0.3, 0.4, 0.45, 0.75, 0.3],
        }}
        transition={T}
      />

      {/* 7. Grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-overlay"
        style={{ backgroundImage: GRAIN_BG, backgroundRepeat: "repeat", backgroundSize: "200px 200px" }}
      />

      {/* 8. Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(255,255,255,0) 40%, rgba(90,50,110,0.05) 100%)" }}
      />
    </div>
  );
}
