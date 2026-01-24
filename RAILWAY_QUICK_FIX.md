# Railway Quick Fix - Configure Java Backend

## ⚠️ Current Issue
Your Railway service is detecting Node.js instead of Java/Spring Boot.

## 🔧 Quick Fix (5 minutes)

### 1. Set Root Directory
1. Go to Railway dashboard → Click **"SanjayCommNew"** service
2. Click **"Settings"** tab
3. Find **"Root Directory"** field
4. Enter: **`backend`**
5. Click **Save**

### 2. Verify Build Settings
In the same Settings page, verify:
- **Build Command**: `mvn clean package -DskipTests`
- **Start Command**: `java -jar target/integrators-backend-1.0.0.jar`

### 3. Add MySQL Database
1. In Railway project dashboard (not the service)
2. Click **"New"** → **"Database"** → **"Add MySQL"**
3. Wait for it to provision (takes ~30 seconds)

### 4. Set Environment Variable
1. Go back to **"SanjayCommNew"** service
2. Click **"Variables"** tab
3. Click **"New Variable"**
4. Add:
   - **Name**: `SPRING_PROFILES_ACTIVE`
   - **Value**: `prod`
5. Click **Add**

### 5. Expose Service
1. Go to **"Settings"** tab
2. Scroll to **"Networking"** section
3. Click **"Generate Domain"**
4. Copy the URL (e.g., `https://sanjaycommnew-production.up.railway.app`)

### 6. Redeploy
1. Go to **"Deployments"** tab
2. Click **"Redeploy"** on latest deployment
3. Watch the build logs - you should see:
   ```
   [INFO] Building jar: target/integrators-backend-1.0.0.jar
   [INFO] BUILD SUCCESS
   ```

## ✅ Verification

After redeploy, check:
1. **Logs tab** should show: `Started IntegratorsApplication`
2. Test health endpoint: `https://your-url.railway.app/api/products/services`
3. Should return JSON array (even if empty initially)

## 📱 Update Mobile App

Once you have the Railway URL, update `src/utils/apiConfig.js`:

```javascript
// Line 37, replace:
return 'https://your-app-name.railway.app/api';
// With your actual Railway URL:
return 'https://sanjaycommnew-production.up.railway.app/api';
```

Then commit and push:
```bash
git add src/utils/apiConfig.js
git commit -m "Update API URL for Railway deployment"
git push
```

## 🎯 Expected Result

- ✅ Service shows Java/Maven instead of Node.js
- ✅ Build completes successfully
- ✅ Service starts and shows "Online"
- ✅ Health endpoint returns 200 OK
- ✅ Database tables created automatically
