# Deployment Guide

This guide will help you deploy the Integrators mobile app to Expo and the backend to Railway.

## Prerequisites

1. **Expo Account**: Sign up at [expo.dev](https://expo.dev)
2. **Railway Account**: Sign up at [railway.app](https://railway.app)
3. **GitHub Account**: (Optional but recommended)

---

## Part 1: Deploy Backend to Railway

### Step 1: Prepare Backend for Railway

1. **Create Railway Project**:
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo" (recommended) or "Empty Project"

2. **Add MySQL Database**:
   - In Railway dashboard, click "New" → "Database" → "MySQL"
   - Railway will automatically create a MySQL database
   - Note down the connection details (you'll see them in Variables)

### Step 2: Configure Environment Variables

In Railway dashboard → Your Project → Variables, add:

```
DATABASE_URL=jdbc:mysql://[host]:[port]/[database]
DB_USER=[username]
DB_PASSWORD=[password]
PORT=8080
SPRING_PROFILES_ACTIVE=prod
```

**Note**: Railway automatically provides `DATABASE_URL`, `DB_USER`, `DB_PASSWORD`, and `PORT` for MySQL. You may need to format `DATABASE_URL` for Spring Boot.

### Step 3: Deploy Backend

**Option A: Deploy from GitHub (Recommended)**

1. Push your backend code to GitHub
2. In Railway:
   - Click "New" → "GitHub Repo"
   - Select your repository
   - Set Root Directory to `backend`
   - Railway will auto-detect and build

**Option B: Deploy from CLI**

```bash
cd backend
railway login
railway init
railway link
railway up
```

### Step 4: Get Your Backend URL

After deployment:
- Railway will provide a URL like: `https://your-app-name.railway.app`
- Your API will be at: `https://your-app-name.railway.app/api`
- **Save this URL** - you'll need it for the mobile app

### Step 5: Test Backend

```bash
# Test health endpoint
curl https://your-app-name.railway.app/api/products/services

# Should return JSON array (empty or with data)
```

---

## Part 2: Deploy Mobile App to Expo

### Step 1: Install Expo CLI

```bash
npm install -g expo-cli
```

### Step 2: Login to Expo

```bash
expo login
```

### Step 3: Update API Configuration

1. **Create `.env` file** in project root:

```bash
EXPO_PUBLIC_API_URL=https://your-app-name.railway.app/api
```

2. **Update `src/utils/apiConfig.js`**:
   - Replace `https://your-app-name.railway.app/api` with your actual Railway URL

### Step 4: Build and Deploy

**For Development Build:**

```bash
# Start development server
npx expo start

# For Android
npx expo start --android

# For iOS
npx expo start --ios
```

**For Production Build:**

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure EAS
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS (requires Apple Developer account)
eas build --platform ios
```

### Step 5: Publish to Expo

```bash
# Publish to Expo
expo publish

# Or use EAS Update
eas update --branch production --message "Initial release"
```

### Step 6: Create Standalone Apps

**Android APK/AAB:**
```bash
eas build --platform android --profile production
```

**iOS IPA:**
```bash
eas build --platform ios --profile production
```

---

## Part 3: Update Mobile App Configuration

### Update API URL in Production

1. **Edit `src/utils/apiConfig.js`**:
   ```javascript
   // Production URL - Update this with your Railway backend URL
   return 'https://your-app-name.railway.app/api';
   ```

2. **Or use Environment Variable**:
   - Create `.env` file:
     ```
     EXPO_PUBLIC_API_URL=https://your-app-name.railway.app/api
     ```
   - The code already reads from `process.env.EXPO_PUBLIC_API_URL`

### Update app.json for Production

```json
{
  "expo": {
    "name": "Integrators",
    "slug": "integrators-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#FF6B35"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.integrators.app"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FF6B35"
      },
      "package": "com.integrators.app"
    },
    "extra": {
      "apiUrl": "https://your-app-name.railway.app/api"
    }
  }
}
```

---

## Part 4: Testing Deployment

### Test Backend

1. **Health Check**:
   ```bash
   curl https://your-app-name.railway.app/api/products/services
   ```

2. **Test Login**:
   ```bash
   curl -X POST https://your-app-name.railway.app/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@integrators.com","password":"admin123"}'
   ```

### Test Mobile App

1. **Development**:
   - Scan QR code with Expo Go app
   - App should connect to Railway backend

2. **Production Build**:
   - Install APK/IPA on device
   - Test login and features

---

## Troubleshooting

### Backend Issues

1. **Database Connection Error**:
   - Check Railway MySQL variables
   - Verify `DATABASE_URL` format: `jdbc:mysql://host:port/database`

2. **Port Issues**:
   - Railway provides `PORT` automatically
   - Ensure `server.port=${PORT:8080}` in `application-prod.properties`

3. **CORS Errors**:
   - Update `SecurityConfig.java` to allow your Expo app origin
   - Or use `spring.web.cors.allowed-origins=*` for development

### Mobile App Issues

1. **API Connection Failed**:
   - Verify Railway URL is correct
   - Check if backend is running
   - Test API in browser/Postman

2. **Environment Variables Not Working**:
   - Ensure `.env` file exists
   - Restart Expo server after changes
   - Use `EXPO_PUBLIC_` prefix for variables

---

## Quick Reference

### Railway Backend URL Format
```
https://[project-name].railway.app/api
```

### Expo App URL Format
```
exp://exp.host/@your-username/integrators-app
```

### Default Login Credentials
- **Email**: `admin@integrators.com`
- **Password**: `admin123`

---

## Next Steps

1. ✅ Deploy backend to Railway
2. ✅ Update mobile app API URL
3. ✅ Build and publish mobile app
4. ✅ Test on physical devices
5. ✅ Submit to App Store / Play Store (optional)

---

## Support

- **Railway Docs**: https://docs.railway.app
- **Expo Docs**: https://docs.expo.dev
- **EAS Build Docs**: https://docs.expo.dev/build/introduction/
