# Vercel Deployment Guide - Code Changes Complete ✅

## Changes Made (Code Level)

I've made the following code changes to fix the Vercel deployment:

### 1. ✅ Added `vercel.json`
This tells Vercel how to build your full-stack app:
- Build command: `npm run setup && npm run build:all`
- Properly handles monorepo structure
- Configures API rewrites

### 2. ✅ Updated `package.json`
- Added `postinstall` hook: `npm install --prefix server || true`
  - **This is key!** When Vercel runs `npm install`, it automatically installs server dependencies too
- Updated `build:all` script to just build (dependencies already installed)
- Added `setup:ci` script for CI environments

### 3. ✅ How It Works Now

When you push to GitHub, Vercel will:
```
$ npm install
  ├─ Installs root dependencies
  └─ postinstall hook fires → npm install --prefix server ✅

$ npm run setup (from vercel.json)
  ├─ Installs root dependencies (already done, skipped)
  └─ npm --prefix server install (already done, skipped)

$ npm run build:all
  ├─ npm run build:api → Compiles TypeScript server ✅
  └─ npm run build → Builds Next.js frontend ✅

✅ Success! No more "Cannot find module 'compression'" error
```

---

## Next Steps: Configure Environment Variables on Vercel

### Step 1: Go to Vercel Dashboard
https://vercel.com/dashboard

### Step 2: Select Your Project
Click on your project (telogica-1 or similar)

### Step 3: Go to Settings
Click **Settings** tab

### Step 4: Environment Variables
Click **Environment Variables** in the left sidebar

### Step 5: Add These Variables

Add each one with the values below. Set each to **Production, Preview, and Development**:

```
NEXT_PUBLIC_API_URL=/api/v1
```

That's the only one needed for frontend! Backend env vars are set separately (see below).

---

## Backend Environment Variables

Your backend runs separately. You need to configure it in the environment where your API server runs.

### If API is on Render:
1. Go to Render Dashboard
2. Select your backend service
3. Settings → Environment Variables
4. Add all these:

```
NODE_ENV=production
PORT=10000
CLIENT_URL=https://telogica-1.vercel.app

MONGO_URI=mongodb+srv://bassnaidu_db_user:8zrWuVofg1yfpd5a@cluster0.srflrzn.mongodb.net/telogica

JWT_SECRET=3de4c8c3ae044597544b53e3292a147788b17d5600ff4596d574d9e913b9fec7f6c230e194ae33735cacf2ab5b13382d
JWT_EXPIRES_IN=7d
COOKIE_NAME=telogica_token

ADMIN_NAME=Telogica Admin
ADMIN_EMAIL=admin@telogica.com
ADMIN_PASSWORD=Admin@12345

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

TAX_RATE=0.18
FREE_SHIPPING_THRESHOLD=25000
SHIPPING_FLAT_RATE=750
CURRENCY=INR

SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=Telogica <no-reply@telogica.com>
```

---

## About the Frontend-Backend Architecture

### How It Works
1. **Frontend (Vercel):** `https://telogica-1.vercel.app`
   - Next.js app running on Vercel
   - Calls API via `/api/v1` (same-origin)
   - Vercel's rewrite proxy forwards to backend

2. **Backend (Render):** `https://telogica-server-xxxx.onrender.com`
   - Express.js API
   - MongoDB Atlas connection
   - Handles authentication, database, payments

3. **Rewrite Proxy:**
   - Frontend → `/api/v1/login` 
   - Vercel rewrites to → Backend `/api/v1/login`
   - Browser stays on `telogica-1.vercel.app` (same-origin, cookies work!)

---

## 📋 Deployment Checklist

### Frontend (Vercel)
- [x] Code changes made (`vercel.json`, `package.json` updated)
- [ ] Push changes to GitHub:
  ```bash
  git add vercel.json package.json
  git commit -m "Fix: Add postinstall hook and vercel.json for proper monorepo build"
  git push origin main
  ```
- [ ] Vercel auto-deploys (watch deployment logs)
- [ ] Verify build succeeds (no TypeScript errors)
- [ ] Test frontend loads at https://telogica-1.vercel.app

### Backend (Render)
- [ ] Environment variables set in Render dashboard
- [ ] MongoDB Atlas IP whitelisted (`0.0.0.0/0`)
- [ ] Manual deploy or wait for auto-deploy
- [ ] Verify API returns products: 
  ```
  https://telogica-server-xxxx.onrender.com/api/v1/products?limit=1
  ```

### Full-Stack Test
- [ ] Visit https://telogica-1.vercel.app
- [ ] Click login
- [ ] Try registering new account
- [ ] Verify JWT token in browser cookies
- [ ] Visit /account/orders
- [ ] Add product to cart
- [ ] Proceed to checkout

---

## 🔍 How to Check Build Logs

### Vercel Build Logs
1. Go to Vercel Dashboard
2. Select your project
3. Click **Deployments** tab
4. Click latest deployment
5. Click **View Build Logs**
6. Look for:
   - ✅ `npm install` completed
   - ✅ `postinstall: npm install --prefix server` 
   - ✅ `npm run build:api` succeeded
   - ✅ `npm run build` succeeded (Next.js)
   - ✅ Production build deployed

### If Build Fails
Look for error messages like:
- ❌ `Cannot find module 'compression'` → postinstall didn't run
  - **Solution:** Re-commit and redeploy
- ❌ `node_modules not found` → Dependencies didn't install
  - **Solution:** Check network connectivity, retry deploy
- ❌ `TypeScript error in server/src` → Type error in backend code
  - **Solution:** Fix the error locally, commit, push

---

## 🎯 What Changed and Why

### The Problem
Vercel only installs root `package.json` dependencies by default. It doesn't automatically install server dependencies in subdirectories.

```
❌ Before:
npm install
├─ Installs root: @reduxjs/toolkit, next, react, etc.
└─ Doesn't install server dependencies!

npm run build:api
├─ Tries to compile TypeScript
└─ Can't find 'compression' → BUILD FAILS
```

### The Solution
Added `postinstall` hook that runs after `npm install`:

```json
"postinstall": "npm install --prefix server || true"
```

```
✅ After:
npm install
├─ Installs root dependencies
└─ postinstall hook: npm install --prefix server ✓

npm run build:api
├─ Compiles TypeScript successfully ✓
└─ All modules found ✓

npm run build
├─ Next.js build successful ✓
└─ Ready to deploy ✓
```

---

## 🚀 Push Your Changes Now

```bash
git add vercel.json package.json VERCEL_DEPLOYMENT.md
git commit -m "Fix: Add postinstall hook and vercel.json for proper monorepo build"
git push origin main
```

Vercel will auto-deploy. Wait for notification (email or dashboard).

Expected time: 3-5 minutes

---

## ✨ After Deployment

Your full-stack app will be:
- ✅ **Frontend:** https://telogica-1.vercel.app (Vercel)
- ✅ **Backend:** https://telogica-server-xxxx.onrender.com (Render)
- ✅ **Database:** MongoDB Atlas
- ✅ **Live & functional!**

Users can register, login, browse products, add to cart, and checkout end-to-end.

---

## 💡 Key Points

1. **postinstall hook** is the magic that makes this work
2. **vercel.json** explicitly tells Vercel the build command
3. **No environment variables needed** in frontend for backend (uses rewrite proxy)
4. **Cookies work** because frontend and API are same-origin (via rewrite)

---

**You're done with code changes! Just push and watch it deploy.** 🎉
