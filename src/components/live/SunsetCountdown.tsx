"use client";

import { motion } from "framer-motion";

export function SunsetCountdown({
  value,
  label,
  isActive,
}: {
  value: string;
  label: string;
  isActive: boolean;
}) {
  return (
    <motion.div
      className={`text-center mb-4 ${isActive ? "p-3 bg-orange-100 border border-orange-200 rounded-xl" : ""}`}
      animate={isActive ? { opacity: [1, 0.7, 1] } : { opacity: 1 }}
      transition={isActive ? { duration: 2, ease: "easeInOut", repeat: Infinity } : {}}
    >
      <div className="text-xl font-medium text-black/80">{value}</div>
      <div className="text-xs text-black/45 mt-0.5">{label}</div>
    </motion.div>
  );
}
