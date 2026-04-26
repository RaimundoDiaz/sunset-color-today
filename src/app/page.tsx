"use client";

import dynamic from "next/dynamic";

const SunsetApp = dynamic(
  () => import("@/components/SunsetApp").then((m) => m.SunsetApp),
  { ssr: false },
);

const SITE_URL = "https://www.sunsetcolor.today";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Sunset",
  alternateName: "Sunset Color Today",
  description:
    "Predict today's sunset color using a physics-based spectral model (Rayleigh, Mie, Chappuis, CIE 1931) with live weather data for 28 cities worldwide.",
  url: SITE_URL,
  image: `${SITE_URL}/icon.png`,
  applicationCategory: "WeatherApplication",
  operatingSystem: "Any",
  inLanguage: ["en", "es"],
  keywords:
    "sunset color, sunset prediction, sunset forecast, atmospheric optics, Rayleigh scattering, spectral model",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Person",
    name: "Raimundo Díaz",
    url: "https://github.com/RaimundoDiaz",
  },
};

export default function Home() {
  return (
    <>
      <h1 className="sr-only">
        Sunset — Today&apos;s sunset color, predicted from real atmospheric
        physics
      </h1>
      <p className="sr-only">
        Sunset uses a physics-based spectral model (Rayleigh + Mie + Chappuis,
        CIE 1931 → sRGB) combined with live weather and air-quality data to
        predict the color of tonight&apos;s sunset and render a live sky for 28
        cities worldwide. Available in English and Spanish.
      </p>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SunsetApp />
    </>
  );
}
