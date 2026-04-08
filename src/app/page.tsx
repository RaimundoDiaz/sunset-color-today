"use client";

import dynamic from "next/dynamic";

const SunsetApp = dynamic(
  () => import("@/components/SunsetApp").then((m) => m.SunsetApp),
  { ssr: false },
);

export default function Home() {
  return <SunsetApp />;
}
