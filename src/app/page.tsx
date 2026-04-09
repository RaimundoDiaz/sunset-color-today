"use client";

import dynamic from "next/dynamic";

const SunsetApp = dynamic(
  () => import("@/components/SunsetApp").then((m) => m.SunsetApp),
  { ssr: false },
);

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Sunset",
  description:
    "Predict today's sunset color using a physics-based spectral model (Rayleigh, Mie, Chappuis, CIE 1931) with live weather data for 28 cities worldwide.",
  url: "https://sunset-app-pied.vercel.app",
  applicationCategory: "WeatherApplication",
  operatingSystem: "Any",
  inLanguage: ["en", "es"],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Person",
    name: "Raimundo Díaz",
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SunsetApp />
    </>
  );
}
