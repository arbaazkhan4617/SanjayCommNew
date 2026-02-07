import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import ProductCard from '../components/ProductCard';
import { COLORS } from '../utils/constants';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { productAPI, orderAPI, serviceRequestAPI } from '../services/api';

const RECENTLY_VIEWED_KEY = 'RECENTLY_VIEWED_PRODUCTS';
const MAX_RECENT = 10;

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { getCartCount } = useCart();
  const cartCount = getCartCount();
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [dealsProducts, setDealsProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [requestsCount, setRequestsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadRecentlyViewed = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(RECENTLY_VIEWED_KEY);
      const list = raw ? JSON.parse(raw) : [];
      setRecentlyViewed(Array.isArray(list) ? list.slice(0, MAX_RECENT) : []);
    } catch {
      setRecentlyViewed([]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadRecentlyViewed();
    }, [loadRecentlyViewed])
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [
        categoriesRes,
        productsRes,
        newArrivalsRes,
        popularRes,
        dealsRes,
      ] = await Promise.all([
        productAPI.getCategories(),
        productAPI.getAllProducts({ page: 0, size: 4 }),
        productAPI.getNewArrivals(4),
        productAPI.getPopular(4),
        productAPI.getDeals({ page: 0, size: 8 }),
      ]);
      setCategories(categoriesRes.data || []);
      setFeaturedProducts((productsRes.data?.content ?? productsRes.data ?? []).slice(0, 4));
      setNewArrivals(newArrivalsRes.data || []);
      setPopularProducts(popularRes.data || []);
      setDealsProducts((dealsRes.data?.content ?? []).slice(0, 8));
    } catch (error) {
      console.error('Error loading data:', error);
      setCategories([]);
      setFeaturedProducts([]);
      setNewArrivals([]);
      setPopularProducts([]);
      setDealsProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.id) {
      setRequestsCount(0);
      return;
    }
    const fetchRequestsCount = async () => {
      try {
        const [ordersRes, requestsRes] = await Promise.all([
          orderAPI.getUserOrders(user.id),
          serviceRequestAPI.getUserServiceRequests(user.id),
        ]);
        const orders = ordersRes.data || [];
        const requests = requestsRes.data || [];
        const pending = [...orders.filter((o) => o.status === 'PENDING'), ...requests.filter((r) => r.status === 'PENDING' || r.status === 'IN_PROGRESS')];
        setRequestsCount(pending.length);
      } catch {
        setRequestsCount(0);
      }
    };
    fetchRequestsCount();
  }, [user?.id]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topHeader}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>Integrators</Text>
          <Text style={styles.tagline}>Secure. Smart. Connected.</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate('Search')} style={styles.iconButton}>
            <Ionicons name="search" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              const parent = navigation.getParent();
              if (parent) parent.navigate('CartTab');
              else navigation.navigate('Cart');
            }}
            style={styles.iconButton}
          >
            <Ionicons name="cart" size={24} color={COLORS.text} />
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount > 9 ? '9+' : cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Banner */}
          <View style={styles.banner}>
            <Text style={styles.bannerTitle}>Get Best Price in 24 Hours</Text>
            <Text style={styles.bannerSubtitle}>
              Request a quote and we’ll get back within 24 hours
            </Text>
            <TouchableOpacity
              style={styles.bannerButton}
              onPress={() =>
                navigation.navigate('ServiceRequest', {
                  subject: 'Request for Quotation',
                  description:
                    'I would like to receive a quotation. Please describe your product or service requirements below and we will get back to you within 24 hours.',
                  requestType: 'quotation',
                })
              }
            >
              <Text style={styles.bannerButtonText}>Get Quotation</Text>
            </TouchableOpacity>
          </View>

          {/* Categories */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Categories</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={styles.categoryCard}
                  onPress={() => navigation.navigate('SubCategories', { category: cat })}
                >
                  <View style={styles.categoryIcon}>
                    <Ionicons name={cat.icon || 'grid-outline'} size={32} color={COLORS.primary} />
                  </View>
                  <Text style={styles.categoryName}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Section 1: Featured */}
          {featuredProducts.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Featured Products</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Products')}>
                  <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.productsGrid}>
                {featuredProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </View>
            </View>
          )}

          {/* Section 2: New Arrivals */}
          {newArrivals.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>New Arrivals</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Products')}>
                  <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScrollContent}
              >
                {newArrivals.map((p) => (
                  <View key={p.id} style={styles.horizontalCard}>
                    <ProductCard product={p} fullWidth />
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Section 3: Popular */}
          {popularProducts.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Popular Products</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Products')}>
                  <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScrollContent}
              >
                {popularProducts.map((p) => (
                  <View key={p.id} style={styles.horizontalCard}>
                    <ProductCard product={p} fullWidth />
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Section 4: Recently Viewed */}
          {recentlyViewed.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recently Viewed</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScrollContent}
              >
                {recentlyViewed.map((p) => (
                  <View key={p.id} style={styles.horizontalCard}>
                    <ProductCard product={p} fullWidth />
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* My Requests */}
          {user && (
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.myRequestsCard}
                onPress={() => navigation.navigate('MyRequests')}
                activeOpacity={0.8}
              >
                <Ionicons name="document-text" size={28} color={COLORS.primary} />
                <View style={styles.myRequestsText}>
                  <Text style={styles.myRequestsTitle}>My Requests</Text>
                  <Text style={styles.myRequestsSubtitle}>
                    View quotation & service request status
                  </Text>
                </View>
                {requestsCount > 0 && (
                  <View style={styles.requestsBadge}>
                    <Text style={styles.requestsBadgeText}>{requestsCount}</Text>
                  </View>
                )}
                <Ionicons name="chevron-forward" size={22} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>
          )}

          {/* Deals */}
          {dealsProducts.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Deals & Offers</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Products')}>
                  <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.productsGrid}>
                {dealsProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </View>
            </View>
          )}

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>2000+</Text>
              <Text style={styles.statLabel}>Customers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>13+</Text>
              <Text style={styles.statLabel}>Years</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>100%</Text>
              <Text style={styles.statLabel}>Satisfaction</Text>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;

export { RECENTLY_VIEWED_KEY, MAX_RECENT };

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logoContainer: { flex: 1 },
  logo: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary },
  tagline: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  iconButton: { padding: 8, marginLeft: 8, position: 'relative' },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { color: COLORS.background, fontSize: 10, fontWeight: 'bold' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, color: COLORS.textLight },
  banner: {
    backgroundColor: COLORS.primary,
    padding: 24,
    margin: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.background,
    marginBottom: 8,
    textAlign: 'center',
  },
  bannerSubtitle: {
    fontSize: 14,
    color: COLORS.background,
    marginBottom: 16,
    textAlign: 'center',
    opacity: 0.95,
  },
  bannerButton: { backgroundColor: COLORS.background, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  bannerButtonText: { color: COLORS.primary, fontSize: 16, fontWeight: 'bold' },
  section: { marginVertical: 16 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.text },
  seeAll: { fontSize: 14, color: COLORS.primary, fontWeight: '600' },
  categoriesScroll: { paddingLeft: 16 },
  categoryCard: { alignItems: 'center', marginRight: 16, width: 100 },
  categoryIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: { fontSize: 12, color: COLORS.text, textAlign: 'center' },
  productsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 8 },
  horizontalScrollContent: { paddingHorizontal: 16, paddingRight: 16 },
  horizontalCard: { width: 168, marginRight: 12 },
  myRequestsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  myRequestsText: { flex: 1, marginLeft: 12 },
  myRequestsTitle: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  myRequestsSubtitle: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  requestsBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  requestsBadgeText: { color: COLORS.background, fontSize: 12, fontWeight: 'bold' },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 24,
    backgroundColor: COLORS.border,
    margin: 16,
    borderRadius: 12,
  },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 28, fontWeight: 'bold', color: COLORS.primary },
  statLabel: { fontSize: 14, color: COLORS.textLight, marginTop: 4 },
});
