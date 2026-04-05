import { NextRequest, NextResponse } from "next/server";

// nodejs runtime: NASA POWER can be slow (>30s), edge has 30s limit on Vercel free tier
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  if (!lat || !lon || !start || !end) {
    return NextResponse.json({ error: "Missing lat, lon, start, or end" }, { status: 400 });
  }

  const url =
    `https://power.larc.nasa.gov/api/temporal/hourly/point` +
    `?start=${start}&end=${end}` +
    `&latitude=${lat}&longitude=${lon}` +
    `&community=re&parameters=TO3,TQV&format=json`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      return NextResponse.json({ error: "NASA POWER upstream failed" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800" },
    });
  } catch {
    return NextResponse.json({ error: "NASA POWER request failed" }, { status: 502 });
  }
}
