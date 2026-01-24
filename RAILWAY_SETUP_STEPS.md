# Railway Setup Steps - Complete Configuration

## Current Status
✅ Project added to Railway
⚠️ Service needs to be configured for Java/Spring Boot (currently showing Node.js)

## Step-by-Step Configuration

### Step 1: Configure Service Root Directory
1. In Railway dashboard, click on **"SanjayCommNew"** service
2. Go to **Settings** tab
3. Scroll to **"Root Directory"** section
4. Set Root Directory to: **`backend`**
5. Click **Save**

### Step 2: Verify Build Settings
1. Still in Settings, check **"Build Command"**
   - Should be: `mvn clean package -DskipTests`
   - If not, set it manually
2. Check **"Start Command"**
   - Should be: `java -jar target/integrators-backend-1.0.0.jar`
   - If not, set it manually

### Step 3: Add MySQL Database
1. In your Railway project dashboard (not the service)
2. Click **"New"** button (top right)
3. Select **"Database"** → **"Add MySQL"**
4. Railway will create MySQL database automatically
5. Note: Environment variables will be auto-set

### Step 4: Link Database to Service
1. Go back to **"SanjayCommNew"** service
2. Go to **"Variables"** tab
3. Verify these MySQL variables are present (Railway adds them automatically):
   - `MYSQLHOST`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQLDATABASE`
   - `MYSQLPORT`

### Step 5: Set Spring Profile
1. In **"Variables"** tab, click **"New Variable"**
2. Add:
   - **Name**: `SPRING_PROFILES_ACTIVE`
   - **Value**: `prod`
3. Click **Add**

### Step 6: Expose Service (Get Public URL)
1. Go to **"Settings"** tab
2. Scroll to **"Networking"** section
3. Click **"Generate Domain"** button
4. Railway will create a public URL (e.g., `https://sanjaycommnew-production.up.railway.app`)
5. Copy this URL - you'll need it for the mobile app

### Step 7: Redeploy
1. After making changes, Railway should auto-redeploy
2. If not, go to **"Deployments"** tab
3. Click **"Redeploy"** on the latest deployment
4. Monitor the build logs to ensure:
   - ✅ Build phase completes (Maven build)
   - ✅ Deploy phase completes (Java starts)
   - ✅ Health check passes

### Step 8: Verify Deployment
1. Once deployed, check the logs in **"Logs"** tab
2. Look for: `Started IntegratorsApplication`
3. Test the health endpoint:
   - Open: `https://your-railway-url.railway.app/api/products/services`
   - Should return JSON array of services

### Step 9: Update Mobile App API URL
1. Open `src/utils/apiConfig.js` in your project
2. Update the production URL:
   ```javascript
   export const API_BASE_URL = __DEV__ 
     ? (Platform.OS === 'android' 
         ? 'http://10.0.2.2:8080/api' 
         : 'http://localhost:8080/api')
     : 'https://your-railway-url.railway.app/api'; // ← Update this
   ```
3. Commit and push the change

## Troubleshooting

### Issue: Service shows "node@22.22.0"
**Solution**: Set Root Directory to `backend` in Settings

### Issue: Build fails
**Check**:
- Root Directory is set to `backend`
- Build Command: `mvn clean package -DskipTests`
- Java 17 is available (Nixpacks should handle this)

### Issue: Database connection fails
**Check**:
- MySQL service is running in Railway
- Environment variables are set correctly
- `SPRING_PROFILES_ACTIVE=prod` is set

### Issue: Service won't start
**Check logs for**:
- JAR file exists: `target/integrators-backend-1.0.0.jar`
- Port is set correctly (Railway sets `PORT` automatically)
- Database connection is successful

## Expected Build Output
```
[INFO] Building jar: target/integrators-backend-1.0.0.jar
[INFO] BUILD SUCCESS
```

## Expected Runtime Output
```
Started IntegratorsApplication in X.XXX seconds
Database seeding completed!
```

## Quick Checklist
- [ ] Root Directory set to `backend`
- [ ] MySQL database added
- [ ] `SPRING_PROFILES_ACTIVE=prod` variable set
- [ ] Service exposed (public URL generated)
- [ ] Deployment successful (green checkmark)
- [ ] Health endpoint accessible
- [ ] Mobile app API URL updated
