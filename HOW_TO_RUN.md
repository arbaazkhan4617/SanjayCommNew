# How to Run the App

This guide will help you run both the **Backend (Spring Boot)** and **Mobile App (React Native/Expo)**.

## Prerequisites

### For Backend:
- ✅ Java 17 or higher
- ✅ Maven 3.6+
- ✅ MySQL 8.0+ (optional - can use H2 for development)

### For Mobile App:
- ✅ Node.js 18+ and npm
- ✅ Expo CLI (installed automatically with npm)
- ✅ For iOS: Xcode (Mac only)
- ✅ For Android: Android Studio with emulator

---

## Step 1: Start the Backend Server

### Option A: Using Maven (Recommended)

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Build the project:**
   ```bash
   mvn clean install
   ```

3. **Run the backend:**
   ```bash
   mvn spring-boot:run
   ```

   Or for development with H2 database:
   ```bash
   mvn spring-boot:run -Dspring-boot.run.profiles=dev
   ```

### Option B: Using IDE (IntelliJ IDEA / Eclipse)

1. Open the `backend` folder in your IDE
2. Open `IntegratorsApplication.java`
3. Right-click → Run `IntegratorsApplication`

### Verify Backend is Running

- ✅ Backend should start on `http://localhost:8080`
- ✅ Test API: Open `http://localhost:8080/api/products/services` in browser
- ✅ You should see JSON response with services

**Default Login Credentials:**
- Email: `admin@integrators.com`
- Password: `admin123`

---

## Step 2: Start the Mobile App

### 1. Install Dependencies (First Time Only)

```bash
# Make sure you're in the root directory (not backend)
cd /Users/arbazkhan/Data/Codes/SanjayCommNew

# Install npm packages
npm install
```

### 2. Start Expo Development Server

```bash
npm start
```

This will:
- Start the Metro bundler
- Show a QR code in terminal
- Open Expo DevTools in browser

### 3. Run on Your Device/Emulator

**Option A: Physical Device (Recommended)**

1. **Install Expo Go app:**
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Connect to same WiFi** as your computer

3. **Scan QR code** from terminal with:
   - iOS: Camera app
   - Android: Expo Go app

**Option B: iOS Simulator (Mac only)**

1. Press `i` in the terminal where Expo is running
2. Or run: `npm run ios`

**Option C: Android Emulator**

1. Start Android Studio emulator first
2. Press `a` in the terminal where Expo is running
3. Or run: `npm run android`

---

## Step 3: Configure API Connection

### For Android Emulator:
The app is already configured to use `http://10.0.2.2:8080/api`

### For iOS Simulator:
The app is already configured to use `http://localhost:8080/api`

### For Physical Device:
You need to update the API URL to your computer's IP address:

1. **Find your computer's IP address:**
   ```bash
   # Mac/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1
   
   # Windows
   ipconfig
   ```
   Look for something like: `192.168.1.100`

2. **Update API URL:**
   Edit `src/utils/apiConfig.js`:
   ```javascript
   // For physical device, replace with your IP:
   return 'http://192.168.1.100:8080/api';
   ```

---

## Quick Start Commands

### Terminal 1 - Backend:
```bash
cd backend
mvn spring-boot:run
```

### Terminal 2 - Mobile App:
```bash
npm start
```

Then press:
- `i` for iOS simulator
- `a` for Android emulator
- Scan QR code for physical device

---

## Troubleshooting

### Backend Issues

**Port 8080 already in use:**
```bash
# Find and kill the process
lsof -ti:8080 | xargs kill -9
```

**Database connection error:**
- For development, use H2: `mvn spring-boot:run -Dspring-boot.run.profiles=dev`
- For MySQL, check `application.properties` and ensure MySQL is running

**Build errors:**
```bash
cd backend
mvn clean install
```

### Mobile App Issues

**Module not found:**
```bash
rm -rf node_modules
npm install
```

**Expo not connecting:**
- Ensure phone and computer are on same WiFi
- Try tunnel mode: `npm start -- --tunnel`

**Metro bundler errors:**
```bash
npm start -- --clear
```

**API connection errors:**
- Verify backend is running on port 8080
- Check API URL in `src/utils/apiConfig.js`
- For physical device, use your computer's IP address

---

## Testing the App

1. **Login:**
   - Email: `admin@integrators.com`
   - Password: `admin123`

2. **Browse Products:**
   - Go to "Sales" service
   - Explore categories: CCTV Systems, Fire Alarms, Biometrics, etc.

3. **Test Service Request:**
   - Click on any category
   - Click "Raise Service Request" button
   - Fill the form and submit

4. **Add to Cart:**
   - Browse products → Select brand → Select model
   - View product details
   - Add to cart

---

## Development Tips

### Hot Reload
- Both backend and frontend support hot reload
- Backend: Changes require restart
- Mobile: Changes auto-reload (shake device for menu)

### View Backend Logs
- Check terminal where backend is running
- Look for API requests and responses

### View Mobile Logs
- Shake device → "Show Dev Menu" → "Debug Remote JS"
- Or check Expo DevTools in browser

---

## Next Steps

Once everything is running:
1. ✅ Test login/register
2. ✅ Browse products by category
3. ✅ Test service request functionality
4. ✅ Add products to cart
5. ✅ Test checkout flow

---

## Need Help?

- Check backend logs for API errors
- Check mobile app console for frontend errors
- Verify API URL is correct
- Ensure both backend and mobile app are running

---

**Happy Coding! 🚀**
