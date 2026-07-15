# Telogica — Corporate Website

A redesigned marketing website for **Telogica Limited** (formerly Aishwarya Technologies and Telecom Ltd) — an ISO 9001:2015 certified, BSE-listed (532975) **semiconductor & electronics equipment manufacturer** serving the telecommunication, railway and defence sectors.

Built with **Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion**, statically exportable to any host.

## Brand system

Dark, technical aesthetic (inspired by nukler.com) built on the official Telogica logo's **teal → green** gradient.

| Token | Hex | Use |
| --- | --- | --- |
| `base` / black | `#000000` | Page background |
| `base-800/900` | `#0A0D0C` / `#050706` | Card & section surfaces |
| `teal` | `#16C0A8` | Primary accent — eyebrows, buttons, links, highlights |
| `grass` | `#6BC670` | Secondary green accent, stat numbers |
| `lime` | `#84CC16` | Gradient end |
| `fog` | `#9AA4A0` | Secondary text |
| `bg-brand-gradient` | teal→green→lime 100° | Headline highlights, icon tiles, the wave mark |

Type: **Inter** (headings + body); **Fredoka** is loaded for the logo fallback. The official wordmark lives in `public/logo-white.png` (header) / `public/logo-color.png`, with `public/icon.svg` and `public/favicon.svg` for the mark/favicon.

Design language: dark, premium, technical — full-bleed photographic hero, teal accents, circuit/dot textures, subtle motion.

## Positioning

The site presents Telogica as a **manufacturer** ("a manufacturer, not a middleman"): SMT pick-and-place assembly, electronics design, and in-house test & calibration — not a distributor. The home hero ([`Hero.tsx`](src/components/Hero.tsx)) pairs a real PCB-assembly photo (`public/hero-pcb.jpg`, Unsplash — see `public/CREDITS.txt`) with an animated pick-and-place nozzle overlay and the four capability chips.

## Pages

| Route | Description |
| --- | --- |
| `/` | Home — hero, trust stats, sector cards, capabilities, featured products, client marquee, CTA |
| `/about` | Company story, ISO/quality, team resources, business segments, future plans |
| `/solutions` + `/solutions/[sector]` | Telecommunication · Railway · Defence, each with its real product set |
| `/products` + `/products/[id]` | Filterable catalogue (27 instruments) + detail pages with gallery, features, warranty |
| `/clients` | Full 26-logo client wall, grouped by sector |
| `/investors` | IR landing (BSE listing, document categories) linking to the existing document library |
| `/contact` | Contact form (opens mail client), offices, hours, map link, socials |
| `/privacy-policy`, `/terms` | Legal pages |

## Data

Real content was scraped from the live site's backend API (`telogica.onrender.com`) and committed locally:

- `src/data/products.json` — 27 distinct instruments. Many serve **multiple sectors** (e.g. the same OTDR is tagged both Telecom and Railway), captured via a `sectors[]` array. Sector membership: Telecom 20 · Railway 20 · Defence 7.
- `src/data/clients.json` — 26 client logos (ISRO, HAL, BEL, DRDO, BARC, BSNL, Airtel, Huawei, Nokia, Ericsson, RailTel …).

Product/client images are hot-linked from the company's existing Cloudinary account.

Data helpers live in `src/lib/products.ts`; site-wide constants (contact details, nav, stats) in `src/lib/site.ts`.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
```

## Build & deploy

```bash
npm run build    # static export to ./out
```

`next.config.mjs` sets `output: "export"`, so `./out` is a fully static site deployable to any static host (Netlify, S3/CloudFront, Nginx, GitHub Pages, etc.). No server required.

## Notes / next steps

- The contact form is client-side and opens the visitor's mail client (no backend). To capture submissions server-side, wire it to a form service (Formspree, your API, etc.) in `src/components/ContactForm.tsx`.
- Investor documents and any login/cart/checkout still live on the existing app; this site links out to them rather than rebuilding that functionality (per scope: marketing redesign only).
- Some product images are large (multi-MB) PNGs from the existing Cloudinary library; consider re-exporting them as optimized WebP for faster loads.
# Telogica-1
