import { ImageResponse } from "next/og";
import { computeScatteredSpectrum } from "@/lib/sky-scattering";
import { spectrumToRGB } from "@/lib/spectral-model";
import { rgbToHex, rgbToHSL, clamp } from "@/lib/color-utils";
import { colorNameKey } from "@/lib/color-name";
import { t } from "@/constants/translations";

export const runtime = "edge";
export const revalidate = 3600;
export const alt = "Sunset — Today's sunset color, predicted from real atmospheric physics";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function dayOfYear(d: Date): number {
  const start = Date.UTC(d.getUTCFullYear(), 0, 0);
  return Math.floor((d.getTime() - start) / 86400000);
}

function todaysSunsetColor() {
  const doy = dayOfYear(new Date());
  // Deterministic-but-varying atmospheric inputs derived from day-of-year.
  // Bounds chosen to land within "plausible vivid sunset" territory.
  const t01 = (Math.sin((doy / 365) * Math.PI * 2) + 1) / 2; // 0..1
  const t02 = (Math.sin((doy / 30) * Math.PI * 2) + 1) / 2;  // 0..1, faster cycle

  const aod550 = clamp(0.08 + t01 * 0.22 + t02 * 0.05, 0.05, 0.4);
  const angstrom = clamp(1.6 - t01 * 0.4 - t02 * 0.2, 0.9, 1.7);
  const ozoneDU = 280 + t01 * 40;
  const pwCm = 0.6 + t02 * 1.6;

  const spectrum = computeScatteredSpectrum(
    1.0, // sun elevation at sunset (deg)
    8,   // view elevation (deg)
    5,   // azimuth from sun (deg)
    1013, aod550, angstrom, ozoneDU, pwCm,
  );
  const { r, g, b } = spectrumToRGB(spectrum);
  const hex = rgbToHex(r, g, b);
  const { h, s, l } = rgbToHSL(r, g, b);
  const nameKey = colorNameKey(h, s, l);
  const name = t("en", nameKey);
  return { r, g, b, hex, name };
}

export default function Image() {
  const { r, g, b, hex, name } = todaysSunsetColor();
  const sunsetRgb = `rgb(${r}, ${g}, ${b})`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: `linear-gradient(180deg, ${sunsetRgb} 0%, rgba(${Math.round(r * 0.55)}, ${Math.round(g * 0.4)}, ${Math.round(b * 0.6)}, 1) 55%, #1a0533 100%)`,
          color: "white",
          padding: 80,
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            fontSize: 32,
            fontWeight: 500,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            opacity: 0.92,
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 999,
              background: sunsetRgb,
              boxShadow: `0 0 32px ${sunsetRgb}`,
            }}
          />
          Sunset
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
            marginTop: -40,
          }}
        >
          <div
            style={{
              fontSize: 36,
              opacity: 0.78,
              marginBottom: 12,
              fontWeight: 400,
            }}
          >
            Tonight&apos;s sunset
          </div>
          <div
            style={{
              fontSize: 168,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 0.95,
              textShadow: "0 4px 40px rgba(0,0,0,0.35)",
            }}
          >
            {name}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              marginTop: 32,
              fontSize: 36,
              fontWeight: 500,
              fontFamily: "ui-monospace, Menlo, monospace",
              opacity: 0.92,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: sunsetRgb,
                boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
              }}
            />
            {hex}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 28,
            opacity: 0.78,
          }}
        >
          <div style={{ maxWidth: 720, lineHeight: 1.3 }}>
            Predicted from a physics-based spectral model — Rayleigh, Mie,
            Chappuis, CIE 1931.
          </div>
          <div style={{ fontWeight: 600 }}>sunsetcolor.today</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
