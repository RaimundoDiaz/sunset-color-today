import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

// Approximate visitor location from Vercel's IP geolocation headers.
// No browser permission needed; city-level accuracy is enough for a sunset.
// Headers are absent in local dev, in which case we return 204.
export async function GET(req: NextRequest) {
  const h = req.headers;
  const lat = parseFloat(h.get("x-vercel-ip-latitude") ?? "");
  const lon = parseFloat(h.get("x-vercel-ip-longitude") ?? "");
  const tz = h.get("x-vercel-ip-timezone");

  if (!Number.isFinite(lat) || !Number.isFinite(lon) || !tz) {
    return new NextResponse(null, { status: 204, headers: { "Cache-Control": "private, no-store" } });
  }

  // City is URL-encoded by Vercel (e.g. "S%C3%A3o%20Paulo")
  const city = h.get("x-vercel-ip-city");
  return NextResponse.json(
    {
      name: city ? decodeURIComponent(city) : null,
      countryCode: h.get("x-vercel-ip-country"),
      lat,
      lon,
      tz,
    },
    // Per-visitor response — must never be shared by the CDN
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
