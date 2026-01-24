import 'dotenv/config';

export default {
  expo: {
    name: "Integrators",
    slug: "integrators-app",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "light",
    splash: {
      resizeMode: "contain",
      backgroundColor: "#FF6B35"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.integrators.app"
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#FF6B35"
      },
      package: "com.integrators.app"
    },
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL || "https://sanjaycommnew-production.up.railway.app/api",
      eas: {
        projectId: "a205eb2b-2723-4438-b198-2c79294bd53b"
      }
    }
  }
};
