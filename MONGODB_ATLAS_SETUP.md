# MongoDB Atlas Setup for Render Deployment

## Issue
When deploying to Render, the backend can't connect to MongoDB Atlas if the IP isn't whitelisted.

---

## ✅ Fix: Whitelist Render's IP (Takes 2 Minutes)

### Step 1: Go to MongoDB Atlas Dashboard
https://cloud.mongodb.com/

### Step 2: Navigate to Network Access
1. Click **Security** on left sidebar
2. Click **Network Access**

### Step 3: Add Render's IP Address

**Option A: Allow All (Quickest for Development)**
1. Click **+ Add IP Address**
2. In dialog, click **Allow Access from Anywhere**
3. Enter `0.0.0.0/0` in IP address field
4. Click **Confirm**

**Option B: Only Render (More Secure)**
1. Get Render's IP range from: https://render.com/docs/deploy-to-render
2. Click **+ Add IP Address**
3. Paste the IP range
4. Click **Confirm**

### Step 4: Verify Your Connection String
Your connection string should be:
```
mongodb+srv://bassnaidu_db_user:8zrWuVofg1yfpd5a@cluster0.srflrzn.mongodb.net/telogica
```

Make sure this is in Render environment as `MONGO_URI`

---

## 🔐 Your Current MongoDB Setup

### Database User
- Username: `bassnaidu_db_user`
- Password: `8zrWuVofg1yfpd5a`
- Database: `telogica`
- Cluster: `cluster0.srflrzn.mongodb.net`

### Test Connection Locally
```bash
# This should work on your machine:
npm run dev

# Check logs for:
# ✔ MongoDB connected → cluster0.srflrzn.mongodb.net/telogica
```

---

## ✨ After Fixing IP Whitelist

Your backend deployment should now:
1. ✅ Start without JWT_SECRET error
2. ✅ Connect to MongoDB Atlas
3. ✅ Accept login/register requests
4. ✅ Serve products from database

---

## 🧪 Test MongoDB Connection

Once deployed, check if database is reachable:

```bash
# Test from terminal (replace with your Render URL)
curl -s https://telogica-server-xxxx.onrender.com/api/v1/products?limit=1 | head -c 100
```

Should return JSON starting with `{"success":true,"data":`

---

## ⚠️ Common MongoDB Issues

### Error: "MongoDB connection timeout"
**Fix:** Add IP `0.0.0.0/0` to Network Access in MongoDB Atlas

### Error: "authentication failed"  
**Fix:** Check username/password in MONGO_URI environment variable

### Error: "Connection pool exhausted"
**Fix:** Upgrade MongoDB Atlas cluster tier (usually okay for MVP)

---

## 📋 MongoDB Atlas Checklist

- [ ] Logged in to MongoDB Atlas
- [ ] Navigated to Network Access
- [ ] Added IP address (`0.0.0.0/0` or Render's IP)
- [ ] Copied connection string to Render `MONGO_URI` env var
- [ ] Redeployed backend on Render
- [ ] Verified deployment successful in logs

---

## 🚀 Your MongoDB is Already Set Up!

You don't need to do anything else — just whitelist Render's IP and you're good.

Products are already in the database (5000+ items)
Admin user is ready (admin@telogica.com)
