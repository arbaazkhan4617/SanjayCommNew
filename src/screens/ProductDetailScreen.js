import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  TextInput,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { COLORS } from '../utils/constants';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { serviceRequestAPI } from '../services/api';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');

const ProductDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const product = route.params?.product || {};
  const [quantity, setQuantity] = useState(1);
  const [showQuickNav, setShowQuickNav] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [callbackPhone, setCallbackPhone] = useState(user?.phone || '');
  const [callbackPreferredTime, setCallbackPreferredTime] = useState('');

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    Toast.show({
      type: 'success',
      text1: 'Added to Cart',
      text2: `${product.name} has been added to your cart`,
    });
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    setShowActionModal(true);
  };

  const handleGetQuotation = () => {
    setShowActionModal(false);
    const productName = product.name;
    const totalValue = parseFloat(product.price || 0) * quantity;
    
    navigation.navigate('ServiceRequest', {
      subject: 'Request for Quotation',
      description: `I would like to get a quotation for the following item:\n\n${productName}\nQuantity: ${quantity}\n\nTotal Estimated Value: ₹${totalValue.toLocaleString()}\n\nPlease provide a detailed quotation with pricing.`,
      requestType: 'quotation',
    });
  };

  const handleRequestService = () => {
    setShowActionModal(false);
    const productName = product.name;
    
    navigation.navigate('ServiceRequest', {
      subject: 'Service Request',
      description: `I need service support for the following product:\n\n${productName}\nQuantity: ${quantity}\n\nPlease provide service details and schedule.`,
      requestType: 'service',
    });
  };

  const handleRequestCallback = async () => {
    if (!callbackPhone || callbackPhone.trim() === '') {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter your phone number',
      });
      return;
    }

    if (!user?.id) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please login to request callback',
      });
      return;
    }

    try {
      setLoading(true);
      
      const productName = product.name;
      const totalValue = parseFloat(product.price || 0) * quantity;
      const description = `Callback Request for Product:\n\nProduct: ${productName}\nQuantity: ${quantity}\n\nTotal Value: ₹${totalValue.toLocaleString()}\n\nPreferred Time: ${callbackPreferredTime || 'Any time'}\n\nPlease call me at ${callbackPhone} to discuss this product.`;

      await serviceRequestAPI.createServiceRequest({
        userId: user.id,
        subject: 'Request for Callback',
        description: description,
        contactPhone: callbackPhone,
        contactEmail: user.email,
      });

      Toast.show({
        type: 'success',
        text1: 'Request Submitted!',
        text2: 'We will call you back soon',
      });

      setShowActionModal(false);
      setCallbackPhone(user?.phone || '');
      setCallbackPreferredTime('');
    } catch (error) {
      console.error('Error submitting callback request:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.error || error.message || 'Failed to submit request',
      });
    } finally {
      setLoading(false);
    }
  };

  const navigateToTab = (tabName) => {
    const parent = navigation.getParent();
    if (parent) {
      parent.navigate(tabName);
    }
    setShowQuickNav(false);
  };

  const quickNavItems = [
    { name: 'Home', icon: 'home', tab: 'HomeTab', color: COLORS.primary },
    { name: 'Products', icon: 'grid', tab: 'ProductsTab', color: COLORS.primary },
    { name: 'Cart', icon: 'cart', tab: 'CartTab', color: COLORS.primary },
    { name: 'Profile', icon: 'person', tab: 'ProfileTab', color: COLORS.primary },
  ];

  return (
    <View style={styles.container}>
      <Header title="Product Details" showHome={true} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: product.image || product.model?.image || 'https://via.placeholder.com/300x300?text=Product' }} 
            style={styles.image} 
          />
          {discount > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discount}% OFF</Text>
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.content}>
          <Text style={styles.category}>
            {product.category?.name || product.service?.name || product.category || 'Product'}
          </Text>
          <Text style={styles.name}>{product.name}</Text>

          {/* Rating */}
          {(product.rating || product.reviews) && (
            <View style={styles.ratingContainer}>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={20} color="#FFD700" />
                <Text style={styles.rating}>{product.rating || 0}</Text>
                {product.reviews && (
                  <Text style={styles.reviews}>({product.reviews} reviews)</Text>
                )}
              </View>
            </View>
          )}

          {/* Price */}
          <View style={styles.priceContainer}>
            <Text style={styles.price}>₹{parseFloat(product.price || 0).toLocaleString()}</Text>
            {product.originalPrice && (
              <>
                <Text style={styles.originalPrice}>
                  ₹{parseFloat(product.originalPrice).toLocaleString()}
                </Text>
                <Text style={styles.saveText}>
                  You save ₹{(parseFloat(product.originalPrice) - parseFloat(product.price || 0)).toLocaleString()}
                </Text>
              </>
            )}
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Specifications</Text>
              {Object.entries(product.specifications).map(([key, value], index) => (
                <View key={index} style={styles.specItem}>
                  <Text style={styles.specLabel}>{key}:</Text>
                  <Text style={styles.specValue}>{value}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Features (for backward compatibility) */}
          {product.features && product.features.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Key Features</Text>
              {product.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Stock Status */}
          <View style={styles.stockContainer}>
            <Ionicons
              name={product.inStock ? 'checkmark-circle' : 'close-circle'}
              size={20}
              color={product.inStock ? COLORS.success : COLORS.error}
            />
            <Text
              style={[
                styles.stockText,
                { color: product.inStock ? COLORS.success : COLORS.error },
              ]}
            >
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
            style={styles.quantityButton}
          >
            <Ionicons name="remove" size={20} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.quantity}>{quantity}</Text>
          <TouchableOpacity
            onPress={() => setQuantity(quantity + 1)}
            style={styles.quantityButton}
          >
            <Ionicons name="add" size={20} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, styles.cartButton]}
            onPress={handleAddToCart}
            disabled={!product.inStock}
          >
            <Ionicons name="cart" size={20} color={COLORS.background} />
            <Text style={styles.buttonText}>Add to Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buyButton]}
            onPress={handleBuyNow}
            disabled={!product.inStock}
          >
            <Text style={styles.buttonText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Navigation FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowQuickNav(!showQuickNav)}
        activeOpacity={0.8}
      >
        <Ionicons 
          name={showQuickNav ? 'close' : 'menu'} 
          size={24} 
          color={COLORS.background} 
        />
      </TouchableOpacity>

      {/* Quick Navigation Menu */}
      {showQuickNav && (
        <>
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={() => setShowQuickNav(false)}
          />
          <View style={styles.quickNavOverlay}>
            <View style={styles.quickNavMenu}>
              {quickNavItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickNavItem}
                  onPress={() => navigateToTab(item.tab)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.quickNavIconContainer, { backgroundColor: item.color }]}>
                    <Ionicons name={item.icon} size={24} color={COLORS.background} />
                  </View>
                  <Text style={styles.quickNavLabel}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </>
      )}

      {/* Action Options Modal */}
      <Modal
        visible={showActionModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowActionModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowActionModal(false)}
        />
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {actionType === 'callback' ? 'Request Callback' : 'Choose an Action'}
            </Text>
            <TouchableOpacity onPress={() => {
              setShowActionModal(false);
              setActionType(null);
            }}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            {actionType === 'callback' ? (
              <>
                <Text style={styles.modalLabel}>Phone Number *</Text>
                <TextInput
                  style={styles.modalInput}
                  value={callbackPhone}
                  onChangeText={setCallbackPhone}
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                  placeholderTextColor={COLORS.textLight}
                />

                <Text style={styles.modalLabel}>Preferred Time</Text>
                <TextInput
                  style={styles.modalInput}
                  value={callbackPreferredTime}
                  onChangeText={setCallbackPreferredTime}
                  placeholder="e.g., Morning 9-12, Evening 6-9"
                  placeholderTextColor={COLORS.textLight}
                />

                <Text style={styles.modalInfo}>
                  We will call you back to discuss your requirements for this product.
                </Text>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.modalActionButton, styles.quotationButton]}
                  onPress={handleGetQuotation}
                  activeOpacity={0.7}
                >
                  <View style={styles.modalActionIconContainer}>
                    <Ionicons name="document-text" size={28} color={COLORS.background} />
                  </View>
                  <View style={styles.modalActionTextContainer}>
                    <Text style={styles.modalActionTitle}>Get Quotation</Text>
                    <Text style={styles.modalActionSubtitle}>Get a detailed price quote</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalActionButton, styles.serviceButton]}
                  onPress={handleRequestService}
                  activeOpacity={0.7}
                >
                  <View style={styles.modalActionIconContainer}>
                    <Ionicons name="construct" size={28} color={COLORS.background} />
                  </View>
                  <View style={styles.modalActionTextContainer}>
                    <Text style={styles.modalActionTitle}>Request Service</Text>
                    <Text style={styles.modalActionSubtitle}>Request service support</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalActionButton, styles.callbackButton]}
                  onPress={() => setActionType('callback')}
                  activeOpacity={0.7}
                >
                  <View style={styles.modalActionIconContainer}>
                    <Ionicons name="call" size={28} color={COLORS.background} />
                  </View>
                  <View style={styles.modalActionTextContainer}>
                    <Text style={styles.modalActionTitle}>Request Callback</Text>
                    <Text style={styles.modalActionSubtitle}>We'll call you back</Text>
                  </View>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>

          {actionType === 'callback' && (
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => {
                  setActionType(null);
                }}
              >
                <Text style={styles.modalCancelText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalSubmitButton]}
                onPress={handleRequestCallback}
                disabled={loading || !callbackPhone}
              >
                {loading ? (
                  <Text style={styles.modalSubmitText}>Submitting...</Text>
                ) : (
                  <Text style={styles.modalSubmitText}>Submit Request</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: COLORS.border,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: COLORS.error,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  discountText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  category: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  ratingContainer: {
    marginBottom: 16,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 8,
  },
  reviews: {
    fontSize: 14,
    color: COLORS.textLight,
    marginLeft: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginRight: 12,
  },
  originalPrice: {
    fontSize: 18,
    color: COLORS.textLight,
    textDecorationLine: 'line-through',
    marginRight: 12,
  },
  saveText: {
    fontSize: 14,
    color: COLORS.success,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: COLORS.textLight,
    lineHeight: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 12,
  },
  specItem: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  specLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    width: 120,
  },
  specValue: {
    fontSize: 14,
    color: COLORS.textLight,
    flex: 1,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stockText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  bottomActions: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
  },
  quantityButton: {
    padding: 8,
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    paddingHorizontal: 16,
    minWidth: 40,
    textAlign: 'center',
  },
  actionButtons: {
    flex: 1,
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    marginLeft: 8,
  },
  cartButton: {
    backgroundColor: COLORS.secondary,
  },
  buyButton: {
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 998,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 1000,
  },
  quickNavOverlay: {
    position: 'absolute',
    right: 20,
    bottom: 170,
    zIndex: 999,
  },
  quickNavMenu: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    minWidth: 120,
  },
  quickNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  quickNavIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  quickNavLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  modalBody: {
    padding: 20,
  },
  modalActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  quotationButton: {
    backgroundColor: COLORS.primary,
  },
  serviceButton: {
    backgroundColor: '#4CAF50',
  },
  callbackButton: {
    backgroundColor: '#2196F3',
  },
  modalActionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  modalActionTextContainer: {
    flex: 1,
  },
  modalActionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.background,
    marginBottom: 4,
  },
  modalActionSubtitle: {
    fontSize: 14,
    color: COLORS.background,
    opacity: 0.9,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
    marginTop: 12,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: COLORS.background,
  },
  modalInfo: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 16,
    lineHeight: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: COLORS.border,
  },
  modalCancelText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
  modalSubmitButton: {
    backgroundColor: COLORS.primary,
  },
  modalSubmitText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductDetailScreen;
