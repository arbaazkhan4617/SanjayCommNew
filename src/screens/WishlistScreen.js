import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { COLORS } from '../utils/constants';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

const WishlistScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { wishlist, loading, refresh } = useWishlist();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  if (!user) {
    return (
      <View style={styles.container}>
        <Header title="Wishlist" />
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={80} color={COLORS.textLight} />
          <Text style={styles.emptyText}>Log in to see your wishlist</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Profile')}>
            <Text style={styles.primaryButtonText}>Go to Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (loading && wishlist.length === 0) {
    return (
      <View style={styles.container}>
        <Header title="Wishlist" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading wishlist...</Text>
        </View>
      </View>
    );
  }

  if (wishlist.length === 0) {
    return (
      <View style={styles.container}>
        <Header title="Wishlist" />
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={80} color={COLORS.textLight} />
          <Text style={styles.emptyText}>Your wishlist is empty</Text>
          <Text style={styles.emptySubtext}>Save products to compare or buy later</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Products')}>
            <Text style={styles.primaryButtonText}>Browse Products</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Wishlist" />
      <FlatList
        data={wishlist}
        keyExtractor={(item) => item.id?.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.cardWrap}>
            <ProductCard product={item} showWishlist={true} fullWidth />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: COLORS.textLight },
  listContent: { padding: 8, paddingBottom: 24 },
  cardWrap: { width: '50%' },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: { fontSize: 18, fontWeight: '600', color: COLORS.text, marginTop: 16, textAlign: 'center' },
  emptySubtext: { fontSize: 14, color: COLORS.textLight, marginTop: 8, textAlign: 'center' },
  primaryButton: {
    marginTop: 24,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  primaryButtonText: { color: COLORS.background, fontSize: 16, fontWeight: '600' },
});

export default WishlistScreen;
