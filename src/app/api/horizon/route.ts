import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const MAX_POINTS = 5;

// Cloud cover at several points along the sunset direction (one Open-Meteo call).
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lats = searchParams.get("lats");
  const lons = searchParams.get("lons");
  const tz = searchParams.get("tz");

  if (!lats || !lons || !tz) {
    return NextResponse.json({ error: "Missing lats, lons, or tz" }, { status: 400 });
  }
  const n = lats.split(",").length;
  if (n !== lons.split(",").length || n > MAX_POINTS) {
    return NextResponse.json({ error: "Invalid point list" }, { status: 400 });
  }

  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(lats)}&longitude=${encodeURIComponent(lons)}` +
    `&hourly=cloud_cover_low,cloud_cover_mid,weather_code` +
    `&timezone=${encodeURIComponent(tz)}&forecast_days=1`;

  const res = await fetch(url, { next: { revalidate: 600 } });
  if (!res.ok) {
    return NextResponse.json({ error: "Upstream horizon API failed" }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300" },
  });
}
