# 🚀 RENDER DEPLOYMENT - FIX IN 5 MINUTES

## The Problem
Your backend won't start on Render because **environment variables are missing**.

---

## ✅ The Solution (DO THIS NOW)

### Step 1: Log in to Render Dashboard
https://render.com/dashboard

### Step 2: Find Your Backend Service
Look for: `telogica` or `telogica-server` (whichever name you gave it)

### Step 3: Go to Settings → Environment
Click the **Settings** tab, then scroll to **Environment**

### Step 4: Add These Environment Variables
Paste each line into Render (Name = Value):

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

### Step 5: Save & Redeploy
1. Click **Save** button
2. Wait 2 seconds
3. Go to **Deploys** tab
4. Click **Manual Deploy** → **Deploy latest commit**

---

## ⏱️ Expected Timeline
- Save Environment: ~5 seconds
- Deploy: ~2-3 minutes
- If successful: You'll see ✅ "Build successful 🎉"

---

## ✨ That's It!
Once deployment succeeds:
- Backend will be live at: `https://telogica-server-xxxx.onrender.com`
- API calls: `https://telogica-server-xxxx.onrender.com/api/v1`
- Frontend already calls it via: `https://telogica-1.vercel.app`

---

## 🔍 How to Check if It's Working

After deployment finishes:

**Test the API:**
```bash
curl https://telogica-server-xxxx.onrender.com/api/v1/products?limit=1
```

Should return JSON with products.

**Go to your site:**
Visit: https://telogica-1.vercel.app/login
Try: test@example.com / TestPass@123

---

## 🆘 If It Still Fails

1. Check the **Logs** tab in Render (might show the real error)
2. Most common: MongoDB not whitelisting Render's IP
   - Go to MongoDB Atlas → Network Access
   - Add IP: `0.0.0.0/0` (allows all)
   - Try deploying again

---

**That's all you need to do! Your app will be live in ~3 minutes.** 🎉
