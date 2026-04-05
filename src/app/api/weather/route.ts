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
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,relative_humidity_2m,cloud_cover,visibility,weather_code,wind_speed_10m,pressure_msl,dew_point_2m` +
    `&hourly=cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,relative_humidity_2m,visibility,temperature_2m,dew_point_2m,pressure_msl,weather_code,wind_speed_10m,direct_radiation,diffuse_radiation` +
    `&daily=sunset,sunrise,uv_index_max` +
    `&timezone=${encodeURIComponent(tz)}&forecast_days=1`;

  const res = await fetch(url, { next: { revalidate: 600 } });
  if (!res.ok) {
    return NextResponse.json({ error: "Upstream weather API failed" }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300" },
  });
}
