"use client";

import { useState } from "react";
import { useT } from "@/hooks/useTranslation";

function CopyButton({ text }: { text: string }) {
  const t = useT();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  };

  return (
    <button
      onClick={handleCopy}
      className="bg-black/[0.06] border border-black/10 text-black/50 px-2 py-0.5 rounded-md text-[10px] cursor-pointer ml-2 transition-colors hover:bg-black/10"
    >
      {copied ? t("copied") : t("copy")}
    </button>
  );
}

export function ColorDisplay({
  hex, r, g, b, h, s, l,
}: {
  hex: string; r: number; g: number; b: number;
  h: number; s: number; l: number;
}) {
  return (
    <div className="mb-5 font-mono text-xs space-y-1.5">
      <div className="flex items-center gap-2">
        <span className="font-medium text-sm text-black/75">{hex}</span>
        <CopyButton text={hex} />
      </div>
      <div className="flex items-center justify-between text-black/50">
        <span>rgb({r}, {g}, {b})</span>
        <span>hsl({Math.round(h)}, {Math.round(s)}%, {Math.round(l)}%)</span>
      </div>
    </div>
  );
}
