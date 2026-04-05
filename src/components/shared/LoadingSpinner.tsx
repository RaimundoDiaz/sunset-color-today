"use client";

import { useT } from "@/hooks/useTranslation";

export function LoadingSpinner({ message }: { message?: string }) {
  const t = useT();
  return (
    <div className="text-center py-15">
      <div className="w-10 h-10 border-3 border-black/10 border-t-black/50 rounded-full animate-spin mx-auto mb-4" />
      <p className="text-black/40">{message ?? t("loadingData")}</p>
    </div>
  );
}
