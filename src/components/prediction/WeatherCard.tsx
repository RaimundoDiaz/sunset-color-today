export function WeatherCard({
  icon, value, label,
}: {
  icon: string; value: string; label: string;
}) {
  return (
    <div className="bg-white/60 rounded-xl p-3 text-center">
      <div className="text-lg mb-0.5">{icon}</div>
      <div className="text-sm font-medium text-black/80">{value}</div>
      <div className="text-[0.65rem] text-black/40 uppercase tracking-wider mt-0.5">
        {label}
      </div>
    </div>
  );
}
