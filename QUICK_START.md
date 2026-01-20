# Quick Start Guide

## Getting Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start the Development Server
```bash
npm start
```

### Step 3: Run on Your Device

**Option A: Physical Device (Recommended for first-time setup)**
1. Install **Expo Go** app on your phone:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
2. Scan the QR code shown in your terminal/browser
3. The app will load on your device

**Option B: iOS Simulator (Mac only)**
1. Press `i` in the terminal
2. Make sure Xcode is installed

**Option C: Android Emulator**
1. Press `a` in the terminal
2. Make sure Android Studio is installed and emulator is running

## Testing the App

### Default Login Credentials
Since this is a demo app, you can use any email/password to login. The authentication is currently mocked.

### Sample Products
The app comes with sample products pre-loaded. You can:
- Browse products by category
- Search for products
- Add items to cart
- View product details
- Proceed to checkout (mock order placement)

## Project Structure Overview

```
src/
├── screens/        # All app screens
├── components/     # Reusable UI components
├── context/        # State management (Auth, Cart)
├── services/       # API service layer
└── utils/          # Constants and utilities
```

## Common Commands

```bash
# Start development server
npm start

# Clear cache and restart
npm start -- --clear

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

## Troubleshooting

### Issue: "Module not found"
**Solution**: Delete `node_modules` and reinstall
```bash
rm -rf node_modules
npm install
```

### Issue: "Expo Go app not connecting"
**Solution**: 
- Make sure your phone and computer are on the same WiFi network
- Try using tunnel mode: `npm start -- --tunnel`

### Issue: "Metro bundler error"
**Solution**: Clear cache
```bash
npm start -- --clear
```

## Next Steps

1. **Add Real Images**: Replace placeholder images in `src/utils/constants.js`
2. **Connect Backend**: Update API endpoints in `src/services/api.js`
3. **Add Payment Gateway**: Integrate Razorpay or Stripe
4. **Configure Push Notifications**: Set up FCM/APNS
5. **Add Analytics**: Integrate Firebase Analytics or similar

## Need Help?

- Check the main [README.md](./README.md) for detailed documentation
- Visit [Expo Documentation](https://docs.expo.dev/)
- Contact: sales@sanjaycomm.com
