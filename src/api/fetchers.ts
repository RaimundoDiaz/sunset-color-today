export async function fetchWeather(lat: number, lon: number, tz: string) {
  const params = new URLSearchParams({ lat: String(lat), lon: String(lon), tz });
  const res = await fetch(`/api/weather?${params}`);
  if (!res.ok) throw new Error(`Weather API: ${res.status}`);
  return res.json();
}

export async function fetchAirQuality(lat: number, lon: number, tz: string) {
  const params = new URLSearchParams({ lat: String(lat), lon: String(lon), tz });
  const res = await fetch(`/api/air-quality?${params}`);
  if (!res.ok) throw new Error(`Air quality API: ${res.status}`);
  return res.json();
}

export async function fetchNasaPower(lat: number, lon: number) {
  const d = new Date();
  d.setDate(d.getDate() - 2);
  const dateStr = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const params = new URLSearchParams({ lat: String(lat), lon: String(lon), start: dateStr, end: dateStr });
  try {
    const res = await fetch(`/api/nasa-power?${params}`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function fetchEcmwf(lat: number, lon: number, tz: string) {
  const params = new URLSearchParams({ lat: String(lat), lon: String(lon), tz });
  try {
    const res = await fetch(`/api/ecmwf?${params}`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
