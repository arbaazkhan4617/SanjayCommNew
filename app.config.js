import 'dotenv/config';

export default {
  expo: {
    name: "Integrators",
    slug: "integrators-app",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "light",
    icon: "./assets/AppIcon.jpeg",
    splash: {
      resizeMode: "contain",
      backgroundColor: "#FF6B35"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.integrators.app",
      icon: "./assets/AppIcon.jpeg"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/AppIcon.jpeg",
        backgroundColor: "#FF6B35"
      },
      icon: "./assets/AppIcon.jpeg",
      package: "com.integrators.app"
    },
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL || "https://sanjaycommnew-production.up.railway.app/api",
      eas: {
        // a205eb2b-2723-4438-b198-2c79294bd53b - arbaz0210
              projectId:"58b2b30e-44b1-4eff-8c4a-ffc63305525e"
      }
    }
  }
};
