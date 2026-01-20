# Push and Deploy Instructions

## ✅ Git Repository Initialized

The code has been committed locally. Now you need to:

## Step 1: Push to GitHub

### Option A: Create New Repository on GitHub

1. Go to [github.com](https://github.com)
2. Click "New repository"
3. Name: `SanjayCommNew` (or your preferred name)
4. **Don't** initialize with README (we already have one)
5. Click "Create repository"

### Option B: Use Existing Repository

If you already have a repository, use that URL.

### Push Code

```bash
# Add GitHub remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Or if using SSH
git remote add origin git@github.com:YOUR_USERNAME/REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Note**: You'll need to authenticate with GitHub (personal access token or SSH key).

---

## Step 2: Deploy Backend to Railway

### Using Railway Dashboard (Easiest)

1. **Go to Railway**: [railway.app](https://railway.app)
2. **Login** with GitHub
3. **New Project** → **Deploy from GitHub repo**
4. **Select repository**: `SanjayCommNew`
5. **Set Root Directory**: `backend`
6. **Add MySQL Database**:
   - Click "New" → "Database" → "MySQL"
   - Railway auto-configures everything
7. **Set Environment Variable**:
   - Go to Variables tab
   - Add: `SPRING_PROFILES_ACTIVE=prod`
8. **Wait for deployment** (2-5 minutes)
9. **Get your URL**: Railway provides `https://your-app.railway.app`

### Using Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize in backend directory
cd backend
railway init

# Link to project (or create new)
railway link

# Deploy
railway up
```

---

## Step 3: Update Mobile App API URL

After Railway deployment, update the API URL:

### Option A: Edit File Directly

Edit `src/utils/apiConfig.js`:
```javascript
// Replace this line:
return 'https://your-app-name.railway.app/api';

// With your Railway URL:
return 'https://your-actual-railway-url.railway.app/api';
```

### Option B: Use Environment Variable

1. Create `.env` file in project root:
```
EXPO_PUBLIC_API_URL=https://your-actual-railway-url.railway.app/api
```

2. Install dotenv (if not already):
```bash
npm install dotenv
```

---

## Step 4: Deploy Mobile App to Expo

### Development Deployment

```bash
# Login to Expo
expo login

# Publish
expo publish
```

### Production Build

```bash
# Install EAS CLI (if not installed)
npm install -g eas-cli

# Login
eas login

# Configure EAS
eas build:configure

# Build for Android
eas build --platform android --profile production

# Build for iOS (requires Apple Developer account)
eas build --platform ios --profile production
```

---

## Step 5: Test Deployment

### Test Backend

```bash
# Replace with your Railway URL
curl https://your-app.railway.app/api/products/services

# Test login
curl -X POST https://your-app.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@integrators.com","password":"admin123"}'
```

### Test Mobile App

1. Install **Expo Go** app on your phone
2. Open Expo Go
3. Scan QR code from `expo start` or Expo dashboard
4. Test login and features

---

## Quick Commands Summary

```bash
# 1. Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git push -u origin main

# 2. Deploy Backend (using Railway CLI)
cd backend
railway login
railway init
railway up

# 3. Update API URL in src/utils/apiConfig.js

# 4. Deploy Mobile App
expo login
expo publish
```

---

## Troubleshooting

### Git Push Issues
- **Authentication**: Use personal access token or SSH key
- **Remote exists**: Remove with `git remote remove origin` then add again

### Railway Deployment Issues
- **Build fails**: Check Railway logs
- **Database connection**: Verify MySQL variables are set
- **Port issues**: Railway auto-sets PORT variable

### Expo Deployment Issues
- **Not logged in**: Run `expo login`
- **API connection**: Verify Railway URL is correct
- **Build fails**: Check EAS build logs

---

## Next Steps After Deployment

1. ✅ Code pushed to GitHub
2. ✅ Backend deployed to Railway
3. ✅ Mobile app deployed to Expo
4. ⬜ Test all features
5. ⬜ Share app with team/users
6. ⬜ Monitor Railway logs
7. ⬜ Set up custom domain (optional)

---

**Need Help?** Check `DEPLOYMENT.md` for detailed instructions.
