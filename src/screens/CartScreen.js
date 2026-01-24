import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../utils/constants';
import { serviceRequestAPI } from '../services/api';
import Toast from 'react-native-toast-message';

const CartScreen = () => {
  const navigation = useNavigation();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const total = getCartTotal();
  const [showActionModal, setShowActionModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // For Request Callback
  const [callbackPhone, setCallbackPhone] = useState(user?.phone || '');
  const [callbackPreferredTime, setCallbackPreferredTime] = useState('');

  const handleGetQuotation = () => {
    const productNames = cartItems.map(item => item.name).join(', ');
    const totalValue = total;
    
    navigation.navigate('ServiceRequest', {
      subject: 'Request for Quotation',
      description: `I would like to get a quotation for the following items:\n\n${productNames}\n\nTotal Estimated Value: ₹${totalValue.toLocaleString()}\n\nPlease provide a detailed quotation with pricing.`,
      requestType: 'quotation',
    });
  };

  const handleRequestService = () => {
    const productNames = cartItems.map(item => item.name).join(', ');
    
    navigation.navigate('ServiceRequest', {
      subject: 'Service Request',
      description: `I need service support for the following products:\n\n${productNames}\n\nPlease provide service details and schedule.`,
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
      
      const productNames = cartItems.map(item => item.name).join(', ');
      const totalValue = total;
      const description = `Callback Request for Cart Items:\n\nProducts: ${productNames}\n\nTotal Value: ₹${totalValue.toLocaleString()}\n\nPreferred Time: ${callbackPreferredTime || 'Any time'}\n\nPlease call me at ${callbackPhone} to discuss these products.`;

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

  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Shopping Cart</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color={COLORS.textLight} />
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <Text style={styles.emptySubtext}>Add items to get started</Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => navigation.navigate('Products')}
          >
            <Text style={styles.shopButtonText}>Shop Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shopping Cart ({cartItems.length})</Text>
        {cartItems.length > 0 && (
          <TouchableOpacity onPress={clearCart}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {cartItems.map((item) => (
          <View key={item.id} style={styles.cartItem}>
            <Image 
              source={{ 
                uri: item.image || item.product?.image || item.product?.model?.image || item.model?.image || 'https://via.placeholder.com/300x300?text=Product' 
              }} 
              style={styles.itemImage}
              resizeMode="cover"
              onError={(error) => {
                console.log('Image load error for item:', item.id, error.nativeEvent.error);
              }}
            />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={styles.itemCategory}>{item.category}</Text>
              <Text style={styles.itemPrice}>₹{item.price.toLocaleString()}</Text>

              <View style={styles.itemActions}>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    onPress={() => updateQuantity(item.id, item.quantity - 1)}
                    style={styles.quantityButton}
                  >
                    <Ionicons name="remove" size={18} color={COLORS.text} />
                  </TouchableOpacity>
                  <Text style={styles.quantity}>{item.quantity}</Text>
                  <TouchableOpacity
                    onPress={() => updateQuantity(item.id, item.quantity + 1)}
                    style={styles.quantityButton}
                  >
                    <Ionicons name="add" size={18} color={COLORS.text} />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={() => removeFromCart(item.id)}
                  style={styles.removeButton}
                >
                  <Ionicons name="trash" size={20} color={COLORS.error} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>₹{total.toLocaleString()}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery</Text>
          <Text style={styles.summaryValue}>Free</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>₹{total.toLocaleString()}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.quotationButton]}
            onPress={() => handleGetQuotation()}
          >
            <Ionicons name="document-text" size={20} color={COLORS.background} />
            <Text style={styles.actionButtonText}>Get Quotation</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.serviceButton]}
            onPress={() => handleRequestService()}
          >
            <Ionicons name="construct" size={20} color={COLORS.background} />
            <Text style={styles.actionButtonText}>Request Service</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.callbackButton]}
            onPress={() => setShowActionModal(true)}
          >
            <Ionicons name="call" size={20} color={COLORS.background} />
            <Text style={styles.actionButtonText}>Request Callback</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Request Callback Modal */}
      <Modal
        visible={showActionModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowActionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Request Callback</Text>
              <TouchableOpacity onPress={() => setShowActionModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
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
                We will call you back to discuss your requirements for the selected items.
              </Text>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setShowActionModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
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
          </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
    textAlign: 'center',
  },
  clearText: {
    fontSize: 14,
    color: COLORS.error,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 8,
    marginBottom: 24,
  },
  shopButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: COLORS.border,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 12,
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
  },
  quantityButton: {
    padding: 6,
  },
  quantity: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    paddingHorizontal: 12,
    minWidth: 30,
    textAlign: 'center',
  },
  removeButton: {
    padding: 8,
  },
  summary: {
    padding: 16,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  summaryValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  actionButtonsContainer: {
    marginTop: 16,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 8,
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
  actionButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
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

export default CartScreen;
