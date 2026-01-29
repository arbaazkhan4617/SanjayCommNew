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
  Image,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { launchImageLibrary } from 'react-native-image-picker';
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
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null); // 'category', 'subCategory', 'brand', 'model', or null

  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price?.toString() || '',
    originalPrice: product?.originalPrice?.toString() || '',
    inStock: product?.inStock !== false,
    rating: product?.rating?.toString() || '',
    reviews: product?.reviews?.toString() || '',
    image: product?.image || '',
    imageUrls: product?.images || [],
    categoryId: product?.category?.id || null,
    subCategoryId: product?.subCategory?.id || null,
    brandId: product?.brand?.id || null,
    modelId: product?.model?.id || null,
    specifications: product?.specifications || {},
  });
  const [uploadingImages, setUploadingImages] = useState(false);

  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');

  useEffect(() => {
    loadCategories();
    if (isEdit) {
      loadHierarchy();
    }
  }, []);

  useEffect(() => {
    if (formData.categoryId) {
      loadSubCategories();
    }
  }, [formData.categoryId]);

  useEffect(() => {
    if (formData.subCategoryId) {
      loadBrands();
    }
  }, [formData.subCategoryId]);

  useEffect(() => {
    if (formData.brandId) {
      loadModels();
    }
  }, [formData.brandId]);

  const loadCategories = async () => {
    try {
      const response = await productAPI.getCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadHierarchy = async () => {
    if (product?.category?.id) {
      try {
        const [subCategoriesRes, brandsRes, modelsRes] = await Promise.all([
          productAPI.getSubCategoriesByCategory(product.category.id),
          product.subCategory?.id ? productAPI.getBrandsBySubCategory(product.subCategory.id) : Promise.resolve({ data: [] }),
          product.brand?.id ? productAPI.getModelsByBrand(product.brand.id) : Promise.resolve({ data: [] }),
        ]);
        setSubCategories(subCategoriesRes.data || []);
        setBrands(brandsRes.data || []);
        setModels(modelsRes.data || []);
      } catch (error) {
        console.error('Error loading hierarchy:', error);
      }
    }
  };

  const loadSubCategories = async () => {
    if (!formData.categoryId) return;
    try {
      const response = await productAPI.getSubCategoriesByCategory(formData.categoryId);
      setSubCategories(response.data || []);
    } catch (error) {
      console.error('Error loading sub categories:', error);
    }
  };

  const loadBrands = async () => {
    if (!formData.subCategoryId) return;
    try {
      const response = await productAPI.getBrandsBySubCategory(formData.subCategoryId);
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
    if (field === 'categoryId') {
      setFormData((prev) => ({ ...prev, subCategoryId: null, brandId: null, modelId: null }));
      setSubCategories([]);
      setBrands([]);
      setModels([]);
      setOpenDropdown(null); // Close dropdown when parent changes
    } else if (field === 'subCategoryId') {
      setFormData((prev) => ({ ...prev, brandId: null, modelId: null }));
      setBrands([]);
      setModels([]);
      setOpenDropdown(null); // Close dropdown when parent changes
    } else if (field === 'brandId') {
      setFormData((prev) => ({ ...prev, modelId: null }));
      setModels([]);
      setOpenDropdown(null); // Close dropdown when parent changes
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

  const pickImages = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      selectionLimit: 10, // Allow multiple images
      includeBase64: false,
    };

    launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
        return;
      }

      if (response.errorMessage) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.errorMessage,
        });
        return;
      }

      if (response.assets && response.assets.length > 0) {
        try {
          setUploadingImages(true);
          const uploadPromises = response.assets.map((asset) =>
            adminAPI.uploadImage(asset)
          );
          const results = await Promise.all(uploadPromises);
          const uploadedUrls = results
            .map((res) => res.data.imageUrl)
            .filter((url) => url);

          setFormData((prev) => ({
            ...prev,
            imageUrls: [...prev.imageUrls, ...uploadedUrls],
          }));

          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: `${uploadedUrls.length} image(s) uploaded successfully`,
          });
        } catch (error) {
          console.error('Error uploading images:', error);
          Toast.show({
            type: 'error',
            text1: 'Upload Error',
            text2: error.response?.data?.error || 'Failed to upload images',
          });
        } finally {
          setUploadingImages(false);
        }
      }
    });
  };

  const removeImage = (index) => {
    const newImageUrls = [...formData.imageUrls];
    newImageUrls.splice(index, 1);
    setFormData((prev) => ({ ...prev, imageUrls: newImageUrls }));
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
        imageUrls: formData.imageUrls,
        specifications: formData.specifications,
        // Note: Backend will derive category/subCategory from model hierarchy
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
      <Header title={isEdit ? 'Edit Product' : 'Add Product'} showSearch={false} showCart={false} />
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
            <Text style={styles.label}>Product Images</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={pickImages}
              disabled={uploadingImages}
            >
              {uploadingImages ? (
                <ActivityIndicator color={COLORS.background} />
              ) : (
                <>
                  <Ionicons name="camera" size={20} color={COLORS.background} />
                  <Text style={styles.uploadButtonText}>Upload Images</Text>
                </>
              )}
            </TouchableOpacity>
            <Text style={styles.uploadHint}>
              You can upload multiple images (up to 10)
            </Text>
            
            {formData.imageUrls.length > 0 && (
              <View style={styles.imagesContainer}>
                {formData.imageUrls.map((imageUrl, index) => (
                  <View key={index} style={styles.imageItem}>
                    <Image source={{ uri: imageUrl }} style={styles.thumbnail} />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => removeImage(index)}
                    >
                      <Ionicons name="close-circle" size={24} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
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
            <Text style={styles.label}>Category *</Text>
            <TouchableOpacity
              style={styles.pickerContainer}
              onPress={() => setOpenDropdown(openDropdown === 'category' ? null : 'category')}
            >
              <Text style={styles.pickerText}>
                {categories.find((c) => c.id === formData.categoryId)?.name || 'Select Category'}
              </Text>
              <Ionicons 
                name={openDropdown === 'category' ? 'chevron-up' : 'chevron-down'} 
                size={20} 
                color={COLORS.textLight} 
              />
            </TouchableOpacity>
            {openDropdown === 'category' && (
              <ScrollView style={styles.pickerOptions} nestedScrollEnabled>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={styles.pickerOption}
                    onPress={() => {
                      handleInputChange('categoryId', category.id);
                      setOpenDropdown(null);
                    }}
                  >
                    <Text>{category.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          {formData.categoryId && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Sub Category *</Text>
              <TouchableOpacity
                style={styles.pickerContainer}
                onPress={() => setOpenDropdown(openDropdown === 'subCategory' ? null : 'subCategory')}
              >
                <Text style={styles.pickerText}>
                  {subCategories.find((sc) => sc.id === formData.subCategoryId)?.name || 'Select Sub Category'}
                </Text>
                <Ionicons 
                  name={openDropdown === 'subCategory' ? 'chevron-up' : 'chevron-down'} 
                  size={20} 
                  color={COLORS.textLight} 
                />
              </TouchableOpacity>
              {openDropdown === 'subCategory' && (
                <ScrollView style={styles.pickerOptions} nestedScrollEnabled>
                  {subCategories.map((subCategory) => (
                    <TouchableOpacity
                      key={subCategory.id}
                      style={styles.pickerOption}
                      onPress={() => {
                        handleInputChange('subCategoryId', subCategory.id);
                        setOpenDropdown(null);
                      }}
                    >
                      <Text>{subCategory.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          )}

          {formData.subCategoryId && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Brand *</Text>
              <TouchableOpacity
                style={styles.pickerContainer}
                onPress={() => setOpenDropdown(openDropdown === 'brand' ? null : 'brand')}
              >
                <Text style={styles.pickerText}>
                  {brands.find((b) => b.id === formData.brandId)?.name || 'Select Brand'}
                </Text>
                <Ionicons 
                  name={openDropdown === 'brand' ? 'chevron-up' : 'chevron-down'} 
                  size={20} 
                  color={COLORS.textLight} 
                />
              </TouchableOpacity>
              {openDropdown === 'brand' && (
                <ScrollView style={styles.pickerOptions} nestedScrollEnabled>
                  {brands.map((brand) => (
                    <TouchableOpacity
                      key={brand.id}
                      style={styles.pickerOption}
                      onPress={() => {
                        handleInputChange('brandId', brand.id);
                        setOpenDropdown(null);
                      }}
                    >
                      <Text>{brand.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          )}

          {formData.brandId && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Model *</Text>
              <TouchableOpacity
                style={styles.pickerContainer}
                onPress={() => setOpenDropdown(openDropdown === 'model' ? null : 'model')}
              >
                <Text style={styles.pickerText}>
                  {models.find((m) => m.id === formData.modelId)?.name || 'Select Model'}
                </Text>
                <Ionicons 
                  name={openDropdown === 'model' ? 'chevron-up' : 'chevron-down'} 
                  size={20} 
                  color={COLORS.textLight} 
                />
              </TouchableOpacity>
              {openDropdown === 'model' && (
                <ScrollView style={styles.pickerOptions} nestedScrollEnabled>
                  {models.map((model) => (
                    <TouchableOpacity
                      key={model.id}
                      style={styles.pickerOption}
                      onPress={() => {
                        handleInputChange('modelId', model.id);
                        setOpenDropdown(null);
                      }}
                    >
                      <Text>{model.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
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
  uploadButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
    gap: 8,
  },
  uploadButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '600',
  },
  uploadHint: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 8,
    fontStyle: 'italic',
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 12,
  },
  imageItem: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: COLORS.background,
    borderRadius: 12,
  },
});

export default AddEditProductScreen;
