import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { COLORS } from '../utils/constants';
import { adminAPI, productAPI } from '../services/api';
import Toast from 'react-native-toast-message';

const AddEditProductScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { product, mode } = route.params || {};
  const isEdit = mode === 'edit' && product;

  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);

  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price?.toString() || '',
    originalPrice: product?.originalPrice?.toString() || '',
    inStock: product?.inStock !== false,
    rating: product?.rating?.toString() || '',
    reviews: product?.reviews?.toString() || '',
    image: product?.image || '',
    serviceId: product?.service?.id || null,
    categoryId: product?.category?.id || null,
    brandId: product?.brand?.id || null,
    modelId: product?.model?.id || null,
    specifications: product?.specifications || {},
  });

  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');

  useEffect(() => {
    loadServices();
    if (isEdit) {
      loadHierarchy();
    }
  }, []);

  useEffect(() => {
    if (formData.serviceId) {
      loadCategories();
    }
  }, [formData.serviceId]);

  useEffect(() => {
    if (formData.categoryId) {
      loadBrands();
    }
  }, [formData.categoryId]);

  useEffect(() => {
    if (formData.brandId) {
      loadModels();
    }
  }, [formData.brandId]);

  const loadServices = async () => {
    try {
      const response = await productAPI.getServices();
      setServices(response.data || []);
    } catch (error) {
      console.error('Error loading services:', error);
    }
  };

  const loadHierarchy = async () => {
    if (product?.service?.id) {
      try {
        const [categoriesRes, brandsRes, modelsRes] = await Promise.all([
          productAPI.getCategoriesByService(product.service.id),
          product.category?.id ? productAPI.getBrandsByCategory(product.category.id) : Promise.resolve({ data: [] }),
          product.brand?.id ? productAPI.getModelsByBrand(product.brand.id) : Promise.resolve({ data: [] }),
        ]);
        setCategories(categoriesRes.data || []);
        setBrands(brandsRes.data || []);
        setModels(modelsRes.data || []);
      } catch (error) {
        console.error('Error loading hierarchy:', error);
      }
    }
  };

  const loadCategories = async () => {
    if (!formData.serviceId) return;
    try {
      const response = await productAPI.getCategoriesByService(formData.serviceId);
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadBrands = async () => {
    if (!formData.categoryId) return;
    try {
      const response = await productAPI.getBrandsByCategory(formData.categoryId);
      setBrands(response.data || []);
    } catch (error) {
      console.error('Error loading brands:', error);
    }
  };

  const loadModels = async () => {
    if (!formData.brandId) return;
    try {
      const response = await productAPI.getModelsByBrand(formData.brandId);
      setModels(response.data || []);
    } catch (error) {
      console.error('Error loading models:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Reset dependent fields when parent changes
    if (field === 'serviceId') {
      setFormData((prev) => ({ ...prev, categoryId: null, brandId: null, modelId: null }));
      setCategories([]);
      setBrands([]);
      setModels([]);
    } else if (field === 'categoryId') {
      setFormData((prev) => ({ ...prev, brandId: null, modelId: null }));
      setBrands([]);
      setModels([]);
    } else if (field === 'brandId') {
      setFormData((prev) => ({ ...prev, modelId: null }));
      setModels([]);
    }
  };

  const addSpecification = () => {
    if (specKey.trim() && specValue.trim()) {
      setFormData((prev) => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specKey.trim()]: specValue.trim(),
        },
      }));
      setSpecKey('');
      setSpecValue('');
    }
  };

  const removeSpecification = (key) => {
    const newSpecs = { ...formData.specifications };
    delete newSpecs[key];
    setFormData((prev) => ({ ...prev, specifications: newSpecs }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.price || !formData.modelId) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fill in all required fields (Name, Price, Model)',
      });
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        inStock: formData.inStock,
        rating: formData.rating ? parseFloat(formData.rating) : null,
        reviews: formData.reviews ? parseInt(formData.reviews) : null,
        modelId: formData.modelId,
        image: formData.image,
        specifications: formData.specifications,
      };

      if (isEdit) {
        await adminAPI.updateProduct(product.id, payload);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Product updated successfully',
        });
      } else {
        await adminAPI.createProduct(payload);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Product created successfully',
        });
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error saving product:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.error || 'Failed to save product',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title={isEdit ? 'Edit Product' : 'Add Product'} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Product Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              placeholder="Enter product name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              placeholder="Enter product description"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Price (₹) *</Text>
              <TextInput
                style={styles.input}
                value={formData.price}
                onChangeText={(value) => handleInputChange('price', value)}
                placeholder="0.00"
                keyboardType="decimal-pad"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Original Price (₹)</Text>
              <TextInput
                style={styles.input}
                value={formData.originalPrice}
                onChangeText={(value) => handleInputChange('originalPrice', value)}
                placeholder="0.00"
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Rating</Text>
              <TextInput
                style={styles.input}
                value={formData.rating}
                onChangeText={(value) => handleInputChange('rating', value)}
                placeholder="0.0"
                keyboardType="decimal-pad"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Reviews</Text>
              <TextInput
                style={styles.input}
                value={formData.reviews}
                onChangeText={(value) => handleInputChange('reviews', value)}
                placeholder="0"
                keyboardType="number-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Image URL</Text>
            <TextInput
              style={styles.input}
              value={formData.image}
              onChangeText={(value) => handleInputChange('image', value)}
              placeholder="https://example.com/image.jpg"
              keyboardType="url"
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.switchContainer}>
              <Text style={styles.label}>In Stock</Text>
              <TouchableOpacity
                style={[styles.switch, formData.inStock && styles.switchActive]}
                onPress={() => handleInputChange('inStock', !formData.inStock)}
              >
                <View style={[styles.switchThumb, formData.inStock && styles.switchThumbActive]} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Product Hierarchy</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Service *</Text>
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerText}>
                {services.find((s) => s.id === formData.serviceId)?.name || 'Select Service'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={COLORS.textLight} />
            </View>
            <ScrollView style={styles.pickerOptions} nestedScrollEnabled>
              {services.map((service) => (
                <TouchableOpacity
                  key={service.id}
                  style={styles.pickerOption}
                  onPress={() => handleInputChange('serviceId', service.id)}
                >
                  <Text>{service.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {formData.serviceId && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category *</Text>
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerText}>
                  {categories.find((c) => c.id === formData.categoryId)?.name || 'Select Category'}
                </Text>
                <Ionicons name="chevron-down" size={20} color={COLORS.textLight} />
              </View>
              <ScrollView style={styles.pickerOptions} nestedScrollEnabled>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={styles.pickerOption}
                    onPress={() => handleInputChange('categoryId', category.id)}
                  >
                    <Text>{category.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {formData.categoryId && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Brand *</Text>
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerText}>
                  {brands.find((b) => b.id === formData.brandId)?.name || 'Select Brand'}
                </Text>
                <Ionicons name="chevron-down" size={20} color={COLORS.textLight} />
              </View>
              <ScrollView style={styles.pickerOptions} nestedScrollEnabled>
                {brands.map((brand) => (
                  <TouchableOpacity
                    key={brand.id}
                    style={styles.pickerOption}
                    onPress={() => handleInputChange('brandId', brand.id)}
                  >
                    <Text>{brand.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {formData.brandId && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Model *</Text>
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerText}>
                  {models.find((m) => m.id === formData.modelId)?.name || 'Select Model'}
                </Text>
                <Ionicons name="chevron-down" size={20} color={COLORS.textLight} />
              </View>
              <ScrollView style={styles.pickerOptions} nestedScrollEnabled>
                {models.map((model) => (
                  <TouchableOpacity
                    key={model.id}
                    style={styles.pickerOption}
                    onPress={() => handleInputChange('modelId', model.id)}
                  >
                    <Text>{model.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specifications</Text>
          
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <TextInput
                style={styles.input}
                value={specKey}
                onChangeText={setSpecKey}
                placeholder="Spec Key"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <TextInput
                style={styles.input}
                value={specValue}
                onChangeText={setSpecValue}
                placeholder="Spec Value"
              />
            </View>
            <TouchableOpacity style={styles.addSpecButton} onPress={addSpecification}>
              <Ionicons name="add" size={20} color={COLORS.background} />
            </TouchableOpacity>
          </View>

          {Object.entries(formData.specifications).map(([key, value]) => (
            <View key={key} style={styles.specItem}>
              <Text style={styles.specText}>
                <Text style={styles.specKey}>{key}:</Text> {value}
              </Text>
              <TouchableOpacity onPress={() => removeSpecification(key)}>
                <Ionicons name="close-circle" size={20} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.background} />
          ) : (
            <Text style={styles.submitButtonText}>
              {isEdit ? 'Update Product' : 'Create Product'}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
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
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  switchActive: {
    backgroundColor: COLORS.primary,
  },
  switchThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.background,
  },
  switchThumbActive: {
    alignSelf: 'flex-end',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
  },
  pickerText: {
    fontSize: 16,
    color: COLORS.text,
  },
  pickerOptions: {
    maxHeight: 150,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    marginTop: 4,
  },
  pickerOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  addSpecButton: {
    backgroundColor: COLORS.primary,
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    marginTop: 24,
  },
  specItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  specText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
  specKey: {
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: COLORS.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddEditProductScreen;
