"use client";

import { useT } from "@/hooks/useTranslation";

export function SunsetTimeRow({ time }: { time: string }) {
  const t = useT();
  return (
    <div className="flex items-center gap-2.5 mb-3 text-base">
      <span className="text-black/50 font-light">{t("sunsetLabel")}</span>
      <span className="font-medium text-lg tracking-wide text-black/85">{time}</span>
    </div>
  );
}
