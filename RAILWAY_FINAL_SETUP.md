# Railway Deployment - Final Setup Required

## ✅ Completed Automatically
- ✅ Linked to Railway project (miraculous-wonder)
- ✅ Created public domain: https://sanjaycommnew-production.up.railway.app
- ✅ Set environment variable: SPRING_PROFILES_ACTIVE=prod
- ✅ Created railway.toml configuration
- ✅ Updated mobile app API URL
- ✅ Triggered deployment

## ⚠️ Action Required in Railway Dashboard

The service is currently running Node.js instead of Java. You need to set the root directory:

### Steps:
1. Go to: https://railway.app/project/d28a56a2-60e2-4cb0-871c-4f4551cdb476
2. Click on **"SanjayCommNew"** service
3. Go to **"Settings"** tab
4. Find **"Root Directory"** field
5. Set it to: **`backend`**
6. Click **Save**
7. Railway will auto-redeploy

### After Root Directory is Set:
- Railway will detect Java/Maven from `backend/pom.xml`
- It will use `backend/railway.json` for build configuration
- Build command: `mvn clean package -DskipTests`
- Start command: `java -jar target/integrators-backend-1.0.0.jar`

## Add MySQL Database (if not already added):
1. In Railway project dashboard
2. Click **"New"** → **"Database"** → **"Add MySQL"**
3. Railway will auto-configure connection variables

## Verify Deployment:
After setting root directory and redeploy:
```bash
# Check logs
cd backend && railway logs --service SanjayCommNew

# Test API
curl https://sanjaycommnew-production.up.railway.app/api/products/services
```

## Expected Logs (After Fix):
```
[INFO] Building jar: target/integrators-backend-1.0.0.jar
[INFO] BUILD SUCCESS
...
Started IntegratorsApplication in X.XXX seconds
```

## Current Status:
- **Railway URL**: https://sanjaycommnew-production.up.railway.app
- **API Endpoint**: https://sanjaycommnew-production.up.railway.app/api
- **Mobile App**: Updated to use Railway URL
- **Issue**: Root directory needs to be set to `backend` in dashboard

