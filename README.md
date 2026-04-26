<div align="center">

# Sunset

### Predict today's sunset color from real atmospheric physics

<a href="https://www.sunsetcolor.today">
  <img src="https://www.sunsetcolor.today/opengraph-image" alt="Sunset — Today's sunset color, predicted from real atmospheric physics" width="720" />
</a>

<sub>↑ generated daily by the same spectral model as the app — different color every day.</sub>

<p>
  <a href="https://www.sunsetcolor.today"><img src="https://img.shields.io/badge/live-sunsetcolor.today-e8452c?style=flat-square" alt="Live" /></a>
  <img src="https://img.shields.io/badge/Next.js-16-000?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-149eca?style=flat-square&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vitest-3-6E9F18?style=flat-square&logo=vitest&logoColor=white" alt="Vitest" />
  <img src="https://img.shields.io/badge/i18n-EN%20%2F%20ES-7c3aed?style=flat-square" alt="i18n" />
</p>

[**🌐 Try it live**](https://www.sunsetcolor.today) · [Report a bug](https://github.com/RaimundoDiaz/sunset-color-today/issues)

</div>

---

## ✨ What is it?

**Sunset** predicts the color of tonight's sunset from a **physics-based spectral model**, not a palette. It also renders a **live sky** that follows the current solar elevation — day, golden hour, twilight, and night flow naturally as time passes.

> Colors aren't picked from a list. They are computed from how sunlight actually travels through the atmosphere.

## 🔬 The science (short version)

The core is a **wavelength-resolved transmission model** that simulates sunlight at 19 wavelengths between 380–720 nm passing through a path of atmosphere, accounting for:

| Effect | Model |
|---|---|
| 🌌 **Rayleigh scattering** | molecular scattering ∝ 1/λ⁴ — why the sky is blue |
| 💨 **Mie / aerosol scattering** | dust, haze, smoke (Ångström exponent + AOD from air-quality data) |
| 🍃 **Ozone (Chappuis)** | absorption band 500–700 nm — gives twilight its violet-blue |
| 💧 **Water vapor** | NIR absorption from NASA POWER / ECMWF when available |

The transmitted spectrum is converted to on-screen color through **CIE 1931 color-matching functions** → sRGB. On top of the spectral core, weather heuristics blend in cloud-layer effects ("high clouds as a canvas" vs. "overcast washing colors out") and humidity-driven hygroscopic growth of aerosols.

Long-form derivation lives in [`SUNSET_COLOR_SCIENCE.md`](https://github.com/RaimundoDiaz/sunset-color-today/blob/main/SUNSET_COLOR_SCIENCE.md) (workspace-level).

## 🎯 Features

- 🎨 **Today's sunset color** — predicted from current weather and atmosphere, not a fixed palette
- 🌤️ **Live sky** — current sky color follows solar elevation in real time
- 🌍 **28 cities worldwide** — pre-loaded global locations
- 📊 **Atmospheric panel** — see the inputs the model is using (cloud layers, AOD, ozone, water vapor)
- 🎬 **Synced animation** — atmospheric background + 22 s timeline slider, perfectly aligned at the loop boundary
- 🌐 **English & Spanish** — auto-detected from the browser
- 📱 **Responsive** — desktop and mobile layouts

## 🧱 Stack

| Layer | Tech |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Edge runtime API routes) |
| UI | [React 19](https://react.dev) + [Tailwind CSS 4](https://tailwindcss.com) + [shadcn](https://ui.shadcn.com) (`base-nova`) + [Base UI](https://base-ui.com) |
| Animation | [framer-motion](https://www.framer.com/motion/) |
| State | [Zustand 5](https://zustand-demo.pmnd.rs) |
| Data | [TanStack Query](https://tanstack.com/query) |
| Tests | [Vitest 3](https://vitest.dev) + [jsdom](https://github.com/jsdom/jsdom) |
| Hosting | [Vercel](https://vercel.com) |

## 🛰️ Data sources

All public APIs, no client-side keys required:

- **[Open-Meteo](https://open-meteo.com)** — weather, clouds, visibility, radiation
- **[Open-Meteo Air Quality](https://open-meteo.com/en/docs/air-quality-api)** — AOD and aerosol-related pollutants
- **[NASA POWER](https://power.larc.nasa.gov)** — column ozone and water vapor (with fallback estimates)
- **[ECMWF via Open-Meteo](https://open-meteo.com/en/docs/ecmwf-api)** — finer water vapor (optional)

## 🚀 Getting started

```bash
git clone https://github.com/RaimundoDiaz/sunset-color-today.git
cd sunset-color-today
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Dev server at `localhost:3000` |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run test` | Vitest watch mode |
| `npm run test:run` | Vitest single run (CI-style) |

Tests cover the **physics/math libs** (`atmosphere`, `color-utils`, `quality`, `solar`, `spectral-model`); UI is verified visually.

## 🗂️ Structure

```text
sunset-color-today/
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx            # SEO metadata + viewport
│  │  ├─ page.tsx              # entry — JSON-LD + <SunsetApp />
│  │  ├─ robots.ts             # robots.txt
│  │  ├─ sitemap.ts            # sitemap.xml with hreflang en/es
│  │  ├─ manifest.ts           # PWA manifest
│  │  └─ api/                  # Edge proxies for external APIs
│  ├─ components/
│  │  ├─ SunsetApp.tsx         # 4-layer composition (bg + hero + weather + slider)
│  │  ├─ AtmosphericBackground.tsx
│  │  ├─ TimelineSlider.tsx
│  │  └─ ui/                   # shadcn primitives
│  ├─ lib/
│  │  ├─ spectral-model.ts     # 19-wavelength transmission + CIE 1931 → sRGB
│  │  ├─ sky-scattering.ts     # Rayleigh + Mie + Chappuis at given elevation
│  │  ├─ atmosphere.ts         # hygroscopic growth, effective AOD, ozone estimation
│  │  ├─ solar.ts              # solar elevation + Kasten-Young air mass
│  │  ├─ sunset-timeline.ts    # 12-stop elevation timeline + peak picker
│  │  ├─ sunset-color.ts       # top-level orchestrator with weather heuristics
│  │  └─ live-sky.ts           # current sky color from current solar elevation
│  ├─ api/fetchers.ts          # client-side fetchers
│  └─ constants/translations.ts # EN / ES dictionaries
└─ __tests__/                  # Vitest specs for the physics libs
```

## 🎬 The animation contract

`AtmosphericBackground` and `TimelineSlider` are **independently animated** but synced. Both run on `duration: 22s, repeat: Infinity`, share a remount key, and align at every loop boundary. The slider uses `linear` easing (constant velocity); the background uses `easeInOut` with compressed final segment for a fast loop-back. They diverge inside the cycle — that's intentional.

## 🚢 Deploy

Every push to `main` deploys to Vercel. Live at **[sunsetcolor.today](https://www.sunsetcolor.today)**.

## 📄 License

MIT © [Raimundo Díaz](https://github.com/RaimundoDiaz)
