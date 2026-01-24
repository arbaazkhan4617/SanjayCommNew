# Railway Deployment Guide

## Prerequisites
- Railway account (sign up at https://railway.app)
- GitHub repository: https://github.com/arbaazkhan4617/SanjayCommNew

## Deployment Steps

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Sign up/login with email: **arbazkhan0210@gmail.com**
3. Click "New Project"

### Step 2: Deploy from GitHub
1. In Railway dashboard, click "New Project"
2. Select "Deploy from GitHub repo"
3. Authorize Railway to access your GitHub account
4. Select repository: **arbaazkhan4617/SanjayCommNew**
5. Railway will detect the project structure

### Step 3: Configure Service
1. Railway will auto-detect the backend folder
2. If not, click "Add Service" → "GitHub Repo" → Select the repo
3. Set **Root Directory** to: `backend`
4. Railway will use the `railway.json` and `nixpacks.toml` files automatically

### Step 4: Add MySQL Database
1. In your Railway project, click "New" → "Database" → "Add MySQL"
2. Railway will create a MySQL database automatically
3. Note the connection details (they'll be available as environment variables)

### Step 5: Configure Environment Variables
Railway automatically provides these MySQL variables:
- `MYSQLHOST`
- `MYSQLUSER`
- `MYSQLPASSWORD`
- `MYSQLDATABASE`
- `MYSQLPORT`

The `application-prod.properties` file is already configured to use these.

### Step 6: Set Active Profile
1. Go to your service settings
2. Add environment variable:
   - **Name**: `SPRING_PROFILES_ACTIVE`
   - **Value**: `prod`

### Step 7: Deploy
1. Railway will automatically start building and deploying
2. Monitor the build logs in the Railway dashboard
3. Once deployed, Railway will provide a public URL (e.g., `https://your-app.railway.app`)

### Step 8: Update Mobile App API URL
After deployment, update the API URL in your mobile app:
1. Open `src/utils/apiConfig.js`
2. Update `API_BASE_URL` to your Railway URL:
   ```javascript
   export const API_BASE_URL = 'https://your-app.railway.app/api';
   ```

## Important Notes

1. **Database Migration**: The app uses `spring.jpa.hibernate.ddl-auto=update`, so tables will be created automatically on first run.

2. **Default Users**: The DataSeeder will create default users:
   - Admin: `admin@integrators.com` / `admin123`
   - Sales: `sales@sanjaycomm.com` / `sales123`
   - Test: `test@test.com` / `test123`

3. **Health Check**: Railway is configured to check `/api/products/services` endpoint

4. **Build Command**: `mvn clean package -DskipTests`

5. **Start Command**: `java -jar target/integrators-backend-1.0.0.jar`

## Troubleshooting

- **Build Fails**: Check build logs in Railway dashboard
- **Database Connection Issues**: Verify MySQL service is running and environment variables are set
- **Port Issues**: Railway automatically sets `PORT` environment variable, which is used in `application-prod.properties`

## Railway Dashboard URL
After deployment, you can access your Railway dashboard at:
https://railway.app/dashboard
