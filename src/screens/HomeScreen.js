import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ProductCard from '../components/ProductCard';
import { COLORS } from '../utils/constants';
import { useCart } from '../context/CartContext';
import { productAPI } from '../services/api';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { getCartCount } = useCart();
  const cartCount = getCartCount();
  const [services, setServices] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [servicesResponse, productsResponse] = await Promise.all([
        productAPI.getServices(),
        productAPI.getAllProducts(),
      ]);
      setServices(servicesResponse.data);
      setFeaturedProducts(productsResponse.data.slice(0, 4));
    } catch (error) {
      console.error('Error loading data:', error);
      console.error('Error details:', error.message);
      console.error('API URL:', error.config?.url);
      // Fallback to empty arrays on error - app will still work
      setServices([]);
      setFeaturedProducts([]);
      // Don't show error to user on initial load - app can work offline
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>Integrators</Text>
          <Text style={styles.tagline}>Secure. Smart. Connected.</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Search')}
            style={styles.iconButton}
          >
            <Ionicons name="search" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              // Navigate to Cart tab
              const parent = navigation.getParent();
              if (parent) {
                parent.navigate('CartTab');
              } else {
                navigation.navigate('Cart');
              }
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
            <Text style={styles.bannerTitle}>Complete Security Solutions</Text>
            <Text style={styles.bannerSubtitle}>
              For Homes, Offices, and Industries
            </Text>
            <TouchableOpacity
              style={styles.bannerButton}
              onPress={() => navigation.navigate('Products')}
            >
              <Text style={styles.bannerButtonText}>Shop Now</Text>
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
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesScroll}
            >
              {services.map((service) => (
                <TouchableOpacity
                  key={service.id}
                  style={styles.categoryCard}
                  onPress={() =>
                    navigation.navigate('ProductCategories', { service })
                  }
                >
                  <View style={styles.categoryIcon}>
                    <Ionicons 
                      name={service.icon || 'grid-outline'} 
                      size={32} 
                      color={COLORS.primary} 
                    />
                  </View>
                  <Text style={styles.categoryName}>{service.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Featured Products */}
          {featuredProducts.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Featured Products</Text>
              </View>
              <View style={styles.productsGrid}>
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
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
  logoContainer: {
    flex: 1,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  tagline: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
    position: 'relative',
  },
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
  badgeText: {
    color: COLORS.background,
    fontSize: 10,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: COLORS.textLight,
  },
  banner: {
    backgroundColor: COLORS.primary,
    padding: 24,
    margin: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.background,
    marginBottom: 8,
    textAlign: 'center',
  },
  bannerSubtitle: {
    fontSize: 16,
    color: COLORS.background,
    marginBottom: 16,
    textAlign: 'center',
  },
  bannerButton: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  bannerButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    marginVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  seeAll: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  categoriesScroll: {
    paddingLeft: 16,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: 16,
    width: 100,
  },
  categoryIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    color: COLORS.text,
    textAlign: 'center',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 24,
    backgroundColor: COLORS.border,
    margin: 16,
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 4,
  },
});

export default HomeScreen;
