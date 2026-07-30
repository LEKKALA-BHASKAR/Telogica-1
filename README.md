# Telogica — full-stack commerce platform

A MERN application for **Telogica Limited** (formerly Aishwarya Technologies and
Telecom Ltd, BSE: 532975): a Next.js/React storefront for test & measurement
instruments, backed by an Express + MongoDB API with carts, orders, payments,
quotations and a full admin panel.

```
MongoDB  ·  Express  ·  React (Next.js 14)  ·  Node
```

---

## Quick start

```bash
# 1. install both packages (root = web, server = api)
npm run setup

# 2. configure the API
cp server/.env.example server/.env
#    then set JWT_SECRET:
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"

# 3. make sure MongoDB is running
brew services start mongodb-community      # or: docker run -d -p 27017:27017 mongo:7

# 4. seed the catalogue, admin and demo customer
npm run seed

# 5. run both servers
npm run dev
```

| Service    | URL                          |
| ---------- | ---------------------------- |
| Storefront | http://localhost:3000        |
| API        | http://localhost:5001/api/v1 |
| Health     | http://localhost:5001/health |

> The API defaults to port **5001** because macOS holds 5000 for AirPlay Receiver.

### Seeded logins

| Role     | Email                | Password       |
| -------- | -------------------- | -------------- |
| Admin    | admin@telogica.com   | `Admin@12345`  |
| Customer | customer@example.com | `Customer@123` |

Change `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `server/.env` before any real deployment.

---

## Layout

```
Telogica-1/
├── src/                       Next.js 14 App Router storefront
│   ├── app/
│   │   ├── …                  home, about, solutions, clients, investors, contact
│   │   ├── products/          catalogue + /products/[slug] detail
│   │   ├── cart, checkout     cart, multi-step checkout
│   │   ├── order-confirmed/   post-purchase confirmation
│   │   ├── account/           orders, quotes, wishlist, addresses, profile
│   │   ├── admin/             dashboard, products, orders, quotes, messages, customers
│   │   └── login · register · forgot-password · reset-password · quote
│   ├── components/
│   │   ├── commerce/          cart, checkout, buy box, reviews, admin editor, charts
│   │   └── …                  header, footer, hero, product card, catalogue
│   ├── store/                 Redux Toolkit (auth + cart slices)
│   └── lib/                   api client, types, formatting, commerce maths
│
└── server/                    Express + Mongoose API
    ├── src/models/            User, Product, Order, Cart, Review, Quote, Message
    ├── src/controllers/       auth, product, cart, order, payment, review, quote, admin
    ├── src/routes/            /api/v1/*
    ├── src/middleware/        auth, validation, sanitisation, uploads, errors
    ├── src/seed/              catalogue import + commercial overlay
    └── src/utils/             pricing, tokens, mailer, query helpers
```

The browser never talks to `:5001` directly — `next.config.mjs` rewrites `/api/*`
to the API so requests stay same-origin and the httpOnly auth cookie works
without any CORS configuration.

---

## Features

**Storefront**

- Catalogue with server-side search, sector filters, sorting and pagination
- Product pages with gallery, specs, reviews, related items and recently viewed
- Hybrid commerce — priced products go to the cart; defence RF and bespoke lines
  route to a quotation flow instead
- Guest cart in `localStorage` that merges into the account cart at sign-in
- Live re-pricing: archived items are dropped and quantities clamped to stock
- Multi-step checkout — address → payment → review
- Razorpay (card / UPI / netbanking), cash on delivery, and a mock gateway so
  checkout works before any keys exist
- Order tracking timeline, cancellation, and a print-ready invoice
- Wishlist, saved addresses, quote history, verified-purchase reviews

**Admin** (`/admin`, administrators only)

- Dashboard: revenue, 12-month chart, order-status donut, best sellers, low stock
- Product CRUD with multi-image upload, specs and feature editors
- Order management with guarded status transitions, tracking, manual settlement
- Quote desk that emails a priced response, contact inbox, customer roles

**Engineering**

- TypeScript end to end, strict mode
- Zod validation on every request body, query and param
- JWT in an httpOnly cookie, bcrypt hashing, password-reset tokens
- NoSQL-injection sanitiser, helmet, rate limiting (global + per-route)
- Server-authoritative pricing — totals are recomputed before an order saves
- Stock reserved per line with compensating rollback if any line fails
- JSON-LD (Organization, Product, Breadcrumb), sitemap, robots

---

## Scripts

| Command                | What it does                                   |
| ---------------------- | ---------------------------------------------- |
| `npm run dev`          | storefront + API together                      |
| `npm run dev:web`      | Next.js only                                   |
| `npm run dev:api`      | Express only                                   |
| `npm run build:all`    | compile the API, then build the storefront     |
| `npm start`            | run both in production mode                    |
| `npm run seed`         | import the catalogue, upsert admin + demo user |
| `npm run seed:fresh`   | wipe products and carts, then reseed           |
| `npm run seed:destroy` | drop every collection                          |
| `npm run typecheck`    | typecheck both packages                        |

---

## Payments

Leave `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` blank and checkout runs through a
built-in mock gateway, so the whole flow is demoable with no account. Add test
keys from the Razorpay dashboard and the real widget takes over automatically —
the mock endpoint refuses to run once live keys are present.

Verification is an HMAC-SHA256 check of `razorpay_order_id|razorpay_payment_id`
against the key secret, compared in constant time. Signature failures are
recorded on the order and never mark it paid.

---

## Pricing data

The original catalogue (`src/data/products.json`) carried no prices — the old
site was quote-only throughout. `server/src/seed/catalogue.ts` supplies realistic
INR placeholders per instrument, with defence RF and bespoke systems left
quote-only.

**These are placeholders.** Replace them in that file, or edit each product from
Admin → Products, before going live.

Tax, shipping and free-delivery thresholds live in `server/.env`
(`TAX_RATE`, `SHIPPING_FLAT_RATE`, `FREE_SHIPPING_THRESHOLD`).

---

## Deployment notes

- Set `NODE_ENV=production`. The API refuses to boot without a strong `JWT_SECRET`.
- Point `MONGO_URI` at Atlas and `CLIENT_URL` at the deployed storefront origin —
  in production only that origin passes CORS.
- Behind a proxy or load balancer set `TRUST_PROXY=true` so rate limiting reads
  the real client IP and the secure cookie is issued correctly.
- Cookies use `SameSite=None; Secure` in production, so the storefront and API
  must both be served over HTTPS.
- `npm run build:all`, then `npm start` — or run the two packages as separate services.
- Uploaded product images are written to `public/uploads/`; mount persistent
  storage there, or swap `server/src/middleware/upload.ts` for S3.
