export function ErrorBanner({ warnings }: { warnings: string[] }) {
  if (warnings.length === 0) return null;

  return (
    <div className="bg-red-500/15 border border-red-400/30 rounded-xl px-4 py-3 text-sm text-red-200 mb-4">
      {warnings.join(" ")}
    </div>
  );
}
