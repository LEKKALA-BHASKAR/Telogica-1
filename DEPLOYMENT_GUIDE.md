# Telogica Deployment Guide - Render.com

## 🚨 Current Issue
Your deployment is failing because environment variables are not set on Render. The server can't start without `JWT_SECRET` and other critical variables.

---

## ✅ Quick Fix - Add Environment Variables to Render

### Step 1: Go to Render Dashboard
1. Visit [render.com](https://render.com/dashboard)
2. Find your **Backend service** (telogica-server or similar)
3. Click on the service name
4. Go to **Settings** → **Environment**

### Step 2: Add All These Environment Variables

Copy and paste these into Render's Environment tab:

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

**⚠️ IMPORTANT:** 
- `PORT` on Render is usually assigned automatically. Remove this or set to `10000`
- Make sure to leave empty fields (like RAZORPAY keys) as-is

### Step 3: Save and Redeploy

1. Click **Save** in Environment section
2. Go back to **Deploys** tab
3. Click **Manual Deploy** → **Deploy latest commit**

---

## 🔒 Security Best Practices

### What NOT to Commit to GitHub
Create a `server/.env.production` file with sensitive data:
```bash
# Create this file (don't commit it)
echo "server/.env.production" >> .gitignore
```

Then in Render, set these critical variables there instead of in code:
- `JWT_SECRET` ✅ (Already set - good)
- `MONGO_URI` ✅ (Atlas connection - already configured)
- `RAZORPAY_KEY_ID` (Add when ready)
- `RAZORPAY_KEY_SECRET` (Add when ready)
- `SMTP_PASS` (If using email service)

### Generate New JWT_SECRET (Recommended for Production)
Run this in your terminal:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Output example:
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0
```

Then update JWT_SECRET in Render Environment with this new value.

---

## 📋 Complete Environment Variables Checklist

### REQUIRED (Deployment will fail without these)
- [ ] `NODE_ENV=production`
- [ ] `PORT` (Render assigns this, leave blank or use 10000)
- [ ] `CLIENT_URL=https://telogica-1.vercel.app`
- [ ] `MONGO_URI=mongodb+srv://...` (your Atlas URI)
- [ ] `JWT_SECRET=<random-48-char-string>`
- [ ] `JWT_EXPIRES_IN=7d`
- [ ] `COOKIE_NAME=telogica_token`

### OPTIONAL (App works without these, but needed for full functionality)
- [ ] `RAZORPAY_KEY_ID` (for real payments)
- [ ] `RAZORPAY_KEY_SECRET` (for real payments)
- [ ] `SMTP_HOST` (for email notifications)
- [ ] `SMTP_USER` (for email notifications)
- [ ] `SMTP_PASS` (for email notifications)

### ALREADY SET (For reference)
- Admin credentials in `.env`
- Pricing settings (TAX_RATE, SHIPPING, etc.)

---

## 🚀 Frontend Deployment (Vercel)

Your frontend is already deployed to `https://telogica-1.vercel.app`

Make sure Vercel environment is also configured:
1. Go to Vercel Dashboard
2. Select your project
3. **Settings** → **Environment Variables**
4. Add: `NEXT_PUBLIC_API_URL=/api/v1` (for same-origin API calls)

---

## 🔗 API Proxy Configuration

Your Next.js frontend proxies `/api/*` to the backend:
- Frontend URL: `https://telogica-1.vercel.app`
- Backend URL: `https://telogica-server.onrender.com` (or your Render domain)

**Render will give you a URL like:** `https://telogica-server-xxxx.onrender.com`

Update `CLIENT_URL` in backend `.env` if your frontend domain changes.

---

## ✅ Testing After Deployment

Once deployed, test these endpoints:

### 1. Health Check (Backend is running)
```bash
curl https://telogica-server-xxxx.onrender.com/api/v1/products?limit=1
```

### 2. Register Test User
```bash
curl -X POST https://telogica-server-xxxx.onrender.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass@123"
  }'
```

### 3. Login Test
```bash
curl -X POST https://telogica-server-xxxx.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass@123"
  }'
```

---

## 🐛 Common Issues & Fixes

### ❌ "JWT_SECRET must be set..."
**Solution:** Add `JWT_SECRET` to Render Environment Variables (see Step 2 above)

### ❌ "MongoDB connection timeout"
**Solution:** Check MONGO_URI is correct and MongoDB Atlas IP whitelist includes Render's servers:
- Go to MongoDB Atlas Dashboard
- Network Access → IP Whitelist
- Add `0.0.0.0/0` (allows all IPs) OR add Render's IPs specifically

### ❌ "CORS error when calling API"
**Solution:** Make sure `CLIENT_URL` in backend `.env` matches your Vercel frontend URL:
```
CLIENT_URL=https://telogica-1.vercel.app
```

### ❌ "Cannot find module..."
**Solution:** In Render, make sure build command is:
```
npm run build:all
```

And start command is:
```
npm start
```

---

## 📞 Your Current URLs

```
Frontend: https://telogica-1.vercel.app
Backend:  https://telogica-server-xxxx.onrender.com (check Render dashboard for exact URL)
Database: MongoDB Atlas (Connected)
```

---

## ✨ Next Steps After Deployment Works

1. ✅ Test full auth flow (register → login → cart → checkout)
2. ✅ Verify product loading on frontend
3. ✅ Test admin dashboard at `/admin`
4. ✅ Add Razorpay keys for real payments
5. ✅ Configure SMTP for email notifications
6. ✅ Set up monitoring (Sentry, DataDog)
7. ✅ Enable caching headers for performance

---

## 💾 Database Seeding in Production

After first deployment, seed products:

### Option 1: Via API (if you create a seed endpoint)
```bash
curl -X POST https://telogica-server-xxxx.onrender.com/api/v1/admin/seed \
  -H "Authorization: Bearer <admin-token>"
```

### Option 2: Local then sync
```bash
npm run seed
# Then database is already synced via MongoDB Atlas
```

### Option 3: One-time manual load
Products should already be seeded if you ran `npm run seed` before committing.

---

## 🎯 Deployment Checklist

- [ ] Environment variables added to Render
- [ ] Backend service redeployed successfully
- [ ] Frontend can call backend API
- [ ] Login/registration working end-to-end
- [ ] Products loading on frontend
- [ ] Admin dashboard accessible
- [ ] MongoDB Atlas whitelisted Render's IPs
- [ ] CORS configured correctly
- [ ] JWT_SECRET is strong (48+ chars)
- [ ] No secrets committed to GitHub

---

## 🆘 Still Having Issues?

Check Render logs:
1. Go to Render Dashboard
2. Select your service
3. Click **Logs** tab
4. Look for error messages starting with `✖`

Common errors in logs:
- `ECONNREFUSED` → MongoDB not reachable
- `ENOMEM` → Out of memory (upgrade instance)
- `Cannot GET /api/v1/...` → Route not found (check backend code)

---

**Once deployed, your full-stack app will be live! 🚀**
