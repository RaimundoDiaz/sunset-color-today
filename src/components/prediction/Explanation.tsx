export function Explanation({ factors }: { factors: string[] }) {
  return (
    <div className="text-xs leading-relaxed text-white/60 font-light p-4 bg-white/5 rounded-xl border-l-2 border-white/15 backdrop-blur-sm">
      {factors.map((f, i) => (
        <p key={i} className={i > 0 ? "mt-1.5" : ""}>
          {f}
        </p>
      ))}
    </div>
  );
}
