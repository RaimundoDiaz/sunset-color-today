import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "700"],
});

const SITE_URL = "https://sunset-app-pied.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Sunset — Today's Sunset Color | Color del Atardecer",
    template: "%s | Sunset",
  },
  description:
    "Predict today's sunset color using a physics-based spectral model (Rayleigh, Mie, Chappuis, CIE 1931) with live weather and air-quality data for 28 cities worldwide. Predice el color del atardecer de hoy.",
  keywords: [
    "sunset color",
    "sunset prediction",
    "today's sunset",
    "sunset forecast",
    "live sky color",
    "Rayleigh scattering",
    "spectral model",
    "weather",
    "atardecer",
    "color del atardecer",
    "predicción atardecer",
    "cielo en vivo",
  ],
  authors: [{ name: "Raimundo Díaz" }],
  creator: "Raimundo Díaz",
  openGraph: {
    title: "Sunset — Today's Sunset Color",
    description:
      "Real-time spectral model: Rayleigh + Mie + Chappuis + CIE 1931. Sunset prediction and live sky color for 28 cities worldwide.",
    url: SITE_URL,
    siteName: "Sunset",
    locale: "es_CL",
    alternateLocale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Sunset — Today's Sunset Color",
    description:
      "Predict today's sunset color with real atmospheric physics. 28 cities live.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-dvh" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
