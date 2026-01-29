import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { COLORS } from '../utils/constants';
import { productAPI } from '../services/api';

const ModelsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const brand = route.params?.brand;
  const subCategory = route.params?.subCategory;
  const category = route.params?.category;
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState({});

  useEffect(() => {
    if (brand?.id) {
      loadModels();
    }
  }, [brand]);

  const loadModels = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getModelsByBrand(brand.id);
      setModels(response.data);
      
      // Load products for each model
      const productPromises = response.data.map(async (model) => {
        try {
          const productResponse = await productAPI.getProductByModel(model.id);
          return { modelId: model.id, product: productResponse.data };
        } catch (error) {
          return { modelId: model.id, product: null };
        }
      });
      
      const productResults = await Promise.all(productPromises);
      const productMap = {};
      productResults.forEach(({ modelId, product }) => {
        productMap[modelId] = product;
      });
      setProducts(productMap);
    } catch (error) {
      console.error('Error loading models:', error);
      setModels([]);
    } finally {
      setLoading(false);
    }
  };

  const renderModel = ({ item }) => {
    const product = products[item.id];
    const hasProduct = !!product;

    return (
      <TouchableOpacity
        style={styles.modelCard}
        onPress={() => {
          if (hasProduct) {
            navigation.navigate('ProductDetail', { product });
          } else {
            navigation.navigate('ProductDetail', { 
              product: {
                ...item,
                name: item.name,
                price: 0,
                specifications: {},
              }
            });
          }
        }}
        activeOpacity={0.7}
      >
        <Image 
          source={{ uri: item.image || 'https://via.placeholder.com/300x300?text=Model' }} 
          style={styles.modelImage} 
        />
        <View style={styles.modelInfo}>
          <Text style={styles.modelName}>{item.name}</Text>
          <Text style={styles.modelBrand}>{brand?.name}</Text>
          {hasProduct && (
            <View style={styles.priceContainer}>
              <Text style={styles.price}>₹{parseFloat(product.price || 0).toLocaleString()}</Text>
              {product.originalPrice && (
                <Text style={styles.originalPrice}>
                  ₹{parseFloat(product.originalPrice).toLocaleString()}
                </Text>
              )}
            </View>
          )}
        </View>
        <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title={`${brand?.name} - Models`} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading models...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title={`${brand?.name} - Models`} />
      {models.length > 0 ? (
        <FlatList
          data={models}
          renderItem={renderModel}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="cube-outline" size={64} color={COLORS.textLight} />
          <Text style={styles.emptyText}>No models found</Text>
          <Text style={styles.emptySubtext}>
            Models will be added soon
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
  modelCard: {
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
  modelImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: COLORS.border,
    marginRight: 16,
  },
  modelInfo: {
    flex: 1,
  },
  modelName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  modelBrand: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 12,
    color: COLORS.textLight,
    textDecorationLine: 'line-through',
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

export default ModelsScreen;
