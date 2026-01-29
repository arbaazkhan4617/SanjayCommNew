import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { COLORS } from '../utils/constants';
import { productAPI } from '../services/api';

const BrandsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const subCategory = route.params?.subCategory;
  const category = route.params?.category;
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (subCategory?.id) {
      loadBrands();
    }
  }, [subCategory]);

  const loadBrands = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getBrandsBySubCategory(subCategory.id);
      setBrands(response.data);
    } catch (error) {
      console.error('Error loading brands:', error);
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  const renderBrand = ({ item }) => (
    <TouchableOpacity
      style={styles.brandCard}
      onPress={() => navigation.navigate('Models', { brand: item, subCategory, category })}
      activeOpacity={0.7}
    >
      <View style={styles.brandIcon}>
        <Ionicons name="business-outline" size={32} color={COLORS.primary} />
      </View>
      <View style={styles.brandInfo}>
        <Text style={styles.brandName}>{item.name}</Text>
        <Text style={styles.brandCategory}>{subCategory?.name}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title={`${subCategory?.name} - Brands`} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading brands...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title={`${subCategory?.name} - Brands`} />
      {brands.length > 0 ? (
        <>
          <TouchableOpacity
            style={styles.serviceRequestButton}
            onPress={() => navigation.navigate('ServiceRequest', { category, subCategory })}
            activeOpacity={0.7}
          >
            <Ionicons name="construct-outline" size={24} color={COLORS.background} />
            <Text style={styles.serviceRequestButtonText}>Raise Service Request</Text>
          </TouchableOpacity>
          <FlatList
            data={brands}
            renderItem={renderBrand}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="business-outline" size={64} color={COLORS.textLight} />
          <Text style={styles.emptyText}>No brands found</Text>
          <Text style={styles.emptySubtext}>
            Brands will be added soon
          </Text>
          <TouchableOpacity
            style={[styles.serviceRequestButton, styles.serviceRequestButtonEmpty]}
            onPress={() => navigation.navigate('ServiceRequest', { category, subCategory })}
            activeOpacity={0.7}
          >
            <Ionicons name="construct-outline" size={24} color={COLORS.background} />
            <Text style={styles.serviceRequestButtonText}>Raise Service Request</Text>
          </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: COLORS.textLight,
  },
  listContent: {
    padding: 16,
  },
  brandCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  brandIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  brandInfo: {
    flex: 1,
  },
  brandName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  brandCategory: {
    fontSize: 12,
    color: COLORS.textLight,
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
  serviceRequestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    padding: 16,
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
    gap: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  serviceRequestButtonEmpty: {
    marginTop: 32,
  },
  serviceRequestButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BrandsScreen;
