import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../utils/constants';
import { adminAPI } from '../services/api';
import Toast from 'react-native-toast-message';

const AdminDashboardScreen = () => {
  const navigation = useNavigation();
  const [adminUser, setAdminUser] = useState(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalSubCategories: 0,
    totalBrands: 0,
    totalModels: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAdminUser();
    loadStats();
  }, []);

  const loadAdminUser = async () => {
    try {
      const adminData = await AsyncStorage.getItem('adminUser');
      if (adminData) {
        setAdminUser(JSON.parse(adminData));
      }
    } catch (error) {
      console.error('Error loading admin user:', error);
    }
  };

  const loadStats = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes, subCategoriesRes, brandsRes, modelsRes] = await Promise.all([
        adminAPI.getAllProducts(),
        adminAPI.getAllCategories(),
        adminAPI.getAllSubCategories(),
        adminAPI.getAllBrands(),
        adminAPI.getAllModels(),
      ]);

      setStats({
        totalProducts: productsRes.data?.length || 0,
        totalCategories: categoriesRes.data?.length || 0,
        totalSubCategories: subCategoriesRes.data?.length || 0,
        totalBrands: brandsRes.data?.length || 0,
        totalModels: modelsRes.data?.length || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load dashboard stats',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadStats();
  };

  const handleLogout = async () => {
    try {
      // Clear admin user from storage
      await AsyncStorage.removeItem('adminUser');
      
      Toast.show({
        type: 'success',
        text1: 'Logged Out',
        text2: 'Redirecting to login...',
      });
      
      // Get the root navigator
      let rootNavigator = navigation;
      while (rootNavigator.getParent && rootNavigator.getParent()) {
        rootNavigator = rootNavigator.getParent();
      }
      
      // Force a state check by triggering a navigation action
      // This will cause onStateChange to fire, which will check adminUser
      // and update the navigation structure
      rootNavigator.dispatch((state) => {
        return CommonActions.navigate({
          name: state.routes[state.index].name,
          params: state.routes[state.index].params,
        });
      });
      
      // Wait for React to re-render with updated navigation structure
      // Then navigate to Login (regular user login screen)
      setTimeout(() => {
        requestAnimationFrame(() => {
          try {
            rootNavigator.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              })
            );
          } catch (navError) {
            console.log('Navigation error, retrying...', navError);
            // Retry after another frame
            setTimeout(() => {
              try {
                rootNavigator.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                  })
                );
              } catch (e) {
                console.log('Navigation will update automatically');
              }
            }, 200);
          }
        });
      }, 100);
    } catch (error) {
      console.error('Error logging out:', error);
      Toast.show({
        type: 'error',
        text1: 'Logout Error',
        text2: 'Failed to logout. Please try again.',
      });
    }
  };

  if (loading && !stats.totalProducts) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="Admin Dashboard" showSearch={false} showCart={false} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Admin Dashboard" showSearch={false} showCart={false} />
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome, {adminUser?.name || 'Admin'}</Text>
            <Text style={styles.subtitle}>Manage your products and inventory</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="cube-outline" size={32} color={COLORS.primary} />
            <Text style={styles.statNumber}>{stats.totalProducts}</Text>
            <Text style={styles.statLabel}>Products</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="grid-outline" size={32} color={COLORS.primary} />
            <Text style={styles.statNumber}>{stats.totalCategories}</Text>
            <Text style={styles.statLabel}>Categories</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="pricetag-outline" size={32} color={COLORS.primary} />
            <Text style={styles.statNumber}>{stats.totalBrands}</Text>
            <Text style={styles.statLabel}>Brands</Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('ProductManagement')}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name="cube" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Manage Products</Text>
              <Text style={styles.actionSubtitle}>Add, edit, or delete products</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={COLORS.textLight} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('CategoryManagement')}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name="folder" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Manage Categories</Text>
              <Text style={styles.actionSubtitle}>CCTV, Networking, Access Controls, etc.</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={COLORS.textLight} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('SubCategoryManagement')}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name="grid" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Manage Sub Categories</Text>
              <Text style={styles.actionSubtitle}>IP Cameras, Analog Cameras, etc.</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={COLORS.textLight} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('BrandManagement')}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name="pricetag" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Manage Brands</Text>
              <Text style={styles.actionSubtitle}>Add or edit brands</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={COLORS.textLight} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.background,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  logoutButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
  },
  actionsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: COLORS.textLight,
  },
});

export default AdminDashboardScreen;
