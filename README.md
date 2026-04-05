# Sunset

Web app that **predicts sunset color** and shows a **live sky** driven by solar position and atmospheric conditions. Built with [Next.js](https://nextjs.org) (App Router) and TypeScript.

## How it works (overview)

Colors are not picked from a fixed palette. A **spectral model** approximates how sunlight passes through the atmosphere, accounting in simplified form for **Rayleigh scattering**, **aerosols** (dust, haze), and **ozone absorption**, among other effects. The spectrum is turned into an on-screen color using **CIE 1931 color-matching functions**—the same idea as in colorimetry and imaging.

For **prediction**, that physical core is combined with weather at sunset time: cloud layers, humidity, visibility, air quality (AOD, particles), and when available **column ozone and water vapor** from satellite-based products. **Heuristics** capture effects such as high clouds acting as a “canvas” versus heavy overcast washing colors out.

The **live** view adjusts to **current solar elevation**: day, golden hour, twilight, and night are handled as distinct regimes, blending the spectral model with transitions toward daytime blue or twilight tones.

**UI language:** copy is available in **English** and **Spanish** (via `translations.ts`). The active locale follows the browser language when possible (`es*` → Spanish, otherwise English). Code comments, identifiers, and this README stay in English.

## External data

Data comes from public APIs (no client-side API key in the typical setup):

- **Open-Meteo** — weather, clouds, visibility, radiation, etc.
- **Open-Meteo Air Quality** — aerosols and related pollutants.
- **NASA POWER** — total column ozone and water vapor when the service responds in time; otherwise estimates are used.
- Optionally **ECMWF via Open-Meteo** for finer water vapor.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Other useful commands:

```bash
npm run build    # production build
npm run test:run # tests (Vitest)
```

## Deploy

Any Node.js host that supports Next.js works; [Vercel](https://vercel.com) is a common choice. See the [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for details.
