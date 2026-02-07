import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ProductCard from '../components/ProductCard';
import { COLORS } from '../utils/constants';
import { productAPI } from '../services/api';

const ProductsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    loadAllProducts(); // Load all products by default
  }, []);

  useEffect(() => {
    if (searchQuery) {
      searchProducts();
    } else {
      // When search is cleared, show all products again
      loadAllProducts();
    }
  }, [searchQuery]);

  const loadAllProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAllProducts({ page: 0, size: 100 });
      setProducts(response.data?.content ?? []);
    } catch (error) {
      console.error('Error loading all products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async () => {
    try {
      setSearchLoading(true);
      const response = await productAPI.searchProducts(searchQuery);
      setProducts(response.data);
    } catch (error) {
      console.error('Error searching products:', error);
      setProducts([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Sort products
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => parseFloat(a.price || 0) - parseFloat(b.price || 0));
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => parseFloat(b.price || 0) - parseFloat(a.price || 0));
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return filtered;
  }, [products, sortBy]);

  const renderProduct = ({ item }) => <ProductCard product={item} />;

  if (loading && !searchQuery) {
    return (
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.textLight} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.textLight}
          />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.textLight} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={COLORS.textLight}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={COLORS.textLight} />
          </TouchableOpacity>
        )}
      </View>

      {/* Products List */}
      {loading && !searchQuery ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : searchQuery && searchLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      ) : products.length > 0 ? (
        <>
          {/* Filter and Sort - Show when products are loaded */}
          <View style={styles.filterContainer}>
            <View style={styles.filterRow}>
              <Text style={styles.resultsText}>
                {searchQuery ? `${filteredProducts.length} Results` : `${filteredProducts.length} Products`}
              </Text>
              <TouchableOpacity
                style={styles.sortButton}
                onPress={() => {
                  const options = ['default', 'price-low', 'price-high', 'rating'];
                  const currentIndex = options.indexOf(sortBy);
                  const nextIndex = (currentIndex + 1) % options.length;
                  setSortBy(options[nextIndex]);
                }}
              >
                <Ionicons name="options" size={20} color={COLORS.primary} />
                <Text style={styles.sortText}>
                  {sortBy === 'default'
                    ? 'Sort'
                    : sortBy === 'price-low'
                    ? 'Price: Low to High'
                    : sortBy === 'price-high'
                    ? 'Price: High to Low'
                    : 'Rating'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <FlatList
            data={filteredProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={64} color={COLORS.textLight} />
          <Text style={styles.emptyText}>No products found</Text>
          <Text style={styles.emptySubtext}>
            {searchQuery ? 'Try adjusting your search or filters' : 'No products available'}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
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
  filterContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultsText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  sortText: {
    fontSize: 14,
    color: COLORS.primary,
    marginLeft: 4,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default ProductsScreen;
