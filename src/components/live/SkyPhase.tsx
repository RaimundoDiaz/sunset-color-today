import type { SkyPhase as SkyPhaseType } from "@/types";

export function SkyPhase({ phase }: { phase: SkyPhaseType }) {
  return (
    <div className="text-center mb-4 px-4 py-3 bg-white/50 rounded-xl">
      <div className="text-base font-medium text-black/80 mb-0.5">
        {phase.icon} {phase.name}
      </div>
      <div className="text-xs font-light text-black/45">{phase.desc}</div>
    </div>
  );
}
