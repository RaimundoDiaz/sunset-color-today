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
    `https://api.open-meteo.com/v1/ecmwf?latitude=${lat}&longitude=${lon}` +
    `&hourly=total_column_integrated_water_vapour` +
    `&timezone=${encodeURIComponent(tz)}&forecast_days=1`;

  const res = await fetch(url, { next: { revalidate: 600 } });
  if (!res.ok) {
    return NextResponse.json({ error: "Upstream ECMWF API failed" }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300" },
  });
}
