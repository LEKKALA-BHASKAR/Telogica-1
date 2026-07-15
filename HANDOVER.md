# Telogica Website — Handover

Last updated: 2026-07-15. This is the source of truth for the project; `README.md` is older and partly stale (it still describes the earlier "manufacturer" positioning — trust **this** file where they disagree).

---

## 1. What this is

A marketing website for **Telogica Limited** (formerly *Aishwarya Technologies and Telecom Ltd*), a **BSE-listed** (scrip **532975**, ISIN **INE778I01024**), **ISO 9001:2015** company in Hyderabad, India.

**Current positioning: defense-tech RF.** The company is repositioning around **RF power amplifiers (100 MHz – 40 GHz)** and RF components for radar, electronic warfare, SATCOM, military communications, and missile/UAV platforms. It also retains a catalogue of ~27 test & measurement instruments (its historical telecom/railway/defence business), presented as the "test-and-measurement foundation."

### ⚠️ Positioning guardrails (do not violate)
The client is a **component & subsystem supplier**, not a systems house. When writing copy:
- Frame the 13 defense applications as *"where our RF powers the mission,"* i.e. their amplifiers go **into** these systems. **Never** claim Telogica builds complete missiles, radars, or EW systems.
- **Do not invent** certifications or credentials. Only **ISO 9001:2015** and the **BSE listing** are confirmed. No MIL-STD, AS9100, ITAR/export claims, DRDO/heritage program names, or specific power/qualification numbers unless the client confirms them. There are open `[confirm]` items (see §8).

---

## 2. Tech stack

- **Next.js 14** (App Router) · **TypeScript** · **Tailwind CSS v3** · **Framer Motion**
- **Static export**: `next.config.mjs` sets `output: "export"`, `images.unoptimized`, `trailingSlash: true`. Build output is `./out` (~10 MB), deployable to any static host. **No server/runtime.**
- Fonts (next/font/google): **Inter** (body + headings), **Fredoka** (logo wordmark fallback).

### Run / build
```bash
npm install
npm run dev        # dev server (see Ports below)
npm run build      # static export -> ./out
npm run fetch:bse  # refresh BSE investor data (needs python + deps, see §6)
```

### Ports
`.claude/launch.json` has `autoPort: true` (port 3000 collides with another local project's `sitara-web`). The dev server picks a free port — recent sessions ran on **3007**. Don't hardcode 3000.

---

## 3. Design system

Dark theme inspired by **nukler.com**, coloured from the **Telogica logo's cyan-teal → emerald gradient**.

| Token (tailwind.config.ts) | Value | Use |
|---|---|---|
| `base` / black | `#000000` | Page background |
| `base-800` / `base-900` | `#0A0D0C` / `#050706` | Card & section surfaces |
| `line` | `#1E2320` | Borders |
| `teal` | `#16C0A8` | Primary accent — buttons, eyebrows, links, highlights |
| `grass` | `#5EBE89` | Emerald secondary |
| `fog` | `#9AA4A0` | Secondary text (`fog-bright`, `fog-dim` variants) |
| `bg-brand-gradient` | `#0BAEC9 → #16C0A8 → #5EBE89` (100°) | Headline accents, icon tiles, `.text-gradient` |

Global helpers in `src/app/globals.css`: `.container-x`, `.text-gradient`, `.eyebrow`, `.card`, `.gradient-ring` (hairline gradient border), `.bg-grid` / `.bg-dots` (textures), `.glow-blob` / `.glow-teal` (radial glows), `.vignette`.

**Logo** (`src/components/Brand.tsx`): recreated as an SVG wordmark (`WaveMark` + "Telogica" in gradient). The client's real logo files are at `~/Downloads/logo-28/` (incl. `favicon/favicon.svg`, gradient `#5ebe89`→`#2bb2b1`/`#1cc3aa`→`#0BAEC9`). If asked to use the exact asset, drop it into `public/` and swap the component.

**Hero image**: `public/hero-pcb.webp` — a client-provided (AI-generated) teal pick-and-place / PCB image. `object-center`.

---

## 4. Pages

| Route | File | Notes |
|---|---|---|
| `/` | `app/page.tsx` | Defense hero → capability snapshot → "two tiers" → mission-area domains → RF amplifier flagship → why-Telogica → clients → CTA |
| `/capabilities` | `app/capabilities/page.tsx` | Full defense content: two tiers, 4 domains × 13 apps, amplifier, snapshot table, why, CTA. **Primary nav item.** |
| `/about` | `app/about/page.tsx` | Reframed to two-tier / "measured, not asserted." Team/resources/ISO retained |
| `/products` + `/products/[id]` | `app/products/…` | 28 products, filterable by sector; detail pages with gallery/features/warranty |
| `/solutions` + `/solutions/[sector]` | `app/solutions/…` | **Legacy** telecom/railway/defence test-instrument sectors. Still telecom-framed; not in top nav (footer only) |
| `/investors` | `app/investors/page.tsx` | **Live BSE data** — see §6 |
| `/clients` | `app/clients/page.tsx` | 26-logo wall grouped by sector |
| `/contact` | `app/contact/page.tsx` | Form is **mailto-based** (no backend) — see §8 |
| `/privacy-policy`, `/terms`, `not-found` | | Legal + 404 |

Shared: `Header` (sticky, mobile menu), `Footer`, `PageHero` (dark inner-page hero), `ui.tsx` (`Button`, `SectionHeading`, `Eyebrow`, `Divider`, `Badge`), `Reveal` (scroll-in animation with a fallback timer so content never stays hidden), `CTABand`, `Icons.tsx` (inline SVG set).

Defense content is centralized in `src/lib/defense.ts` and rendered by `src/components/DefenseSections.tsx` (`CapabilitySnapshot`, `MissionAreas`, `AmplifierHighlight`, `WhyDefense`) — reused by both home and `/capabilities`.

---

## 5. Product data & image pipeline

- `src/data/products.json` — **28 products**. The **RF Power Amplifiers** entry (`id: rf-power-amplifiers`) is the flagship, inserted first, category `Defence`, image = hand-drawn SVG `public/products/rf-power-amplifiers-0.svg`. The other 27 are real test instruments; many carry **multiple sectors** via a `sectors[]` array (Telecom 20 · Railway 20 · Defence 7 by membership; 27 unique). Helpers in `src/lib/products.ts`.
- Product photos were **background-stripped to transparent WebP** and bundled in `public/products/`. Original source: the live site's backend API `telogica.onrender.com`. A remote backup of the pre-strip data is not kept in-repo.
- **Scripts** (`scripts/`, run with the repo's `.venv` python):
  - `strip_bg.py` — downloads product photos, removes the white studio background via border flood-fill (keeps interior whites/screens), saves PNG.
  - `optimize_images.py` — resizes to ≤720px and converts to WebP (also converts the hero PNG→WebP). Product images went **256 MB → ~2 MB** this way.
  - To refresh product images: re-point `strip_bg.py` at the source, run it, then `optimize_images.py`.

---

## 6. Investors page — live BSE (LODR) integration

`/investors` renders data pulled from **BSE's open endpoints** for scrip **532975**, bundled at **build time** into `src/data/bse.json` by `scripts/fetch_bse.py`.

- **Endpoints used** (public, same ones bseindia.com calls; require `Referer/Origin: bseindia.com` + browser UA):
  - `getScripHeaderData` → live quote (LTP, chg, OHLC, prev close)
  - `ComHeadernew` → fundamentals (ISIN, face value, EPS, P/E, P/B, RoE, industry)
  - `AnnSubCategoryGetData` → corporate announcements (currently **300** rows across Result / Board Meeting / AGM-EGM / Insider Trading·SAST / Corporate Action / Company Update)
- Announcement PDFs link to `https://www.bseindia.com/xml-data/corpfiling/AttachLive/<file>.pdf`.
- Rendered by `src/components/InvestorDisclosures.tsx` (tabbed + searchable + show-more) and `src/lib/bse.ts` (types + `filingGroups`/`groupOf` normalization).

**Why build-time, not live:** static export + BSE CORS blocks in-browser fetch. Data is **as-of last build** (the price is a snapshot, not a ticker). **Refresh** with `npm run fetch:bse && npm run build`. For freshness, schedule that (daily cron / GitHub Action).

Endpoints that did **not** work when probed: results-table, shareholding-pattern, corporate-action detail APIs (they redirect to an error page). Those datasets aren't tabulated — but the underlying filings are in the announcements feed, and the client's own full document library is linked (`https://www.telogica.com/investors`).

---

## 7. Deployment / hosting

I (Claude) do **not** have any servers to host on. The build is a plain static site, so host `./out` on any of:
- **Netlify / Vercel / Cloudflare Pages** — connect the repo; build `npm run build`, publish `out`.
- **AWS S3 + CloudFront**, **GitHub Pages**, or any **Nginx/Apache** static root.

For auto-refreshing BSE data, add a scheduled CI job that runs `npm run fetch:bse` before `npm run build`.

---

## 8. Open items / things to confirm with the client

1. **Defense proof points** — which are real? MIL-STD/environmental qualifications, AS9100, ITAR/export status, notable programs, specific power/frequency specs, heritage dates. None are on the site yet.
2. **Systems vs. components per domain** — the honest per-application breakdown (system / subsystem / component). Everything is currently framed as component/subsystem-safe.
3. **Contact form backend** — currently opens the visitor's mail client (`mailto:`). Wire to Formspree / an API for server-side capture (`src/components/ContactForm.tsx`).
4. **Legacy `/solutions` pages** still use telecom/railway framing — decide whether to reframe as the "test-and-measurement foundation" or retire.
5. **BSE data freshness** — set up the scheduled rebuild if live-ish data matters.
6. **Real logo asset** — swap the recreated SVG for the client's official file if pixel-exact branding is required.
7. `README.md` is stale — consider replacing it with this handover.

---

## 9. Environment notes

- Python scripts need a venv with **Pillow, numpy, scipy** (BSE script needs none beyond stdlib). The repo has a `.venv/` (gitignored); recreate with `python3 -m venv .venv && ./.venv/bin/pip install Pillow numpy scipy`.
- The **Claude Preview** MCP was unavailable in recent sessions; verification was done via `curl` against the dev server + production build. `mcp__claude-in-chrome__*` needs a connected Chrome extension to screenshot.
- Data was originally sourced by scraping `telogica.com` (SPA) and its backend `telogica.onrender.com`; the live public site is a separate React app with cart/quote/login/Razorpay that this marketing site does **not** replicate.
