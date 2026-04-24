"use client";

import { useT } from "@/hooks/useTranslation";
import { LocaleToggle } from "./LocaleToggle";

export function Footer({ updateTime }: Readonly<{ updateTime: string }>) {
  const t = useT();
  return (
    <div className="flex flex-col items-start gap-2">
      <LocaleToggle />
      <div className="text-left text-[9.8px] font-light text-white/60 leading-[12px]">
        <p>{t("footerData")} {updateTime}</p>
        <p className="text-[#f3f3f3]/75 text-[9.8px]">{t("footerModel")}</p>
      </div>
    </div>
  );
}
