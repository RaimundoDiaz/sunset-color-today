import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const tz = searchParams.get("tz");

  if (!lat || !lon || !tz) {
    return NextResponse.json({ error: "Missing lat, lon, or tz" }, { status: 400 });
  }

  const url =
    `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}` +
    `&current=pm10,pm2_5,aerosol_optical_depth,dust,uv_index` +
    `&hourly=pm2_5,pm10,aerosol_optical_depth,dust,ozone` +
    `&timezone=${encodeURIComponent(tz)}&forecast_days=1`;

  const res = await fetch(url, { next: { revalidate: 600 } });
  if (!res.ok) {
    return NextResponse.json({ error: "Upstream air quality API failed" }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300" },
  });
}
