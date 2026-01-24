import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { COLORS } from '../utils/constants';
import { useAuth } from '../context/AuthContext';

const AddressesScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([
    // Sample addresses - in real app, these would come from backend
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: 'Madhya Pradesh',
    pincode: '',
    isDefault: false,
  });

  const handleSaveAddress = () => {
    if (!formData.name || !formData.phone || !formData.addressLine1 || !formData.city || !formData.pincode) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newAddress = {
      id: Date.now().toString(),
      ...formData,
    };

    setAddresses([...addresses, newAddress]);
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: 'Madhya Pradesh',
      pincode: '',
      isDefault: addresses.length === 0,
    });
    setShowAddForm(false);
    Alert.alert('Success', 'Address saved successfully');
  };

  const handleDeleteAddress = (id) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setAddresses(addresses.filter(addr => addr.id !== id));
          },
        },
      ]
    );
  };

  const handleSetDefault = (id) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id,
    })));
  };

  return (
    <View style={styles.container}>
      <Header title="My Addresses" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {addresses.length === 0 && !showAddForm ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="location-outline" size={80} color={COLORS.textLight} />
            <Text style={styles.emptyText}>No addresses saved</Text>
            <Text style={styles.emptySubtext}>Add an address to get started</Text>
          </View>
        ) : (
          <>
            {addresses.map((address) => (
              <View key={address.id} style={styles.addressCard}>
                <View style={styles.addressHeader}>
                  <View style={styles.addressInfo}>
                    <Text style={styles.addressName}>{address.name}</Text>
                    {address.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultText}>Default</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.addressActions}>
                    {!address.isDefault && (
                      <TouchableOpacity
                        onPress={() => handleSetDefault(address.id)}
                        style={styles.actionButton}
                      >
                        <Ionicons name="star-outline" size={20} color={COLORS.primary} />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      onPress={() => handleDeleteAddress(address.id)}
                      style={styles.actionButton}
                    >
                      <Ionicons name="trash-outline" size={20} color={COLORS.error} />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.addressPhone}>{address.phone}</Text>
                <Text style={styles.addressText}>
                  {address.addressLine1}
                  {address.addressLine2 && `, ${address.addressLine2}`}
                </Text>
                <Text style={styles.addressText}>
                  {address.city}, {address.state} - {address.pincode}
                </Text>
              </View>
            ))}

            {showAddForm && (
              <View style={styles.formContainer}>
                <Text style={styles.formTitle}>Add New Address</Text>
                
                <Text style={styles.label}>Name *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  placeholder="Full Name"
                  placeholderTextColor={COLORS.textLight}
                />

                <Text style={styles.label}>Phone Number *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.phone}
                  onChangeText={(text) => setFormData({ ...formData, phone: text })}
                  placeholder="Phone Number"
                  keyboardType="phone-pad"
                  placeholderTextColor={COLORS.textLight}
                />

                <Text style={styles.label}>Address Line 1 *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.addressLine1}
                  onChangeText={(text) => setFormData({ ...formData, addressLine1: text })}
                  placeholder="House/Flat No., Building Name"
                  placeholderTextColor={COLORS.textLight}
                />

                <Text style={styles.label}>Address Line 2</Text>
                <TextInput
                  style={styles.input}
                  value={formData.addressLine2}
                  onChangeText={(text) => setFormData({ ...formData, addressLine2: text })}
                  placeholder="Street, Area, Landmark (Optional)"
                  placeholderTextColor={COLORS.textLight}
                />

                <Text style={styles.label}>City *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.city}
                  onChangeText={(text) => setFormData({ ...formData, city: text })}
                  placeholder="City"
                  placeholderTextColor={COLORS.textLight}
                />

                <Text style={styles.label}>State</Text>
                <TextInput
                  style={styles.input}
                  value={formData.state}
                  onChangeText={(text) => setFormData({ ...formData, state: text })}
                  placeholder="State"
                  placeholderTextColor={COLORS.textLight}
                />

                <Text style={styles.label}>Pincode *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.pincode}
                  onChangeText={(text) => setFormData({ ...formData, pincode: text })}
                  placeholder="Pincode"
                  keyboardType="number-pad"
                  placeholderTextColor={COLORS.textLight}
                />

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={() => {
                      setShowAddForm(false);
                      setFormData({
                        name: user?.name || '',
                        phone: user?.phone || '',
                        addressLine1: '',
                        addressLine2: '',
                        city: '',
                        state: 'Madhya Pradesh',
                        pincode: '',
                        isDefault: false,
                      });
                    }}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.saveButton]}
                    onPress={handleSaveAddress}
                  >
                    <Text style={styles.saveButtonText}>Save Address</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {!showAddForm && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddForm(true)}
        >
          <Ionicons name="add" size={24} color={COLORS.background} />
          <Text style={styles.addButtonText}>Add New Address</Text>
        </TouchableOpacity>
      )}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    minHeight: 400,
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
  },
  addressCard: {
    backgroundColor: COLORS.background,
    padding: 16,
    margin: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  addressName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginRight: 8,
  },
  defaultBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  defaultText: {
    color: COLORS.background,
    fontSize: 12,
    fontWeight: '600',
  },
  addressActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 4,
  },
  addressPhone: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 4,
    lineHeight: 20,
  },
  formContainer: {
    padding: 16,
    backgroundColor: COLORS.background,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: COLORS.background,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.border,
  },
  cancelButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  saveButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  addButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default AddressesScreen;
