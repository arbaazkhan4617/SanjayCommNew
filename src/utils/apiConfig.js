import { Platform } from 'react-native';

/**
 * API Configuration
 * 
 * For Android Emulator: Use http://10.0.2.2:8080/api
 * For iOS Simulator: Use http://localhost:8080/api
 * For Physical Device: Use http://YOUR_COMPUTER_IP:8080/api
 * 
 * To find your computer's IP:
 * - Mac/Linux: ifconfig | grep "inet "
 * - Windows: ipconfig
 */

// Uncomment and set your computer's IP for physical device testing
// const PHYSICAL_DEVICE_IP = '192.168.1.100'; // Change this to your IP

// Get API URL from environment variable or use default
const getApiBaseUrl = () => {
  // Check for environment variable first (for production builds)
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  
  if (__DEV__) {
    // For physical device testing, uncomment the line below and set your IP
    // if (PHYSICAL_DEVICE_IP) return `http://${PHYSICAL_DEVICE_IP}:8080/api`;
    
    // Android emulator uses special IP
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:8080/api';
    }
    // iOS simulator uses localhost
    return 'http://localhost:8080/api';
  }
  // Production URL - Update this with your Railway backend URL
  return 'https://your-app-name.railway.app/api';
};

export const API_BASE_URL = getApiBaseUrl();

// Log for debugging
if (__DEV__) {
  console.log('📱 Platform:', Platform.OS);
  console.log('🌐 API Base URL:', API_BASE_URL);
  console.log('💡 To use physical device, update PHYSICAL_DEVICE_IP in src/utils/apiConfig.js');
}
