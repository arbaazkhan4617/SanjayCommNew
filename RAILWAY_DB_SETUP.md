# Railway MySQL Database Setup Guide

## Step 1: Add MySQL Service to Railway

1. Go to your Railway project dashboard
2. Click **"+ New"** button
3. Select **"Database"** → **"Add MySQL"**
4. Railway will automatically create a MySQL database service

## Step 2: Link Database to Backend Service

1. Go to your **SanjayCommNew** service (backend)
2. Click on **"Variables"** tab
3. Railway should automatically add these variables when you link the database:
   - `MYSQLHOST`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQLDATABASE`
   - `MYSQLPORT`

## Step 3: Verify Environment Variables

In the **Variables** tab, you should see:
- ✅ `MYSQLHOST` = <database-host>
- ✅ `MYSQLUSER` = <database-user>
- ✅ `MYSQLPASSWORD` = <database-password>
- ✅ `MYSQLDATABASE` = <database-name>
- ✅ `MYSQLPORT` = <database-port>
- ✅ `PORT` = <railway-assigned-port> (auto-set by Railway)

## Step 4: Link Services (If Not Automatic)

1. Go to **SanjayCommNew** service
2. Click **"Settings"** tab
3. Under **"Service Dependencies"**, add the MySQL service
4. This ensures the database is available before the app starts

## Step 5: Redeploy

After setting up the database:
1. Railway will automatically redeploy
2. Or manually trigger: Click **"Deployments"** → **"Redeploy"**

## Troubleshooting

### If variables are missing:
1. Make sure MySQL service is added to the project
2. Make sure services are linked (Settings → Service Dependencies)
3. Manually add variables from MySQL service's "Variables" tab

### If connection still fails:
1. Check **Deploy Logs** for specific error messages
2. Verify database is running (MySQL service shows "Online")
3. Check if database name matches `MYSQLDATABASE` variable

## Expected Logs (After Fix)

When database connects successfully, you should see:
```
HikariPool-1 - Starting...
HikariPool-1 - Start completed.
Started IntegratorsApplication
========================================
Starting Data Seeder...
```

