import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Sunset — Today's sunset color",
  description:
    "Predict today's sunset color using a physics-based spectral model (Rayleigh + Mie + Chappuis + CIE 1931) with live weather and air-quality data.",
  openGraph: {
    title: "Sunset — Today's sunset color",
    description:
      "Real-time spectral model: Rayleigh + Mie + Chappuis + CIE 1931",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-dvh">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
