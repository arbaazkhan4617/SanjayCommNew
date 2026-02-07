import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../utils/constants';
import { useWishlist } from '../context/WishlistContext';
import Toast from 'react-native-toast-message';

const ProductCard = ({ product, showWishlist = true, fullWidth }) => {
  const navigation = useNavigation();
  const { isInWishlist, add, remove } = useWishlist();
  const inWishlist = isInWishlist(product?.id);
  const discount = product?.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleWishlistPress = async (e) => {
    if (!product?.id) return;
    if (inWishlist) {
      await remove(product.id);
      Toast.show({ type: 'info', text1: 'Removed from wishlist' });
    } else {
      const ok = await add(product.id);
      if (ok) Toast.show({ type: 'success', text1: 'Added to wishlist' });
      else Toast.show({ type: 'error', text1: 'Please log in to add to wishlist' });
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, fullWidth && styles.cardFullWidth]}
      onPress={() => navigation.navigate('ProductDetail', { product })}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: product?.image || product?.model?.image || 'https://via.placeholder.com/300x300?text=Product' }} 
          style={styles.image} 
        />
        {showWishlist && (
          <TouchableOpacity
            style={styles.wishlistButton}
            onPress={handleWishlistPress}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons
              name={inWishlist ? 'heart' : 'heart-outline'}
              size={22}
              color={inWishlist ? '#E11D48' : COLORS.text}
            />
          </TouchableOpacity>
        )}
        {discount > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{discount}% OFF</Text>
          </View>
        )}
        {!product?.inStock && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.category}>{product?.category?.name || product?.service?.name || (typeof product?.category === 'string' ? product.category : null) || 'Product'}</Text>
        <Text style={styles.name} numberOfLines={2}>{product?.name}</Text>
        
        {(product?.rating || product?.reviews) && (
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.rating}>{product?.rating ?? 0}</Text>
            {product?.reviews != null && (
              <Text style={styles.reviews}>({product.reviews})</Text>
            )}
          </View>
        )}
        
        <View style={styles.priceContainer}>
          <Text style={styles.price}>₹{parseFloat(product?.price || 0).toLocaleString()}</Text>
          {product?.originalPrice != null && (
            <Text style={styles.originalPrice}>₹{parseFloat(product.originalPrice).toLocaleString()}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    margin: 8,
    width: '45%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  cardFullWidth: {
    width: '100%',
    margin: 0,
    marginRight: 0,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 180,
    backgroundColor: COLORS.border,
  },
  wishlistButton: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: COLORS.background,
    fontSize: 10,
    fontWeight: 'bold',
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: 'bold',
  },
  content: {
    padding: 12,
  },
  category: {
    fontSize: 11,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
    minHeight: 36,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 4,
  },
  reviews: {
    fontSize: 11,
    color: COLORS.textLight,
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  originalPrice: {
    fontSize: 12,
    color: COLORS.textLight,
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
});

export default ProductCard;
