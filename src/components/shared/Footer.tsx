"use client";

import { useT } from "@/hooks/useTranslation";
import { LocaleToggle } from "./LocaleToggle";

export function Footer({ updateTime }: { updateTime: string }) {
  const t = useT();
  return (
    <div className="flex items-end gap-3">
      <div className="text-left text-[9.8px] font-light text-white/35 leading-[12px]">
        <p>{t("footerData")} {updateTime}</p>
        <p className="text-[#f3f3f3] text-[9.8px]">{t("footerModel")}</p>
      </div>
      <LocaleToggle />
    </div>
  );
}
