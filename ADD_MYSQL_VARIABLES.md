# How to Add MySQL Variables in Railway

## Current Situation
You have `MYSQL_HOST` referencing `${{MySQL.MYSQLHOST}}`, but the app needs:
- `MYSQLHOST` (not `MYSQL_HOST`)
- `MYSQLUSER`
- `MYSQLPASSWORD`
- `MYSQLDATABASE`
- `MYSQLPORT`

## Solution: Add Variables Manually

### Step 1: Click "Add" Button
In the Variables tab, click the purple "Add" button at the bottom right.

### Step 2: Add Each Variable

Add these 5 variables one by one:

1. **MYSQLHOST**
   - Variable Name: `MYSQLHOST`
   - Value: `${{MySQL.MYSQLHOST}}`
   - Click "Add"

2. **MYSQLUSER**
   - Variable Name: `MYSQLUSER`
   - Value: `${{MySQL.MYSQLUSER}}`
   - Click "Add"

3. **MYSQLPASSWORD**
   - Variable Name: `MYSQLPASSWORD`
   - Value: `${{MySQL.MYSQLPASSWORD}}`
   - Click "Add"

4. **MYSQLDATABASE**
   - Variable Name: `MYSQLDATABASE`
   - Value: `${{MySQL.MYSQLDATABASE}}`
   - Click "Add"

5. **MYSQLPORT**
   - Variable Name: `MYSQLPORT`
   - Value: `${{MySQL.MYSQLPORT}}`
   - Click "Add"

### Step 3: Verify All Variables
After adding, you should see:
- ✅ MYSQLHOST = ${{MySQL.MYSQLHOST}}
- ✅ MYSQLUSER = ${{MySQL.MYSQLUSER}}
- ✅ MYSQLPASSWORD = ${{MySQL.MYSQLPASSWORD}}
- ✅ MYSQLDATABASE = ${{MySQL.MYSQLDATABASE}}
- ✅ MYSQLPORT = ${{MySQL.MYSQLPORT}}

### Step 4: Redeploy
Railway will automatically redeploy after adding variables.

## Alternative: Use Service Dependencies
1. Go to "Settings" tab
2. Under "Service Dependencies", ensure MySQL service is added
3. Railway should auto-populate variables (but may need manual addition)

