# Deployment Checklist ✅

Use this checklist to ensure everything is ready for deployment.

## Pre-Deployment Checklist

### Backend (Railway)
- [ ] Code pushed to GitHub
- [ ] `application-prod.properties` configured
- [ ] `pom.xml` has correct finalName
- [ ] `Procfile` exists
- [ ] `.gitignore` excludes sensitive files
- [ ] Railway account created
- [ ] MySQL database ready

### Mobile App (Expo)
- [ ] `app.json` or `app.config.js` configured
- [ ] `apiConfig.js` updated with Railway URL
- [ ] `.env` file created (if using env variables)
- [ ] Expo account created
- [ ] EAS account created (for production builds)

## Deployment Steps

### Step 1: Backend Deployment
1. [ ] Go to [railway.app](https://railway.app)
2. [ ] Create new project
3. [ ] Connect GitHub repository
4. [ ] Set root directory: `backend`
5. [ ] Add MySQL database
6. [ ] Set environment variable: `SPRING_PROFILES_ACTIVE=prod`
7. [ ] Wait for deployment to complete
8. [ ] Copy Railway URL (e.g., `https://your-app.railway.app`)
9. [ ] Test backend: `curl https://your-app.railway.app/api/products/services`

### Step 2: Update Mobile App Configuration
1. [ ] Update `src/utils/apiConfig.js` with Railway URL
2. [ ] Or create `.env` file with `EXPO_PUBLIC_API_URL`
3. [ ] Test API connection locally

### Step 3: Mobile App Deployment
1. [ ] Login to Expo: `expo login`
2. [ ] Publish: `expo publish` (development)
3. [ ] Or build: `eas build --platform android` (production)
4. [ ] Test on Expo Go app
5. [ ] Verify login works with backend

## Post-Deployment Verification

### Backend Tests
- [ ] Health check: `/api/products/services`
- [ ] Login endpoint: `/api/auth/login`
- [ ] Database connection working
- [ ] CORS configured correctly
- [ ] Logs accessible in Railway dashboard

### Mobile App Tests
- [ ] App loads successfully
- [ ] Can connect to backend API
- [ ] Login functionality works
- [ ] Products load correctly
- [ ] Cart functionality works
- [ ] Orders can be placed

## Troubleshooting

### Backend Issues
- [ ] Check Railway logs
- [ ] Verify MySQL connection variables
- [ ] Check `SPRING_PROFILES_ACTIVE=prod` is set
- [ ] Verify port configuration

### Mobile App Issues
- [ ] Verify API URL is correct
- [ ] Check CORS settings in backend
- [ ] Test API in browser/Postman
- [ ] Check Expo logs

## Quick Commands

```bash
# Test backend
curl https://your-app.railway.app/api/products/services

# Test login
curl -X POST https://your-app.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@integrators.com","password":"admin123"}'

# Deploy backend (if using Railway CLI)
cd backend && railway up

# Deploy mobile app
expo publish

# Build production APK
eas build --platform android
```

## Default Credentials

- **Email**: `admin@integrators.com`
- **Password**: `admin123`

---

**Status**: ⬜ Not Started | 🟡 In Progress | ✅ Completed
