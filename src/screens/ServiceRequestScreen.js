import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/constants';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { serviceRequestAPI, productAPI, wishlistAPI } from '../services/api';
import Toast from 'react-native-toast-message';

const ServiceRequestScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const { cartItems } = useCart();
  const {
    service,
    category,
    subject: initialSubject,
    description: initialDescription,
    requestType,
  } = route.params || {};

  const [subject, setSubject] = useState(initialSubject || '');
  const [description, setDescription] = useState(initialDescription || '');
  const [contactName, setContactName] = useState(user?.name || '');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [contactEmail, setContactEmail] = useState(user?.email || '');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [importingCart, setImportingCart] = useState(false);
  const [importingWishlist, setImportingWishlist] = useState(false);
  const searchDebounceRef = useRef(null);
  const selectedIdsRef = useRef([]);

  useEffect(() => {
    selectedIdsRef.current = selectedProducts.map((p) => String(p.id));
  }, [selectedProducts]);

  /** Check if a product is already in the quotation list (call this before adding). */
  const isProductAlreadyInQuotation = useCallback((productId) => {
    if (productId == null) return false;
    return selectedIdsRef.current.includes(String(productId));
  }, []);

  // Live search as user types (debounced)
  useEffect(() => {
    const q = (searchQuery || '').trim();
    if (q.length < 2) {
      setSearchResults([]);
      return;
    }
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await productAPI.searchProducts(q);
        setSearchResults(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 400);
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [searchQuery]);

  const addProduct = useCallback((product, quantity = 1) => {
    if (!product?.id) return;
    if (isProductAlreadyInQuotation(product.id)) {
      Toast.show({
        type: 'info',
        text1: 'Already in list',
        text2: 'This product is already in your quotation list.',
      });
      return;
    }
    const idStr = String(product.id);
    selectedIdsRef.current = [...selectedIdsRef.current, idStr];
    setSelectedProducts((prev) => [...prev, { ...product, quantity }]);
    Toast.show({ type: 'success', text1: 'Added', text2: product.name });
  }, [isProductAlreadyInQuotation]);

  const removeProduct = useCallback((productId) => {
    setSelectedProducts((prev) => prev.filter((p) => String(p.id) !== String(productId)));
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
  }, []);

  const importFromCart = useCallback(async () => {
    if (!user?.id) {
      Toast.show({ type: 'error', text1: 'Please log in to import from cart' });
      return;
    }
    setImportingCart(true);
    try {
      const toAdd = (cartItems || []).map((item) => ({
        ...(item.product || item),
        id: (item.product || item).id || item.id,
        quantity: item.quantity || 1,
      }));
      if (toAdd.length === 0) {
        Toast.show({ type: 'info', text1: 'Your cart is empty' });
        setImportingCart(false);
        return;
      }
      setSelectedProducts((prev) => {
        const ids = new Set(selectedIdsRef.current);
        const newOnes = toAdd.filter((p) => p.id && !ids.has(String(p.id)));
        const skippedCount = toAdd.length - newOnes.length;
        if (newOnes.length === 0) {
          setTimeout(() => {
            Toast.show({
              type: 'info',
              text1: 'Already in list',
              text2: 'All cart items are already in your quotation list.',
            });
          }, 0);
          return prev;
        }
        if (skippedCount > 0) {
          setTimeout(() => {
            Toast.show({
              type: 'info',
              text1: 'Import from cart',
              text2: `Added ${newOnes.length} item(s). ${skippedCount} already in list.`,
            });
          }, 0);
        } else {
          Toast.show({ type: 'success', text1: `Added ${newOnes.length} item(s) from cart` });
        }
        return [...prev, ...newOnes];
      });
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Failed to load cart' });
    } finally {
      setImportingCart(false);
    }
  }, [user?.id, cartItems]);

  const importFromWishlist = useCallback(async () => {
    if (!user?.id) {
      Toast.show({ type: 'error', text1: 'Please log in to import from wishlist' });
      return;
    }
    setImportingWishlist(true);
    try {
      const res = await wishlistAPI.getWishlist(user.id);
      const list = Array.isArray(res.data) ? res.data : [];
      if (list.length === 0) {
        Toast.show({ type: 'info', text1: 'Your wishlist is empty' });
        setImportingWishlist(false);
        return;
      }
      setSelectedProducts((prev) => {
        const ids = new Set(selectedIdsRef.current);
        const newOnes = list.filter((p) => p.id && !ids.has(String(p.id))).map((p) => ({ ...p, quantity: 1 }));
        const skippedCount = list.length - newOnes.length;
        if (newOnes.length === 0) {
          setTimeout(() => {
            Toast.show({
              type: 'info',
              text1: 'Already in list',
              text2: 'All wishlist items are already in your quotation list.',
            });
          }, 0);
          return prev;
        }
        if (skippedCount > 0) {
          setTimeout(() => {
            Toast.show({
              type: 'info',
              text1: 'Import from wishlist',
              text2: `Added ${newOnes.length} item(s). ${skippedCount} already in list.`,
            });
          }, 0);
        } else {
          Toast.show({ type: 'success', text1: `Added ${newOnes.length} item(s) from wishlist` });
        }
        return [...prev, ...newOnes];
      });
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Failed to load wishlist' });
    } finally {
      setImportingWishlist(false);
    }
  }, [user?.id]);

  const buildDescriptionWithProducts = useCallback(() => {
    let finalDesc = description.trim();
    if (selectedProducts.length > 0) {
      const lines = selectedProducts.map(
        (p) =>
          `- ${p.name || 'Product'} (₹${parseFloat(p.price || 0).toLocaleString()})${p.quantity > 1 ? ` x ${p.quantity}` : ''}`
      );
      finalDesc = `Products requested for quotation:\n${lines.join('\n')}${finalDesc ? '\n\n' + finalDesc : ''}`;
    }
    return finalDesc;
  }, [selectedProducts, description]);

  const handleSubmit = async () => {
    if (!subject.trim()) {
      Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Please enter a subject' });
      return;
    }
    const finalDescription = buildDescriptionWithProducts();
    if (!finalDescription.trim()) {
      Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Please add products or enter a description' });
      return;
    }
    if (!contactName.trim()) {
      Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Please enter your name' });
      return;
    }
    if (!contactPhone.trim()) {
      Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Please enter your phone number' });
      return;
    }
    if (!contactEmail.trim()) {
      Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Please enter your email' });
      return;
    }

    try {
      setLoading(true);

      if (user?.id && selectedProducts.length > 0) {
        const existingRes = await serviceRequestAPI.getUserServiceRequests(user.id);
        const existingRequests = Array.isArray(existingRes.data) ? existingRes.data : [];
        const pendingOrInProgress = existingRequests.filter(
          (r) => r.status === 'PENDING' || r.status === 'IN_PROGRESS'
        );
        for (const product of selectedProducts) {
          const productName = (product.name || '').trim();
          if (!productName) continue;
          const alreadyRequested = pendingOrInProgress.some(
            (r) => r.description && r.description.includes(productName)
          );
          if (alreadyRequested) {
            setLoading(false);
            Toast.show({
              type: 'info',
              text1: 'Already requested',
              text2: `You already have a pending quotation request for "${productName}". Please check My Requests.`,
              visibilityTime: 4000,
            });
            return;
          }
        }
      }

      const response = await serviceRequestAPI.createServiceRequest({
        userId: user?.id,
        serviceId: service?.id || null,
        categoryId: category?.id || null,
        subject: subject.trim(),
        description: finalDescription,
        contactName: contactName.trim(),
        contactPhone: contactPhone.trim(),
        contactEmail: contactEmail.trim(),
        address: address.trim() || null,
      });

      if (response.data.success) {
        Toast.show({
          type: 'success',
          text1: 'Request Submitted!',
          text2: 'We will get back to you within 24 hours.',
          visibilityTime: 3000,
        });
        setSubject('');
        setDescription('');
        setAddress('');
        setSelectedProducts([]);
        setTimeout(() => navigation.goBack(), 1500);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Submission Failed',
          text2: response.data.error || 'Failed to submit request',
        });
      }
    } catch (error) {
      console.error('Error creating service request:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.error || error.message || 'Failed to submit. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Request Quotation</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {(service || category) && (
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={20} color={COLORS.primary} />
            <Text style={styles.infoText}>
              Requesting for: {service?.name || category?.name}
            </Text>
          </View>
        )}

        <View style={styles.form}>
          {/* Products for quotation */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Products for quotation</Text>
            <View style={styles.searchRow}>
              <TextInput
                style={styles.searchInput}
                placeholder="Type product name to search (min 2 characters)..."
                placeholderTextColor={COLORS.textLight}
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="done"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={clearSearch} style={styles.clearSearchButton}>
                  <Ionicons name="close-circle" size={24} color={COLORS.textLight} />
                </TouchableOpacity>
              )}
            </View>
            {searchLoading && (
              <View style={styles.searchLoadingRow}>
                <ActivityIndicator size="small" color={COLORS.primary} />
                <Text style={styles.searchLoadingText}>Searching...</Text>
              </View>
            )}
            {!searchLoading && searchResults.length > 0 && (
              <View style={styles.searchResultsInline}>
                <Text style={styles.searchResultsTitle}>Tap to add (multiple)</Text>
                <ScrollView
                  style={styles.searchResultsScroll}
                  contentContainerStyle={styles.searchResultsScrollContent}
                  showsVerticalScrollIndicator={true}
                  nestedScrollEnabled
                  keyboardShouldPersistTaps="handled"
                >
                  {searchResults.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.searchResultRow}
                      onPress={() => addProduct(item)}
                      activeOpacity={0.7}
                    >
                      <Image
                        source={{ uri: item.image || item.images?.[0] || item.model?.image || 'https://via.placeholder.com/48' }}
                        style={styles.searchResultImage}
                      />
                      <View style={styles.searchResultInfo}>
                        <Text style={styles.searchResultName} numberOfLines={2}>{item.name}</Text>
                        <Text style={styles.searchResultPrice}>₹{parseFloat(item.price || 0).toLocaleString()}</Text>
                      </View>
                      <View style={styles.addResultButton}>
                        <Ionicons name="add" size={22} color={COLORS.background} />
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
            {!searchLoading && searchQuery.trim().length >= 2 && searchResults.length === 0 && (
              <Text style={styles.noResultsText}>No products found</Text>
            )}
            <View style={styles.importRow}>
              <TouchableOpacity
                style={[styles.importButton, importingCart && styles.importButtonDisabled]}
                onPress={importFromCart}
                disabled={importingCart}
              >
                {importingCart ? (
                  <ActivityIndicator size="small" color={COLORS.primary} />
                ) : (
                  <Ionicons name="cart-outline" size={18} color={COLORS.primary} />
                )}
                <Text style={styles.importButtonText}>From Cart</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.importButton, importingWishlist && styles.importButtonDisabled]}
                onPress={importFromWishlist}
                disabled={importingWishlist}
              >
                {importingWishlist ? (
                  <ActivityIndicator size="small" color={COLORS.primary} />
                ) : (
                  <Ionicons name="heart-outline" size={18} color={COLORS.primary} />
                )}
                <Text style={styles.importButtonText}>From Wishlist</Text>
              </TouchableOpacity>
            </View>
            {selectedProducts.length > 0 && (
              <View style={styles.selectedSection}>
                <Text style={styles.selectedLabel}>Selected ({selectedProducts.length})</Text>
                <View style={styles.selectedList}>
                  {selectedProducts.map((item) => (
                    <View key={item.id} style={styles.selectedChip}>
                      <Text style={styles.selectedChipText} numberOfLines={1}>
                        {item.name} {item.quantity > 1 ? `× ${item.quantity}` : ''}
                      </Text>
                      <TouchableOpacity onPress={() => removeProduct(item.id)} hitSlop={8} style={styles.selectedChipRemove}>
                        <Ionicons name="close-circle" size={20} color={COLORS.textLight} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Subject *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Request for Quotation"
              placeholderTextColor={COLORS.textLight}
              value={subject}
              onChangeText={setSubject}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Additional details (optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Any specific requirements, quantities, or notes..."
              placeholderTextColor={COLORS.textLight}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Your Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor={COLORS.textLight}
              value={contactName}
              onChangeText={setContactName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              placeholderTextColor={COLORS.textLight}
              value={contactPhone}
              onChangeText={setContactPhone}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter email"
              placeholderTextColor={COLORS.textLight}
              value={contactEmail}
              onChangeText={setContactEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Service/delivery address if different"
              placeholderTextColor={COLORS.textLight}
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.background} />
            ) : (
              <Text style={styles.submitButtonText}>Submit Quotation Request</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.note}>
            * Required fields. We will get back within 24 hours with your quotation.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  backButton: { width: 40, alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.text },
  scrollView: { flex: 1 },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.border,
    padding: 12,
    margin: 16,
    borderRadius: 8,
    gap: 8,
  },
  infoText: { flex: 1, fontSize: 14, color: COLORS.text },
  form: { padding: 16 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 },
  input: {
    backgroundColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  textArea: { minHeight: 100, paddingTop: 12 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  searchInput: {
    flex: 1,
    backgroundColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  clearSearchButton: { padding: 4 },
  searchLoadingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  searchLoadingText: { fontSize: 14, color: COLORS.textLight },
  searchResultsInline: { marginTop: 12, height: 280 },
  searchResultsTitle: { fontSize: 13, color: COLORS.textLight, marginBottom: 8 },
  searchResultsScroll: { flex: 1, overflow: 'hidden' },
  searchResultsScrollContent: { paddingBottom: 8 },
  noResultsText: { fontSize: 14, color: COLORS.textLight, marginTop: 12 },
  importRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  importButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  importButtonDisabled: { opacity: 0.6 },
  importButtonText: { fontSize: 14, fontWeight: '600', color: COLORS.primary },
  selectedSection: { marginTop: 12 },
  selectedLabel: { fontSize: 13, color: COLORS.textLight, marginBottom: 8 },
  selectedList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.border,
    paddingVertical: 6,
    paddingLeft: 10,
    paddingRight: 4,
    borderRadius: 20,
    maxWidth: '100%',
  },
  selectedChipText: { fontSize: 13, color: COLORS.text, flex: 1, maxWidth: 180 },
  selectedChipRemove: { marginLeft: 4 },
  searchResultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchResultImage: { width: 48, height: 48, borderRadius: 8, backgroundColor: COLORS.border },
  searchResultInfo: { flex: 1, marginLeft: 12 },
  searchResultName: { fontSize: 15, fontWeight: '500', color: COLORS.text },
  searchResultPrice: { fontSize: 14, color: COLORS.primary, marginTop: 2 },
  addResultButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: { opacity: 0.6 },
  submitButtonText: { color: COLORS.background, fontSize: 16, fontWeight: 'bold' },
  note: { fontSize: 12, color: COLORS.textLight, marginTop: 16, textAlign: 'center', lineHeight: 18 },
});

export default ServiceRequestScreen;
