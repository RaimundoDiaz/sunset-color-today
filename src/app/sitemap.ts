import type { MetadataRoute } from "next";

const SITE_URL = "https://www.sunsetcolor.today";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
      alternates: {
        languages: {
          en: `${SITE_URL}/`,
          es: `${SITE_URL}/`,
          "x-default": `${SITE_URL}/`,
        },
      },
    },
  ];
}
