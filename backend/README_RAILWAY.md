# Railway Deployment Guide

## Quick Start

1. **Push code to GitHub**
2. **Create Railway Project**:
   - Go to [railway.app](https://railway.app)
   - New Project → Deploy from GitHub repo
   - Select repository
   - Set Root Directory: `backend`

3. **Add MySQL Database**:
   - New → Database → MySQL
   - Railway auto-configures connection

4. **Set Environment Variable**:
   ```
   SPRING_PROFILES_ACTIVE=prod
   ```

5. **Deploy**: Railway auto-deploys on push

## Environment Variables

Railway automatically provides:
- `MYSQLHOST` - Database host
- `MYSQLUSER` - Database user
- `MYSQLPASSWORD` - Database password
- `MYSQLDATABASE` - Database name
- `MYSQLPORT` - Database port (usually 3306)
- `PORT` - Server port (Railway assigns)

You need to set:
- `SPRING_PROFILES_ACTIVE=prod`

## Build Configuration

Railway uses:
- **Builder**: Nixpacks (auto-detected)
- **Build Command**: `mvn clean package -DskipTests`
- **Start Command**: `java -jar target/integrators-backend-1.0.0.jar`

## Testing

After deployment, test:
```bash
curl https://your-project.railway.app/api/products/services
```

## Troubleshooting

1. **Check Logs**: Railway Dashboard → Deployments → View Logs
2. **Verify MySQL**: Check if database is running
3. **Check Port**: Ensure `PORT` variable is set
4. **Database Connection**: Verify MySQL variables are correct
