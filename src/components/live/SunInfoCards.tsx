"use client";

import { useT } from "@/hooks/useTranslation";

function InfoCard({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <div className="flex-1 bg-white/60 rounded-xl px-3 py-3 text-center">
      <div className="text-xl mb-1">{icon}</div>
      <div className="text-base font-medium text-black/80">{value}</div>
      <div className="text-[0.65rem] text-black/40 uppercase tracking-wider mt-0.5">{label}</div>
    </div>
  );
}

export function SunInfoCards({
  elevation,
  elevIcon,
  sunsetTime,
  sunriseTime,
}: {
  elevation: number;
  elevIcon: string;
  sunsetTime: string;
  sunriseTime: string;
}) {
  const t = useT();
  return (
    <div className="flex gap-2 mb-4">
      <InfoCard icon={elevIcon} value={`${elevation.toFixed(1)}\u00B0`} label={t("solarElevation")} />
      <InfoCard icon={"\uD83C\uDF05"} value={sunsetTime} label={t("sunsetToday")} />
      <InfoCard icon={"\uD83C\uDF04"} value={sunriseTime} label={t("sunriseToday")} />
    </div>
  );
}
