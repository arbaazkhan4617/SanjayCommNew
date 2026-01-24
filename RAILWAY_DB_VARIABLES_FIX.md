# Railway Database Connection Fix

## Problem
Error: `Access denied for user 'root'@'10.187.193.198' (using password: NO)`

This means the backend service is not receiving the MySQL password from environment variables.

## Solution

### Step 1: Go to Your Backend Service
1. In Railway dashboard, click on your **backend service** (not the MySQL service)
2. Go to the **Variables** tab

### Step 2: Add MySQL Variable References
Click **"+ New Variable"** and add these 5 variables using **Variable Reference**:

| Variable Name | Variable Reference Value |
|--------------|-------------------------|
| `MYSQLHOST` | `${{MySQL.MYSQLHOST}}` |
| `MYSQLPORT` | `${{MySQL.MYSQLPORT}}` |
| `MYSQLDATABASE` | `${{MySQL.MYSQLDATABASE}}` |
| `MYSQLUSER` | `${{MySQL.MYSQLUSER}}` |
| `MYSQLPASSWORD` | `${{MySQL.MYSQLPASSWORD}}` |

**Important Notes:**
- Replace `MySQL` with your actual MySQL service name if it's different
- Use the **Variable Reference** option (not raw values)
- These must be added to the **backend service**, not the MySQL service

### Step 3: Verify
After adding the variables:
1. The backend service should automatically redeploy
2. Check the deploy logs to confirm the connection succeeds
3. The healthcheck should pass

### Alternative: If Variable Reference Doesn't Work
If the variable reference syntax doesn't work, you can manually set the values from your MySQL service:

1. Go to MySQL service → Variables tab
2. Copy the actual values (they should be visible or you can reveal them)
3. Go to backend service → Variables tab
4. Add them as raw values:
   - `MYSQLHOST` = `mysql.railway.internal` (or the actual host)
   - `MYSQLPORT` = `3306`
   - `MYSQLDATABASE` = `railway`
   - `MYSQLUSER` = `root`
   - `MYSQLPASSWORD` = `[copy the actual password from MySQL service]`

## Verification
After setting the variables, check the deploy logs. You should see:
- No more "Access denied" errors
- Successful database connection messages
- Application starting successfully
