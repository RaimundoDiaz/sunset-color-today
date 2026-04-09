import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sunset — Today's Sunset Color",
    short_name: "Sunset",
    description:
      "Predict today's sunset color with a physics-based spectral model and live weather data for 28 cities worldwide.",
    start_url: "/",
    display: "standalone",
    background_color: "#1a0533",
    theme_color: "#e8452c",
    lang: "es",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
