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
- `IMAGE_SERVICE_URL` (optional) - Base URL of your Railway image-service, e.g. `https://image-service-production-xxxx.up.railway.app`. When set, product/model image uploads are forwarded here instead of local storage.
- `IMAGE_SERVICE_UPLOAD_PATH` (optional) - Upload path on image-service, default `/upload`

## Image Service (Railway)

If you deploy a separate **image-service** on Railway:

1. Set `IMAGE_SERVICE_URL` on your **integrators-backend** service to the image-service base URL (e.g. `https://image-service-production-xxxx.up.railway.app`).
2. Your image-service must expose an upload endpoint that:
   - **Method**: `POST`
   - **Path**: `/upload` (or set `IMAGE_SERVICE_UPLOAD_PATH`)
   - **Content-Type**: `multipart/form-data` with field name `file`
   - **Response**: JSON with either `"url"` or `"imageUrl"` containing the public URL of the uploaded image, e.g. `{ "imageUrl": "https://..." }` or `{ "url": "https://..." }`

When `IMAGE_SERVICE_URL` is set, the backend forwards all image uploads to this service and returns the URL from the response. When not set, images are saved locally under `uploads/`.

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
