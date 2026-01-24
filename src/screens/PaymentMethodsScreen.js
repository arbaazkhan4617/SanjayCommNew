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

const PaymentMethodsScreen = () => {
  const navigation = useNavigation();
  const [paymentMethods, setPaymentMethods] = useState([
    // Sample payment methods - in real app, these would come from backend
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'card', // 'card', 'upi', 'netbanking'
    cardNumber: '',
    cardHolderName: '',
    expiryDate: '',
    cvv: '',
    upiId: '',
    bankName: '',
    isDefault: false,
  });

  const handleSavePaymentMethod = () => {
    if (formData.type === 'card') {
      if (!formData.cardNumber || !formData.cardHolderName || !formData.expiryDate || !formData.cvv) {
        Alert.alert('Error', 'Please fill in all card details');
        return;
      }
    } else if (formData.type === 'upi') {
      if (!formData.upiId) {
        Alert.alert('Error', 'Please enter UPI ID');
        return;
      }
    } else if (formData.type === 'netbanking') {
      if (!formData.bankName) {
        Alert.alert('Error', 'Please enter bank name');
        return;
      }
    }

    const newPaymentMethod = {
      id: Date.now().toString(),
      ...formData,
      displayNumber: formData.type === 'card' 
        ? `**** **** **** ${formData.cardNumber.slice(-4)}`
        : formData.type === 'upi'
        ? formData.upiId
        : formData.bankName,
    };

    setPaymentMethods([...paymentMethods, newPaymentMethod]);
    setFormData({
      type: 'card',
      cardNumber: '',
      cardHolderName: '',
      expiryDate: '',
      cvv: '',
      upiId: '',
      bankName: '',
      isDefault: paymentMethods.length === 0,
    });
    setShowAddForm(false);
    Alert.alert('Success', 'Payment method saved successfully');
  };

  const handleDeletePaymentMethod = (id) => {
    Alert.alert(
      'Delete Payment Method',
      'Are you sure you want to delete this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setPaymentMethods(paymentMethods.filter(pm => pm.id !== id));
          },
        },
      ]
    );
  };

  const handleSetDefault = (id) => {
    setPaymentMethods(paymentMethods.map(pm => ({
      ...pm,
      isDefault: pm.id === id,
    })));
  };

  const getPaymentIcon = (type) => {
    switch (type) {
      case 'card':
        return 'card';
      case 'upi':
        return 'phone-portrait';
      case 'netbanking':
        return 'business';
      default:
        return 'wallet';
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Payment Methods" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {paymentMethods.length === 0 && !showAddForm ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="card-outline" size={80} color={COLORS.textLight} />
            <Text style={styles.emptyText}>No payment methods saved</Text>
            <Text style={styles.emptySubtext}>Add a payment method to get started</Text>
          </View>
        ) : (
          <>
            {paymentMethods.map((method) => (
              <View key={method.id} style={styles.paymentCard}>
                <View style={styles.paymentHeader}>
                  <View style={styles.paymentInfo}>
                    <Ionicons 
                      name={getPaymentIcon(method.type)} 
                      size={24} 
                      color={COLORS.primary} 
                    />
                    <View style={styles.paymentDetails}>
                      <Text style={styles.paymentType}>
                        {method.type === 'card' ? 'Credit/Debit Card' : 
                         method.type === 'upi' ? 'UPI' : 'Net Banking'}
                      </Text>
                      <Text style={styles.paymentNumber}>{method.displayNumber}</Text>
                    </View>
                  </View>
                  <View style={styles.paymentActions}>
                    {method.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultText}>Default</Text>
                      </View>
                    )}
                    {!method.isDefault && (
                      <TouchableOpacity
                        onPress={() => handleSetDefault(method.id)}
                        style={styles.actionButton}
                      >
                        <Ionicons name="star-outline" size={20} color={COLORS.primary} />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      onPress={() => handleDeletePaymentMethod(method.id)}
                      style={styles.actionButton}
                    >
                      <Ionicons name="trash-outline" size={20} color={COLORS.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}

            {showAddForm && (
              <View style={styles.formContainer}>
                <Text style={styles.formTitle}>Add Payment Method</Text>
                
                <Text style={styles.label}>Payment Type *</Text>
                <View style={styles.typeSelector}>
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      formData.type === 'card' && styles.typeButtonActive,
                    ]}
                    onPress={() => setFormData({ ...formData, type: 'card' })}
                  >
                    <Ionicons 
                      name="card" 
                      size={20} 
                      color={formData.type === 'card' ? COLORS.background : COLORS.text} 
                    />
                    <Text
                      style={[
                        styles.typeButtonText,
                        formData.type === 'card' && styles.typeButtonTextActive,
                      ]}
                    >
                      Card
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      formData.type === 'upi' && styles.typeButtonActive,
                    ]}
                    onPress={() => setFormData({ ...formData, type: 'upi' })}
                  >
                    <Ionicons 
                      name="phone-portrait" 
                      size={20} 
                      color={formData.type === 'upi' ? COLORS.background : COLORS.text} 
                    />
                    <Text
                      style={[
                        styles.typeButtonText,
                        formData.type === 'upi' && styles.typeButtonTextActive,
                      ]}
                    >
                      UPI
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      formData.type === 'netbanking' && styles.typeButtonActive,
                    ]}
                    onPress={() => setFormData({ ...formData, type: 'netbanking' })}
                  >
                    <Ionicons 
                      name="business" 
                      size={20} 
                      color={formData.type === 'netbanking' ? COLORS.background : COLORS.text} 
                    />
                    <Text
                      style={[
                        styles.typeButtonText,
                        formData.type === 'netbanking' && styles.typeButtonTextActive,
                      ]}
                    >
                      Net Banking
                    </Text>
                  </TouchableOpacity>
                </View>

                {formData.type === 'card' && (
                  <>
                    <Text style={styles.label}>Card Number *</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.cardNumber}
                      onChangeText={(text) => setFormData({ ...formData, cardNumber: text })}
                      placeholder="1234 5678 9012 3456"
                      keyboardType="number-pad"
                      maxLength={19}
                      placeholderTextColor={COLORS.textLight}
                    />

                    <Text style={styles.label}>Card Holder Name *</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.cardHolderName}
                      onChangeText={(text) => setFormData({ ...formData, cardHolderName: text })}
                      placeholder="John Doe"
                      placeholderTextColor={COLORS.textLight}
                    />

                    <View style={styles.row}>
                      <View style={styles.halfInput}>
                        <Text style={styles.label}>Expiry Date *</Text>
                        <TextInput
                          style={styles.input}
                          value={formData.expiryDate}
                          onChangeText={(text) => setFormData({ ...formData, expiryDate: text })}
                          placeholder="MM/YY"
                          maxLength={5}
                          placeholderTextColor={COLORS.textLight}
                        />
                      </View>
                      <View style={styles.halfInput}>
                        <Text style={styles.label}>CVV *</Text>
                        <TextInput
                          style={styles.input}
                          value={formData.cvv}
                          onChangeText={(text) => setFormData({ ...formData, cvv: text })}
                          placeholder="123"
                          keyboardType="number-pad"
                          maxLength={4}
                          secureTextEntry
                          placeholderTextColor={COLORS.textLight}
                        />
                      </View>
                    </View>
                  </>
                )}

                {formData.type === 'upi' && (
                  <>
                    <Text style={styles.label}>UPI ID *</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.upiId}
                      onChangeText={(text) => setFormData({ ...formData, upiId: text })}
                      placeholder="yourname@paytm"
                      placeholderTextColor={COLORS.textLight}
                    />
                  </>
                )}

                {formData.type === 'netbanking' && (
                  <>
                    <Text style={styles.label}>Bank Name *</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.bankName}
                      onChangeText={(text) => setFormData({ ...formData, bankName: text })}
                      placeholder="Bank Name"
                      placeholderTextColor={COLORS.textLight}
                    />
                  </>
                )}

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={() => {
                      setShowAddForm(false);
                      setFormData({
                        type: 'card',
                        cardNumber: '',
                        cardHolderName: '',
                        expiryDate: '',
                        cvv: '',
                        upiId: '',
                        bankName: '',
                        isDefault: false,
                      });
                    }}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.saveButton]}
                    onPress={handleSavePaymentMethod}
                  >
                    <Text style={styles.saveButtonText}>Save</Text>
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
          <Text style={styles.addButtonText}>Add Payment Method</Text>
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
  paymentCard: {
    backgroundColor: COLORS.background,
    padding: 16,
    margin: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentDetails: {
    marginLeft: 12,
    flex: 1,
  },
  paymentType: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  paymentNumber: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  paymentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  actionButton: {
    padding: 4,
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
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  typeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  typeButtonTextActive: {
    color: COLORS.background,
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
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
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

export default PaymentMethodsScreen;
