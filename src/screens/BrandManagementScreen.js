import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { COLORS } from '../utils/constants';
import { adminAPI, productAPI } from '../services/api';
import Toast from 'react-native-toast-message';

const BrandManagementScreen = () => {
  const navigation = useNavigation();
  const [brands, setBrands] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    subCategoryId: null,
  });
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null); // 'category' or 'subCategory'

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedCategoryId) {
      loadSubCategoriesForCategory(selectedCategoryId);
    }
  }, [selectedCategoryId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [brandsRes, categoriesRes] = await Promise.all([
        adminAPI.getAllBrands(),
        adminAPI.getAllCategories(),
      ]);
      setBrands(brandsRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load brands',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSubCategoriesForCategory = async (categoryId) => {
    try {
      const response = await productAPI.getSubCategoriesByCategory(categoryId);
      setSubCategories(response.data || []);
    } catch (error) {
      console.error('Error loading sub categories:', error);
      setSubCategories([]);
    }
  };

  const handleAdd = () => {
    setEditingBrand(null);
    setFormData({ name: '', subCategoryId: null });
    setSelectedCategoryId(null);
    setSubCategories([]);
    setOpenDropdown(null);
    setShowModal(true);
  };

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name || '',
      subCategoryId: brand.subCategory?.id || null,
    });
    setSelectedCategoryId(brand.subCategory?.category?.id || null);
    setOpenDropdown(null);
    if (brand.subCategory?.category?.id) {
      loadSubCategoriesForCategory(brand.subCategory.category.id);
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Brand name is required',
      });
      return;
    }

    if (!formData.subCategoryId) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please select a sub category',
      });
      return;
    }

    try {
      if (editingBrand) {
        await adminAPI.updateBrand(editingBrand.id, formData);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Brand updated successfully',
        });
      } else {
        await adminAPI.createBrand(formData);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Brand created successfully',
        });
      }
      setShowModal(false);
      setOpenDropdown(null);
      loadData();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.error || 'Failed to save brand',
      });
    }
  };

  const handleDelete = (brand) => {
    setBrandToDelete(brand);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!brandToDelete) return;
    
    try {
      setLoading(true);
      setShowDeleteModal(false);
      await adminAPI.deleteBrand(brandToDelete.id);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Brand deleted successfully',
      });
      await loadData();
      setBrandToDelete(null);
    } catch (error) {
      console.error('Delete brand error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to delete brand',
      });
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setBrandToDelete(null);
  };

  const filteredBrands = brands.filter((brand) =>
    brand.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderBrand = ({ item }) => (
    <View style={styles.brandCard}>
      <View style={styles.brandInfo}>
        <Text style={styles.brandName}>{item.name}</Text>
        <Text style={styles.brandCategory}>
          Sub Category: {item.subCategory?.name || 'N/A'} • Category: {item.subCategory?.category?.name || 'N/A'}
        </Text>
      </View>
      <View style={styles.actions} pointerEvents="box-none">
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEdit(item)}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="create-outline" size={20} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            console.log('Delete button pressed for:', item.name);
            handleDelete(item);
          }}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Brand Management" showSearch={false} showCart={false} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Brand Management" showSearch={false} showCart={false} />
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.textLight} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search brands..."
          placeholderTextColor={COLORS.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={COLORS.textLight} />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.headerActions}>
        <Text style={styles.brandCount}>
          {filteredBrands.length} {filteredBrands.length === 1 ? 'Brand' : 'Brands'}
        </Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Ionicons name="add" size={20} color={COLORS.background} />
          <Text style={styles.addButtonText}>Add Brand</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredBrands}
        renderItem={renderBrand}
        keyExtractor={(item) => item.id?.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="pricetag-outline" size={64} color={COLORS.textLight} />
            <Text style={styles.emptyText}>No brands found</Text>
            <TouchableOpacity style={styles.emptyButton} onPress={handleAdd}>
              <Text style={styles.emptyButtonText}>Add Your First Brand</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Add/Edit Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setShowModal(false);
          setOpenDropdown(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingBrand ? 'Edit Brand' : 'Add Brand'}
              </Text>
              <TouchableOpacity onPress={() => {
                setShowModal(false);
                setOpenDropdown(null);
              }}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Brand Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter brand name"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Category *</Text>
              <TouchableOpacity
                style={styles.pickerContainer}
                onPress={() => setOpenDropdown(openDropdown === 'category' ? null : 'category')}
              >
                <Text style={styles.pickerText}>
                  {categories.find((c) => c.id === selectedCategoryId)?.name || 'Select Category'}
                </Text>
                <Ionicons 
                  name={openDropdown === 'category' ? 'chevron-up' : 'chevron-down'} 
                  size={20} 
                  color={COLORS.textLight} 
                />
              </TouchableOpacity>
              {openDropdown === 'category' && (
                <FlatList
                  data={categories}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.pickerOption}
                      onPress={() => {
                        setSelectedCategoryId(item.id);
                        setFormData({ ...formData, subCategoryId: null });
                        setOpenDropdown(null);
                      }}
                    >
                      <Text>{item.name}</Text>
                      {selectedCategoryId === item.id && (
                        <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                      )}
                    </TouchableOpacity>
                  )}
                  style={styles.pickerOptions}
                />
              )}
            </View>

            {selectedCategoryId && (
              <View style={styles.formGroup}>
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
                  <FlatList
                    data={subCategories}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.pickerOption}
                        onPress={() => {
                          setFormData({ ...formData, subCategoryId: item.id });
                          setOpenDropdown(null);
                        }}
                      >
                        <Text>{item.name}</Text>
                        {formData.subCategoryId === item.id && (
                          <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                        )}
                      </TouchableOpacity>
                    )}
                    style={styles.pickerOptions}
                  />
                )}
              </View>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowModal(false);
                  setOpenDropdown(null);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelDelete}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.deleteModalContent}>
            <Text style={styles.deleteModalTitle}>Delete Brand</Text>
            <Text style={styles.deleteModalMessage}>
              Are you sure you want to delete "{brandToDelete?.name || 'this brand'}"?
            </Text>
            <Text style={styles.deleteModalWarning}>
              This action cannot be undone.
            </Text>
            <View style={styles.deleteModalActions}>
              <TouchableOpacity
                style={[styles.deleteModalButton, styles.cancelDeleteButton]}
                onPress={cancelDelete}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelDeleteButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.deleteModalButton, styles.confirmDeleteButton]}
                onPress={confirmDelete}
                activeOpacity={0.7}
              >
                <Text style={styles.confirmDeleteButtonText}>Delete</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    margin: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: COLORS.text,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  brandCount: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  addButtonText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  brandCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
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
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 8,
  },
  editButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
    marginTop: 16,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  formGroup: {
    marginBottom: 20,
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
    marginTop: 8,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
  },
  pickerOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 24,
  },
  modalButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: COLORS.border,
  },
  cancelButtonText: {
    color: COLORS.text,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  saveButtonText: {
    color: COLORS.background,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteModalContent: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  deleteModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  deleteModalMessage: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: 22,
  },
  deleteModalWarning: {
    fontSize: 14,
    color: '#FF3B30',
    marginBottom: 24,
    fontWeight: '600',
  },
  deleteModalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  deleteModalButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelDeleteButton: {
    backgroundColor: COLORS.border,
  },
  cancelDeleteButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
  confirmDeleteButton: {
    backgroundColor: '#FF3B30',
  },
  confirmDeleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BrandManagementScreen;
