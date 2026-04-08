import type { ReactNode } from "react";

export function WeatherCard({
  icon, value, label,
}: {
  icon: ReactNode; value: string; label: string;
}) {
  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-3 text-center">
      <div className="flex justify-center mb-0.5">{icon}</div>
      <div className="text-sm font-medium text-white/90">{value}</div>
      <div className="text-[0.65rem] text-white/40 uppercase tracking-wider mt-0.5">
        {label}
      </div>
    </div>
  );
}
