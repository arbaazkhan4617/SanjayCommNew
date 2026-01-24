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
import { useNavigation } from '@react-navigation/native';
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
      const [productsRes, categoriesRes, brandsRes, modelsRes] = await Promise.all([
        adminAPI.getAllProducts(),
        adminAPI.getAllCategories(),
        adminAPI.getAllBrands(),
        adminAPI.getAllModels(),
      ]);

      setStats({
        totalProducts: productsRes.data?.length || 0,
        totalCategories: categoriesRes.data?.length || 0,
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
      await AsyncStorage.removeItem('adminUser');
      navigation.replace('AdminLogin');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading && !stats.totalProducts) {
    return (
      <View style={styles.container}>
        <Header title="Admin Dashboard" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Admin Dashboard" />
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
          <View style={styles.statCard}>
            <Ionicons name="layers-outline" size={32} color={COLORS.primary} />
            <Text style={styles.statNumber}>{stats.totalModels}</Text>
            <Text style={styles.statLabel}>Models</Text>
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
            onPress={() => navigation.navigate('AddEditProduct', { mode: 'add' })}
          >
            <View style={[styles.actionIconContainer, { backgroundColor: COLORS.primary + '20' }]}>
              <Ionicons name="add-circle" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Add New Product</Text>
              <Text style={styles.actionSubtitle}>Create a new product entry</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={COLORS.textLight} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('CategoryManagement')}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name="grid" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Manage Categories</Text>
              <Text style={styles.actionSubtitle}>Organize product categories</Text>
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
    </View>
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
    minWidth: '45%',
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
