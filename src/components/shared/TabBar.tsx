"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSunsetStore } from "@/store/useSunsetStore";
import { useT } from "@/hooks/useTranslation";

export function TabBar() {
  const activeTab = useSunsetStore((s) => s.activeTab);
  const setTab = useSunsetStore((s) => s.setTab);
  const t = useT();

  return (
    <Tabs
      value={activeTab}
      onValueChange={(v) => setTab(v as "prediction" | "live")}
      className="mb-5"
    >
      <TabsList className="w-full bg-black/[0.06] rounded-xl p-1 h-auto">
        <TabsTrigger
          value="prediction"
          className="flex-1 rounded-[9px] py-2 text-sm font-medium text-black/50 data-[state=active]:bg-white data-[state=active]:text-black/85 data-[state=active]:shadow-sm transition-all cursor-pointer"
        >
          {t("prediction")}
        </TabsTrigger>
        <TabsTrigger
          value="live"
          className="flex-1 rounded-[9px] py-2 text-sm font-medium text-black/50 data-[state=active]:bg-white data-[state=active]:text-black/85 data-[state=active]:shadow-sm transition-all cursor-pointer"
        >
          {t("live")}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
