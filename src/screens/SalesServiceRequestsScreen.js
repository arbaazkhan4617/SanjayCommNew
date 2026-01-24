import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { COLORS } from '../utils/constants';
import { salesAPI } from '../services/api';
import Toast from 'react-native-toast-message';

const SalesServiceRequestsScreen = () => {
  const navigation = useNavigation();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    loadServiceRequests();
  }, [filterStatus, sortBy]);

  const loadServiceRequests = async () => {
    try {
      setLoading(true);
      const response = await salesAPI.getAllServiceRequests(filterStatus || undefined, sortBy);
      setRequests(response.data);
    } catch (error) {
      console.error('Error loading service requests:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load service requests',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadServiceRequests();
  };

  const handleStatusUpdate = async () => {
    if (!newStatus) {
      Alert.alert('Error', 'Please select a status');
      return;
    }

    try {
      await salesAPI.updateServiceRequestStatus(selectedRequest.id, newStatus);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Service request status updated successfully',
      });
      setShowStatusModal(false);
      setSelectedRequest(null);
      setNewStatus('');
      loadServiceRequests();
    } catch (error) {
      console.error('Error updating service request status:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.error || 'Failed to update status',
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return '#FF9800';
      case 'IN_PROGRESS':
        return '#2196F3';
      case 'COMPLETED':
        return '#4CAF50';
      case 'RESOLVED':
        return '#4CAF50';
      case 'CANCELLED':
        return '#F44336';
      default:
        return COLORS.textLight;
    }
  };

  if (loading && requests.length === 0) {
    return (
      <View style={styles.container}>
        <Header title="Service Requests" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading service requests...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Service Requests" />
      
      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.filterButton, filterStatus === '' && styles.filterButtonActive]}
            onPress={() => setFilterStatus('')}
          >
            <Text style={[styles.filterText, filterStatus === '' && styles.filterTextActive]}>
              All
            </Text>
          </TouchableOpacity>
          {['PENDING', 'IN_PROGRESS', 'COMPLETED', 'RESOLVED', 'CANCELLED'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[styles.filterButton, filterStatus === status && styles.filterButtonActive]}
              onPress={() => setFilterStatus(status)}
            >
              <Text style={[styles.filterText, filterStatus === status && styles.filterTextActive]}>
                {status.replace('_', ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {requests.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="construct-outline" size={80} color={COLORS.textLight} />
            <Text style={styles.emptyText}>No service requests found</Text>
          </View>
        ) : (
          requests.map((request) => (
            <TouchableOpacity
              key={request.id}
              style={styles.requestCard}
              onPress={() => {
                setSelectedRequest(request);
                setNewStatus(request.status);
                setShowStatusModal(true);
              }}
            >
              <View style={styles.requestHeader}>
                <View style={styles.requestHeaderLeft}>
                  <Text style={styles.requestSubject}>{request.subject}</Text>
                  <Text style={styles.requestId}>Request #{request.id}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(request.status) }]}>
                  <Text style={styles.statusText}>{request.status || 'PENDING'}</Text>
                </View>
              </View>

              <Text style={styles.requestDescription} numberOfLines={3}>
                {request.description}
              </Text>

              <View style={styles.requestDetails}>
                {request.contactName && (
                  <View style={styles.requestDetailRow}>
                    <Ionicons name="person" size={16} color={COLORS.textLight} />
                    <Text style={styles.requestDetailText}>{request.contactName}</Text>
                  </View>
                )}
                {request.contactPhone && (
                  <View style={styles.requestDetailRow}>
                    <Ionicons name="call" size={16} color={COLORS.textLight} />
                    <Text style={styles.requestDetailText}>{request.contactPhone}</Text>
                  </View>
                )}
                {request.contactEmail && (
                  <View style={styles.requestDetailRow}>
                    <Ionicons name="mail" size={16} color={COLORS.textLight} />
                    <Text style={styles.requestDetailText}>{request.contactEmail}</Text>
                  </View>
                )}
                {request.address && (
                  <View style={styles.requestDetailRow}>
                    <Ionicons name="location" size={16} color={COLORS.textLight} />
                    <Text style={styles.requestDetailText} numberOfLines={1}>
                      {request.address}
                    </Text>
                  </View>
                )}
                <View style={styles.requestDetailRow}>
                  <Ionicons name="time" size={16} color={COLORS.textLight} />
                  <Text style={styles.requestDetailText}>
                    {request.createdAt
                      ? new Date(request.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'N/A'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Status Update Modal */}
      <Modal
        visible={showStatusModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowStatusModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Update Request Status</Text>
              <TouchableOpacity onPress={() => setShowStatusModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.modalLabel}>Request #{selectedRequest?.id}</Text>
              <Text style={styles.modalLabel}>Subject: {selectedRequest?.subject}</Text>
              <Text style={styles.modalLabel}>Current Status: {selectedRequest?.status}</Text>

              <Text style={styles.modalLabel}>New Status *</Text>
              {['PENDING', 'IN_PROGRESS', 'COMPLETED', 'RESOLVED', 'CANCELLED'].map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.statusOption,
                    newStatus === status && styles.statusOptionActive,
                  ]}
                  onPress={() => setNewStatus(status)}
                >
                  <Text
                    style={[
                      styles.statusOptionText,
                      newStatus === status && styles.statusOptionTextActive,
                    ]}
                  >
                    {status.replace('_', ' ')}
                  </Text>
                </TouchableOpacity>
              ))}

              {selectedRequest && (
                <>
                  <Text style={styles.modalLabel}>Description</Text>
                  <Text style={styles.modalDescription}>{selectedRequest.description}</Text>
                </>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => {
                  setShowStatusModal(false);
                  setSelectedRequest(null);
                  setNewStatus('');
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalSubmitButton]}
                onPress={handleStatusUpdate}
              >
                <Text style={styles.modalSubmitText}>Update Status</Text>
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textLight,
  },
  filtersContainer: {
    padding: 16,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.border,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  filterTextActive: {
    color: COLORS.background,
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
    fontSize: 18,
    color: COLORS.textLight,
    marginTop: 16,
  },
  requestCard: {
    backgroundColor: COLORS.background,
    padding: 16,
    margin: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  requestHeaderLeft: {
    flex: 1,
  },
  requestSubject: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  requestId: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: COLORS.background,
    fontSize: 12,
    fontWeight: '600',
  },
  requestDescription: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  requestDetails: {
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  requestDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  requestDetailText: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
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
    maxHeight: '90%',
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
    maxHeight: 500,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
    marginTop: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    padding: 12,
    backgroundColor: COLORS.border,
    borderRadius: 8,
  },
  statusOption: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8,
  },
  statusOptionActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  statusOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  statusOptionTextActive: {
    color: COLORS.background,
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

export default SalesServiceRequestsScreen;
