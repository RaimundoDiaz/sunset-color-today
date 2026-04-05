export function Explanation({ factors }: { factors: string[] }) {
  return (
    <div className="text-xs leading-relaxed text-black/50 font-light p-4 bg-white/50 rounded-xl border-l-2 border-black/10">
      {factors.map((f, i) => (
        <p key={i} className={i > 0 ? "mt-1.5" : ""}>
          {f}
        </p>
      ))}
    </div>
  );
}
