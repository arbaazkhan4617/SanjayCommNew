# Troubleshooting Network Errors

## Common Network Error: "Network Error" or "Connection Refused"

### Issue: App can't connect to backend

### Solutions:

#### 1. **Check if Backend is Running**
```bash
cd backend
mvn spring-boot:run
```

You should see:
```
Started IntegratorsApplication in X.XXX seconds
```

#### 2. **Verify Backend is Accessible**
Open browser and go to:
- `http://localhost:8080/api/products/services`

You should see JSON response or empty array `[]`

#### 3. **Android Emulator Configuration**

The app automatically uses `http://10.0.2.2:8080/api` for Android emulator.

**If still getting errors:**
- Make sure backend is running
- Check Android emulator network settings
- Try restarting the emulator

#### 4. **Physical Device Configuration**

For physical device testing:

1. **Find your computer's IP address:**
   ```bash
   # Mac/Linux
   ifconfig | grep "inet "
   
   # Windows
   ipconfig
   ```
   Look for IP like `192.168.1.100`

2. **Update API Config:**
   - Open `src/utils/apiConfig.js`
   - Uncomment `PHYSICAL_DEVICE_IP` line
   - Set your IP: `const PHYSICAL_DEVICE_IP = '192.168.1.100';`

3. **Ensure same WiFi:**
   - Phone and computer must be on same WiFi network
   - Check firewall allows port 8080

#### 5. **Test Backend Connection**

Test from your computer:
```bash
# Test if backend is running
curl http://localhost:8080/api/products/services

# Should return JSON or []
```

#### 6. **Check Backend Logs**

Look for errors in backend console:
- Database connection errors
- Port already in use
- Missing dependencies

#### 7. **Common Issues**

**Port 8080 already in use:**
```bash
# Find process using port 8080
lsof -i :8080

# Kill the process
kill -9 <PID>
```

**Firewall blocking:**
- Mac: System Preferences → Security → Firewall
- Windows: Windows Defender Firewall
- Allow port 8080

**CORS Errors:**
- Backend has CORS enabled
- If issues persist, check `backend/src/main/java/com/integrators/config/SecurityConfig.java`

#### 8. **Fallback Mode**

The app works in offline mode:
- Uses local storage for cart
- Shows empty lists if backend unavailable
- You can still browse UI

#### 9. **Debug Steps**

1. Check console logs:
   ```
   📱 Platform: android
   🌐 API Base URL: http://10.0.2.2:8080/api
   ```

2. Check network requests in React Native Debugger

3. Test backend directly:
   ```bash
   curl http://localhost:8080/api/products/services
   ```

4. Check backend logs for incoming requests

#### 10. **Quick Fixes**

**Restart everything:**
```bash
# Stop backend (Ctrl+C)
# Restart backend
cd backend
mvn spring-boot:run

# Restart app
# In app: Shake device → Reload
```

**Clear app cache:**
```bash
# Clear Metro bundler cache
npm start -- --clear
```

**Reset network:**
- Restart WiFi on both devices
- Restart Android emulator
- Restart computer if needed

## Still Having Issues?

1. Verify backend is running and accessible
2. Check API URL in console logs
3. Ensure correct IP for your environment
4. Check firewall/network settings
5. Review backend logs for errors

## Testing Without Backend

The app will work in offline mode:
- UI will load
- Cart uses local storage
- Product lists will be empty
- You can test navigation and UI

To add sample data, see backend README for database seeding.
