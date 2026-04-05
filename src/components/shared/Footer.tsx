"use client";

import { useT } from "@/hooks/useTranslation";

export function Footer({ updateTime }: { updateTime: string }) {
  const t = useT();
  return (
    <div className="text-center mt-6 text-[11px] font-light text-black/35">
      <p>{t("footerData")} {updateTime}</p>
      <p className="mt-0.5 text-black/25">{t("footerModel")}</p>
    </div>
  );
}
