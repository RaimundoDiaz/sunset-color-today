"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { TimelineStop } from "@/types";
import { clamp, hslToRgb, rgbToHex } from "@/lib/color-utils";

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
/*  Per-phase derived palette                                          */
/* ------------------------------------------------------------------ */

interface PhasePalette {
  skyGradient: string;
  horizonColor: string;
  scatterColor: string;
  sunGlowColor: string;
  sunCoreColor: string;
  sunInnerColor: string;
  violetWash: string;
}

/* ------------------------------------------------------------------ */
/*  Fallback colors (Figma reference)                                  */
/* ------------------------------------------------------------------ */

const FALLBACK_STOPS: TimelineStop[] = [
  { elevation: 5, r: 246, g: 224, b: 191, hex: "#F6E0BF", h: 30, s: 80, l: 86 },
  { elevation: 3, r: 248, g: 212, b: 162, hex: "#F8D4A2", h: 35, s: 90, l: 80 },
  { elevation: 1, r: 246, g: 199, b: 139, hex: "#F6C78B", h: 34, s: 88, l: 75 },
  { elevation: -1, r: 235, g: 200, b: 193, hex: "#EBC8C1", h: 10, s: 52, l: 84 },
];

const FALLBACK_PEAK: TimelineStop = FALLBACK_STOPS[2];

/* ------------------------------------------------------------------ */
/*  Shared transition config                                           */
/* ------------------------------------------------------------------ */

const TRANSITION = {
  duration: 22,
  repeat: Infinity,
  ease: "easeInOut" as const,
  times: [0, 0.28, 0.56, 0.84, 1],
};

/* ------------------------------------------------------------------ */
/*  Sun vertical positions per phase                                   */
/* ------------------------------------------------------------------ */

const SUN_GLOW_TOPS = ["18%", "34%", "54%", "86%", "18%"];
const SUN_MAIN_TOPS = ["30%", "46%", "64%", "92%", "30%"];
const SUN_CORE_TOPS = ["39%", "55%", "73%", "98%", "39%"];

/* ------------------------------------------------------------------ */
/*  buildAnimationPalette                                              */
/* ------------------------------------------------------------------ */

function buildAnimationPalette(
  timeline: TimelineStop[],
  peak: TimelineStop,
  quality: number,
): PhasePalette[] {
  const satMul = clamp(quality / 80, 0.15, 1.0);

  // Pick 5 phase source stops (phase 4 === phase 0 for looping)
  const useFallback = !timeline || timeline.length < 10;
  const src = useFallback ? FALLBACK_STOPS : timeline;
  const peakStop = useFallback ? FALLBACK_PEAK : peak;

  const phaseStops: TimelineStop[] = useFallback
    ? [src[0], src[1], peakStop, src[3], src[0]]
    : [src[0], src[3], peakStop, src[9], src[0]];

  return phaseStops.map((stop, idx) => {
    const h = stop.h;
    const s = clamp(stop.s * satMul, 0, 100);
    const l = stop.l;

    // --- skyGradient: 5-stop linear-gradient top-to-bottom ---
    const topH = (h + 35) % 360;
    const topS = clamp(s * 0.65, 0, 100);
    const topL = clamp(l - 12, 0, 100);

    const midH = h;
    const midS = s;
    const midL = l;

    const botH = (h + 320) % 360; // shift toward pink/purple
    const botS = clamp(s * 0.8, 0, 100);
    const botL = clamp(l - 5, 0, 100);

    const [topR, topG, topB] = hslToRgb(topH, topS, topL);
    const [midR, midG, midB] = hslToRgb(midH, midS, midL);
    const [botR, botG, botB] = hslToRgb(botH, botS, botL);

    // Intermediate stops for smoother gradient
    const [im1R, im1G, im1B] = hslToRgb(
      (topH + midH) / 2,
      (topS + midS) / 2,
      (topL + midL) / 2,
    );
    const [im2R, im2G, im2B] = hslToRgb(
      (midH + botH) / 2,
      (midS + botS) / 2,
      (midL + botL) / 2,
    );

    const skyGradient = `linear-gradient(to bottom, rgb(${topR},${topG},${topB}) 0%, rgb(${im1R},${im1G},${im1B}) 28%, rgb(${midR},${midG},${midB}) 52%, rgb(${im2R},${im2G},${im2B}) 78%, rgb(${botR},${botG},${botB}) 100%)`;

    // --- horizonColor ---
    const hrzS = clamp(s * 1.15, 0, 100);
    const hrzL = clamp(l - 8, 0, 100);
    const [hrzR, hrzG, hrzB] = hslToRgb(h, hrzS, hrzL);
    const horizonColor = `rgba(${hrzR},${hrzG},${hrzB},0.85)`;

    // --- scatterColor ---
    const scatterColor = `rgba(${stop.r},${stop.g},${stop.b},${idx >= 3 ? 0.3 : 0.4})`;

    // --- sunGlowColor ---
    const glowS = clamp(s - 10, 0, 100);
    const glowL = clamp(l + 25, 0, 100);
    const [glR, glG, glB] = hslToRgb(h, glowS, glowL);
    const sunGlowColor = `rgba(${glR},${glG},${glB},0.28)`;

    // --- sunCoreColor ---
    const coreL = clamp(85 + (idx < 3 ? 5 : 0), 0, 100);
    const [scR, scG, scB] = hslToRgb(h, s, coreL);
    const sunCoreColor = rgbToHex(scR, scG, scB);

    // --- sunInnerColor ---
    const innerL = clamp(95 + (idx < 2 ? 3 : 0), 0, 100);
    const innerS = clamp(s * 0.3, 0, 100);
    const [siR, siG, siB] = hslToRgb(h, innerS, innerL);
    const sunInnerColor = rgbToHex(siR, siG, siB);

    // --- violetWash ---
    const vAlpha = idx >= 3 ? 0.16 : idx >= 2 ? 0.10 : 0.05;
    const [vR, vG, vB] = hslToRgb(270, clamp(s * 0.6, 0, 100), clamp(l * 0.7, 0, 100));
    const violetWash = `rgba(${vR},${vG},${vB},${vAlpha})`;

    return {
      skyGradient,
      horizonColor,
      scatterColor,
      sunGlowColor,
      sunCoreColor,
      sunInnerColor,
      violetWash,
    };
  });
}

/* ------------------------------------------------------------------ */
/*  Grain texture data-URI                                             */
/* ------------------------------------------------------------------ */

const GRAIN_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function AtmosphericBackground({
  timeline,
  peak,
  quality,
  isLoading,
}: AtmosphericBackgroundProps) {
  const palette = useMemo(
    () => buildAnimationPalette(timeline, peak, quality),
    [timeline, peak, quality],
  );

  /* ---------- Loading state ---------- */
  if (isLoading) {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: [0.6, 0.8, 0.6] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{
            background:
              "linear-gradient(to bottom, #1a1a2e, #2d1b3d, #1a1a2e)",
          }}
        />
        {/* Grain */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-overlay"
          style={{
            backgroundImage: GRAIN_BG,
            backgroundRepeat: "repeat",
            backgroundSize: "200px 200px",
          }}
        />
        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255,255,255,0) 40%, rgba(90,50,110,0.05) 100%)",
          }}
        />
      </div>
    );
  }

  /* ---------- Keyframe arrays derived from palette ---------- */
  const skyGradients = palette.map((p) => p.skyGradient);
  const horizonColors = palette.map((p) => p.horizonColor);
  const scatterColors = palette.map((p) => p.scatterColor);
  const sunGlowColors = palette.map((p) => p.sunGlowColor);
  const sunCoreColors = palette.map((p) => p.sunCoreColor);
  const sunInnerColors = palette.map((p) => p.sunInnerColor);
  const violetWashColors = palette.map((p) => p.violetWash);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* ---- 1. Base sky gradient ---- */}
      <motion.div
        className="absolute inset-0"
        animate={{ background: skyGradients }}
        transition={TRANSITION}
      />

      {/* ---- 2. Upper atmosphere wash ---- */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: horizonColors.map(
            (c) =>
              `radial-gradient(ellipse at 50% 0%, ${c} 0%, transparent 70%)`,
          ),
          opacity: [0.85, 0.9, 0.95, 0.88, 0.85],
        }}
        transition={TRANSITION}
      />

      {/* ---- 3. Horizon band ---- */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-[42%]"
        animate={{
          background: horizonColors.map(
            (c) =>
              `linear-gradient(to top, ${c} 0%, transparent 100%)`,
          ),
        }}
        transition={TRANSITION}
      />

      {/* ---- 4. Atmospheric scattering field ---- */}
      <motion.div
        className="absolute inset-x-[-8%] bottom-[-6%] h-[58%]"
        style={{ filter: "blur(70px)" }}
        animate={{
          background: scatterColors.map(
            (c) =>
              `radial-gradient(ellipse at 50% 100%, ${c} 0%, transparent 70%)`,
          ),
          opacity: [0.85, 0.95, 1.0, 0.9, 0.85],
        }}
        transition={TRANSITION}
      />

      {/* ---- 5. Sun system ---- */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Wide glow */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 rounded-full"
          style={{ width: 760, height: 760, filter: "blur(90px)" }}
          animate={{
            top: SUN_GLOW_TOPS,
            background: sunGlowColors.map(
              (c) =>
                `radial-gradient(circle, ${c} 0%, transparent 70%)`,
            ),
            opacity: [0.7, 0.85, 0.9, 0.35, 0.7],
          }}
          transition={TRANSITION}
        />

        {/* Main sun */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 rounded-full"
          style={{ width: 250, height: 250, filter: "blur(16px)" }}
          animate={{
            top: SUN_MAIN_TOPS,
            background: sunCoreColors.map(
              (c) =>
                `radial-gradient(circle, ${c} 0%, transparent 70%)`,
            ),
            opacity: [1, 1, 0.96, 0.1, 1],
            scale: [1, 1.02, 1, 0.86, 1],
          }}
          transition={TRANSITION}
        />

        {/* Core */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 rounded-full"
          style={{ width: 120, height: 120, filter: "blur(8px)" }}
          animate={{
            top: SUN_CORE_TOPS,
            background: sunInnerColors.map(
              (c) =>
                `radial-gradient(circle, ${c} 0%, transparent 70%)`,
            ),
            opacity: [1, 1, 0.92, 0.04, 1],
          }}
          transition={TRANSITION}
        />
      </div>

      {/* ---- 6. Post-sunset violet field ---- */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ filter: "blur(50px)" }}
        animate={{
          background: violetWashColors.map(
            (c) =>
              `radial-gradient(ellipse at 50% 50%, ${c} 0%, transparent 70%)`,
          ),
          opacity: [0.3, 0.4, 0.45, 0.75, 0.3],
        }}
        transition={TRANSITION}
      />

      {/* ---- 7. Grain texture ---- */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage: GRAIN_BG,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
        }}
      />

      {/* ---- 8. Atmospheric vignette ---- */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0) 40%, rgba(90,50,110,0.05) 100%)",
        }}
      />
    </div>
  );
}
