# Railway Healthcheck Fix

## Current Issue
✅ Build successful
❌ Healthcheck failing - service unavailable
⚠️ Railway is running Node.js instead of Java backend

## Root Cause
Railway is still detecting and running the Node.js/Expo app from the root directory instead of the Java backend.

## Solution

### Option 1: Set Root Directory in Dashboard (Recommended)
1. Go to Railway dashboard
2. Select "SanjayCommNew" service
3. Go to **Settings** tab
4. Find **"Root Directory"** field
5. Set to: **`backend`**
6. Save - Railway will auto-redeploy

### Option 2: Verify Dockerfile is Being Used
1. In Railway dashboard → SanjayCommNew service → Settings
2. Check **"Build Command"** - should be empty (uses Dockerfile)
3. Check **"Start Command"** - should be empty (uses Dockerfile)
4. Verify **"Dockerfile Path"** is set to: `Dockerfile`

### Option 3: Add MySQL Database
The healthcheck might also be failing due to missing database:
1. In Railway project dashboard
2. Click **"New"** → **"Database"** → **"Add MySQL"**
3. Railway will auto-link it to your service

## After Fix
Once Railway uses the Java backend:
- Build will show: `[INFO] BUILD SUCCESS`
- Deploy logs will show: `Started IntegratorsApplication`
- Healthcheck will pass: `/api/products/services` returns 200 OK

## Verify
```bash
# Check logs
cd backend && railway logs --service SanjayCommNew

# Test API
curl https://sanjaycommnew-production.up.railway.app/api/products/services
```

