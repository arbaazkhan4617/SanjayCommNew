import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import ProductsScreen from './src/screens/ProductsScreen';
import CategoriesScreen from './src/screens/CategoriesScreen';
import SubCategoriesScreen from './src/screens/SubCategoriesScreen';
import BrandsScreen from './src/screens/BrandsScreen';
import ModelsScreen from './src/screens/ModelsScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import CartScreen from './src/screens/CartScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import OrdersScreen from './src/screens/OrdersScreen';
import SearchScreen from './src/screens/SearchScreen';
import ServiceRequestScreen from './src/screens/ServiceRequestScreen';
import AboutUsScreen from './src/screens/AboutUsScreen';
import AddressesScreen from './src/screens/AddressesScreen';
import PaymentMethodsScreen from './src/screens/PaymentMethodsScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import HelpSupportScreen from './src/screens/HelpSupportScreen';
import SalesLoginScreen from './src/screens/SalesLoginScreen';
import SalesDashboardScreen from './src/screens/SalesDashboardScreen';
import SalesOrdersScreen from './src/screens/SalesOrdersScreen';
import SalesServiceRequestsScreen from './src/screens/SalesServiceRequestsScreen';
import AdminLoginScreen from './src/screens/AdminLoginScreen';
import AdminDashboardScreen from './src/screens/AdminDashboardScreen';
import ProductManagementScreen from './src/screens/ProductManagementScreen';
import AddEditProductScreen from './src/screens/AddEditProductScreen';
import CategoryManagementScreen from './src/screens/CategoryManagementScreen';
import SubCategoryManagementScreen from './src/screens/SubCategoryManagementScreen';
import BrandManagementScreen from './src/screens/BrandManagementScreen';
import UsersScreen from './src/screens/UsersScreen';
import MyRequestsScreen from './src/screens/MyRequestsScreen';
import WishlistScreen from './src/screens/WishlistScreen';

// Context
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import { WishlistProvider } from './src/context/WishlistContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Home Stack - Contains Home and Search
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Products" component={ProductsScreen} />
      <Stack.Screen name="Categories" component={CategoriesScreen} />
      <Stack.Screen name="SubCategories" component={SubCategoriesScreen} />
      <Stack.Screen name="Brands" component={BrandsScreen} />
      <Stack.Screen name="Models" component={ModelsScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="ServiceRequest" component={ServiceRequestScreen} />
      <Stack.Screen name="MyRequests" component={MyRequestsScreen} />
      <Stack.Screen name="Wishlist" component={WishlistScreen} />
    </Stack.Navigator>
  );
}

// Products Stack - Contains Products and related screens
function ProductsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Products" component={ProductsScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Categories" component={CategoriesScreen} />
      <Stack.Screen name="SubCategories" component={SubCategoriesScreen} />
      <Stack.Screen name="Brands" component={BrandsScreen} />
      <Stack.Screen name="Models" component={ModelsScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="ServiceRequest" component={ServiceRequestScreen} />
      <Stack.Screen name="MyRequests" component={MyRequestsScreen} />
      <Stack.Screen name="Wishlist" component={WishlistScreen} />
    </Stack.Navigator>
  );
}

// Cart Stack - Contains Cart and Checkout
function CartStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="Products" component={ProductsScreen} />
      <Stack.Screen name="Categories" component={CategoriesScreen} />
      <Stack.Screen name="SubCategories" component={SubCategoriesScreen} />
      <Stack.Screen name="Brands" component={BrandsScreen} />
      <Stack.Screen name="Models" component={ModelsScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Orders" component={OrdersScreen} />
      <Stack.Screen name="MyRequests" component={MyRequestsScreen} />
      <Stack.Screen name="Wishlist" component={WishlistScreen} />
    </Stack.Navigator>
  );
}

// Profile Stack - Contains Profile and related screens
function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Orders" component={OrdersScreen} />
      <Stack.Screen name="AboutUs" component={AboutUsScreen} />
      <Stack.Screen name="ServiceRequest" component={ServiceRequestScreen} />
      <Stack.Screen name="Addresses" component={AddressesScreen} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
      <Stack.Screen name="MyRequests" component={MyRequestsScreen} />
      <Stack.Screen name="Wishlist" component={WishlistScreen} />
      <Stack.Screen name="Products" component={ProductsScreen} />
      <Stack.Screen name="Categories" component={CategoriesScreen} />
      <Stack.Screen name="SubCategories" component={SubCategoriesScreen} />
      <Stack.Screen name="Brands" component={BrandsScreen} />
      <Stack.Screen name="Models" component={ModelsScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        return {
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'HomeTab') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'ProductsTab') {
              iconName = focused ? 'grid' : 'grid-outline';
            } else if (route.name === 'CartTab') {
              iconName = focused ? 'cart' : 'cart-outline';
            } else if (route.name === 'ProfileTab') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#FF6B35',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
          tabBarStyle: {
            paddingBottom: Math.max(insets.bottom, 8),
            height: 60 + Math.max(insets.bottom, 8),
            paddingTop: 8,
          },
        };
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeStack}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen 
        name="ProductsTab" 
        component={ProductsStack}
        options={{ tabBarLabel: 'Products' }}
      />
      <Tab.Screen 
        name="CartTab" 
        component={CartStack}
        options={{ tabBarLabel: 'Cart' }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileStack}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

// Sales Stack Navigator
function SalesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SalesDashboard" component={SalesDashboardScreen} />
      <Stack.Screen name="SalesOrders" component={SalesOrdersScreen} />
      <Stack.Screen name="SalesServiceRequests" component={SalesServiceRequestsScreen} />
    </Stack.Navigator>
  );
}

// Admin Stack Navigator
function AdminStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <Stack.Screen name="ProductManagement" component={ProductManagementScreen} />
      <Stack.Screen name="AddEditProduct" component={AddEditProductScreen} />
      <Stack.Screen name="CategoryManagement" component={CategoryManagementScreen} />
      <Stack.Screen name="SubCategoryManagement" component={SubCategoryManagementScreen} />
      <Stack.Screen name="BrandManagement" component={BrandManagementScreen} />
      <Stack.Screen name="Users" component={UsersScreen} />
    </Stack.Navigator>
  );
}

// Navigation ref for programmatic navigation
const navigationRef = React.createRef();

function AppNavigator() {
  const { user } = useAuth();
  const [salesUser, setSalesUser] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const [checkingSales, setCheckingSales] = useState(true);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    checkSalesUser();
    checkAdminUser();
  }, []);

  // Re-check users when navigation state might have changed
  useEffect(() => {
    const timer = setTimeout(() => {
      checkSalesUser();
      checkAdminUser();
    }, 500);
    return () => clearTimeout(timer);
  }, [user]);

  // Listen for focus events to re-check admin user (for logout scenarios)
  useEffect(() => {
    const unsubscribe = navigationRef.current?.addListener?.('state', async () => {
      await checkAdminUser();
      await checkSalesUser();
    });
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const checkSalesUser = async () => {
    try {
      const salesData = await AsyncStorage.getItem('salesUser');
      if (salesData) {
        const parsed = JSON.parse(salesData);
        setSalesUser(parsed);
      } else {
        setSalesUser(null);
      }
    } catch (error) {
      console.error('Error checking sales user:', error);
      setSalesUser(null);
    } finally {
      setCheckingSales(false);
    }
  };

  const checkAdminUser = async () => {
    try {
      const adminData = await AsyncStorage.getItem('adminUser');
      if (adminData) {
        const parsed = JSON.parse(adminData);
        setAdminUser(parsed);
      } else {
        setAdminUser(null);
      }
    } catch (error) {
      console.error('Error checking admin user:', error);
      setAdminUser(null);
    } finally {
      setCheckingAdmin(false);
    }
  };

  if (checkingSales || checkingAdmin) {
    return null;
  }

  return (
    <NavigationContainer 
      ref={navigationRef} 
      onStateChange={async () => {
        // Re-check users when navigation state changes
        await checkSalesUser();
        await checkAdminUser();
      }}
      onReady={() => {
        // Also check on ready
        checkSalesUser();
        checkAdminUser();
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {adminUser ? (
          <>
            <Stack.Screen name="AdminStack" component={AdminStack} />
          </>
        ) : salesUser ? (
          <>
            <Stack.Screen name="SalesStack" component={SalesStack} />
          </>
        ) : !user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="SalesLogin" component={SalesLoginScreen} />
            <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
            <Stack.Screen name="SalesStack" component={SalesStack} />
            <Stack.Screen name="AdminStack" component={AdminStack} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="SalesLogin" component={SalesLoginScreen} />
            <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
            <Stack.Screen name="SalesStack" component={SalesStack} />
            <Stack.Screen name="AdminStack" component={AdminStack} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <AppNavigator />
            <StatusBar style="auto" />
            <Toast />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
