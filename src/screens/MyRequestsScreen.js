import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { COLORS } from '../utils/constants';
import { useAuth } from '../context/AuthContext';
import { orderAPI, serviceRequestAPI } from '../services/api';

const statusDisplay = {
  PENDING: { label: 'Pending', color: '#F59E0B' },
  IN_PROGRESS: { label: 'In Progress', color: '#3B82F6' },
  PROCESSING: { label: 'In Progress', color: '#3B82F6' },
  COMPLETED: { label: 'Quoted / Completed', color: '#10B981' },
  RESOLVED: { label: 'Closed', color: '#6B7280' },
  QUOTED: { label: 'Quoted', color: '#10B981' },
  SHIPPED: { label: 'Shipped', color: '#10B981' },
  DELIVERED: { label: 'Delivered', color: '#10B981' },
  CANCELLED: { label: 'Closed', color: '#6B7280' },
};

function getStatusStyle(status) {
  return statusDisplay[status] || { label: status || 'Unknown', color: COLORS.textLight };
}

const MyRequestsScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) loadAll();
  }, [user?.id]);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [ordersRes, requestsRes] = await Promise.all([
        orderAPI.getUserOrders(user.id),
        serviceRequestAPI.getUserServiceRequests(user.id),
      ]);
      setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
      setServiceRequests(Array.isArray(requestsRes.data) ? requestsRes.data : []);
    } catch (error) {
      console.error('Error loading requests:', error);
      setOrders([]);
      setServiceRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const combined = [
    ...orders.map((o) => ({ ...o, type: 'order', sortDate: o.createdAt })),
    ...serviceRequests.map((r) => ({ ...r, type: 'service', sortDate: r.createdAt })),
  ].sort((a, b) => new Date(b.sortDate || 0) - new Date(a.sortDate || 0));

  if (!user) {
    return (
      <View style={styles.container}>
        <Header title="My Requests" />
        <View style={styles.emptyContainer}>
          <Ionicons name="log-in-outline" size={64} color={COLORS.textLight} />
          <Text style={styles.emptyText}>Please log in to view your requests</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Profile')}>
            <Text style={styles.primaryButtonText}>Go to Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="My Requests" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (combined.length === 0) {
    return (
      <View style={styles.container}>
        <Header title="My Requests" />
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={64} color={COLORS.textLight} />
          <Text style={styles.emptyText}>No requests yet</Text>
          <Text style={styles.emptySubtext}>
            Your quotation and service requests will appear here
          </Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Products')}>
            <Text style={styles.primaryButtonText}>Browse Products</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="My Requests" />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {combined.map((item) => {
          const isOrder = item.type === 'order';
          const statusInfo = getStatusStyle(item.status);
          return (
            <View key={`${item.type}-${item.id}`} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleRow}>
                  <Ionicons
                    name={isOrder ? 'cart-outline' : 'construct-outline'}
                    size={20}
                    color={COLORS.primary}
                  />
                  <Text style={styles.cardTitle}>
                    {isOrder ? `Order #${item.id}` : item.subject || `Request #${item.id}`}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusInfo.color + '22' }]}>
                  <Text style={[styles.statusText, { color: statusInfo.color }]}>
                    {statusInfo.label}
                  </Text>
                </View>
              </View>
              <Text style={styles.date}>
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString(undefined, {
                      dateStyle: 'medium',
                    })
                  : 'N/A'}
              </Text>
              {isOrder && item.orderItems?.length > 0 && (
                <Text style={styles.preview} numberOfLines={2}>
                  {item.orderItems.map((i) => i.product?.name).filter(Boolean).join(', ')}
                </Text>
              )}
              {isOrder && item.total != null && (
                <Text style={styles.amount}>₹{parseFloat(item.total).toLocaleString()}</Text>
              )}
              {!isOrder && item.description && (
                <Text style={styles.preview} numberOfLines={2}>
                  {item.description}
                </Text>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: COLORS.textLight },
  scroll: { flex: 1 },
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: COLORS.text, marginLeft: 8 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 12, fontWeight: '600' },
  date: { fontSize: 12, color: COLORS.textLight, marginTop: 8 },
  preview: { fontSize: 13, color: COLORS.text, marginTop: 6 },
  amount: { fontSize: 14, fontWeight: '600', color: COLORS.primary, marginTop: 4 },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: { fontSize: 18, fontWeight: '600', color: COLORS.text, marginTop: 16, textAlign: 'center' },
  emptySubtext: { fontSize: 14, color: COLORS.textLight, marginTop: 8, textAlign: 'center' },
  primaryButton: {
    marginTop: 24,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  primaryButtonText: { color: COLORS.background, fontSize: 16, fontWeight: '600' },
});

export default MyRequestsScreen;
