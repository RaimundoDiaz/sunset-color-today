import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "700"],
});

const SITE_URL = "https://www.sunsetcolor.today";
const SITE_NAME = "Sunset";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: "Sunset — Today's Sunset Color | Color del Atardecer",
    template: "%s · Sunset",
  },
  description:
    "Predict today's sunset color with a physics-based spectral model (Rayleigh, Mie, Chappuis, CIE 1931) and live weather data for 28 cities worldwide. Predice el color del atardecer de hoy.",
  keywords: [
    "sunset color",
    "sunset prediction",
    "today's sunset",
    "sunset forecast",
    "live sky color",
    "sunset tonight",
    "Rayleigh scattering",
    "Mie scattering",
    "spectral model",
    "atmospheric optics",
    "color del atardecer",
    "predicción atardecer",
    "atardecer hoy",
    "cielo en vivo",
  ],
  authors: [{ name: "Raimundo Díaz", url: "https://github.com/RaimundoDiaz" }],
  creator: "Raimundo Díaz",
  publisher: "Raimundo Díaz",
  category: "weather",
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      es: "/",
      "x-default": "/",
    },
  },
  openGraph: {
    title: "Sunset — Today's Sunset Color",
    description:
      "Real-time spectral model: Rayleigh + Mie + Chappuis + CIE 1931. Sunset prediction and live sky color for 28 cities worldwide.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    alternateLocale: ["es_ES", "es_CL"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
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
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  // verification: {
  //   // Paste the content="" value from Google Search Console's HTML tag method here
  //   google: "PASTE_SEARCH_CONSOLE_CODE_HERE",
  // },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1a0533" },
    { media: "(prefers-color-scheme: dark)", color: "#1a0533" },
  ],
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-dvh" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
