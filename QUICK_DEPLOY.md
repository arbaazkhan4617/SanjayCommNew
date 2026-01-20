# Quick Deployment Guide

## 🚀 Deploy Backend to Railway (5 minutes)

### Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub (recommended)

### Step 2: Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Connect your GitHub account
4. Select repository: `SanjayCommNew`
5. Set **Root Directory** to: `backend`

### Step 3: Add MySQL Database
1. In Railway dashboard, click **"New"** → **"Database"** → **"MySQL"**
2. Railway will auto-create MySQL database
3. Note: Connection details are auto-configured

### Step 4: Set Environment Variables
In Railway → Your Project → Variables, add:

```
SPRING_PROFILES_ACTIVE=prod
```

**Note**: Railway automatically provides:
- `DATABASE_URL`
- `DB_USER`
- `DB_PASSWORD`
- `PORT`

### Step 5: Deploy
Railway will automatically:
1. Detect Maven project
2. Build with `mvn clean package`
3. Run the JAR file
4. Provide a public URL

### Step 6: Get Your Backend URL
After deployment, Railway provides:
- **URL**: `https://your-project-name.railway.app`
- **API**: `https://your-project-name.railway.app/api`

**Save this URL!** You'll need it for the mobile app.

---

## 📱 Deploy Mobile App to Expo (5 minutes)

### Step 1: Install Expo CLI
```bash
npm install -g expo-cli eas-cli
```

### Step 2: Login to Expo
```bash
expo login
# or
eas login
```

### Step 3: Update API URL

**Option A: Update in Code**
Edit `src/utils/apiConfig.js`:
```javascript
// Replace this line:
return 'https://your-app-name.railway.app/api';

// With your Railway URL:
return 'https://your-project-name.railway.app/api';
```

**Option B: Use Environment Variable**
1. Create `.env` file in project root:
```
EXPO_PUBLIC_API_URL=https://your-project-name.railway.app/api
```

2. Install dotenv:
```bash
npm install dotenv
```

### Step 4: Publish to Expo
```bash
# Development build
expo publish

# Or production build with EAS
eas build --platform android
eas build --platform ios
```

### Step 5: Test
1. Install **Expo Go** app on your phone
2. Scan QR code from `expo start`
3. App should connect to Railway backend

---

## ✅ Quick Test

### Test Backend
```bash
# Replace with your Railway URL
curl https://your-project-name.railway.app/api/products/services
```

### Test Login
```bash
curl -X POST https://your-project-name.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@integrators.com","password":"admin123"}'
```

---

## 🔧 Troubleshooting

### Backend Not Starting?
1. Check Railway logs: Railway Dashboard → Deployments → View Logs
2. Verify MySQL connection variables
3. Check if port is set correctly

### Mobile App Can't Connect?
1. Verify Railway URL is correct
2. Check CORS settings in backend
3. Test API in browser first

### Database Issues?
1. Railway MySQL is auto-configured
2. Check `application-prod.properties` for correct format
3. Verify `SPRING_PROFILES_ACTIVE=prod` is set

---

## 📝 Default Credentials

- **Email**: `admin@integrators.com`
- **Password**: `admin123`

---

## 🎯 Next Steps

1. ✅ Backend deployed to Railway
2. ✅ Mobile app published to Expo
3. ✅ Test on physical device
4. ⬜ Build standalone APK/IPA (optional)
5. ⬜ Submit to App Store/Play Store (optional)

---

**Need Help?** Check `DEPLOYMENT.md` for detailed instructions.
