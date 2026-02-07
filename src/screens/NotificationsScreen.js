import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { COLORS } from '../utils/constants';
import { useAuth } from '../context/AuthContext';
import { notificationAPI } from '../services/api';

const NotificationsScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [inbox, setInbox] = useState([]);
  const [inboxLoading, setInboxLoading] = useState(false);
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    serviceRequests: true,
    quotations: true,
    promotions: false,
    newsletters: false,
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
  });

  const loadInbox = useCallback(async () => {
    if (!user?.id) return;
    try {
      setInboxLoading(true);
      const res = await notificationAPI.getNotifications(user.id, { page: 0, size: 30 });
      const content = res.data?.content ?? res.data ?? [];
      setInbox(Array.isArray(content) ? content : []);
    } catch {
      setInbox([]);
    } finally {
      setInboxLoading(false);
    }
  }, [user?.id]);

  useFocusEffect(useCallback(() => { loadInbox(); }, [loadInbox]));

  const handleMarkAllRead = async () => {
    if (!user?.id) return;
    try {
      await notificationAPI.markAllAsRead(user.id);
      loadInbox();
    } catch {}
  };

  const handleToggle = (key) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key],
    });
  };

  const notificationGroups = [
    {
      title: 'Order & Service Updates',
      items: [
        { key: 'orderUpdates', label: 'Order Status Updates', description: 'Get notified about your order status' },
        { key: 'serviceRequests', label: 'Service Request Updates', description: 'Updates on your service requests' },
        { key: 'quotations', label: 'Quotation Updates', description: 'Get notified when quotations are ready' },
      ],
    },
    {
      title: 'Marketing & Promotions',
      items: [
        { key: 'promotions', label: 'Promotional Offers', description: 'Receive offers and discounts' },
        { key: 'newsletters', label: 'Newsletters', description: 'Product updates and company news' },
      ],
    },
    {
      title: 'Notification Channels',
      items: [
        { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive push notifications on your device' },
        { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
        { key: 'smsNotifications', label: 'SMS Notifications', description: 'Receive notifications via SMS' },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <Header title="Notifications" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {user && (
          <View style={styles.inboxSection}>
            <View style={styles.inboxHeader}>
              <Text style={styles.groupTitle}>Inbox</Text>
              {inbox.some((n) => !n.read) && (
                <TouchableOpacity onPress={handleMarkAllRead}>
                  <Text style={styles.seeAll}>Mark all read</Text>
                </TouchableOpacity>
              )}
            </View>
            {inboxLoading ? (
              <ActivityIndicator size="small" color={COLORS.primary} style={{ padding: 16 }} />
            ) : inbox.length === 0 ? (
              <Text style={styles.inboxEmpty}>No notifications yet</Text>
            ) : (
              inbox.map((n) => (
                <View key={n.id} style={[styles.inboxItem, !n.read && styles.inboxItemUnread]}>
                  <Text style={styles.inboxTitle}>{n.title}</Text>
                  {n.body ? <Text style={styles.inboxBody}>{n.body}</Text> : null}
                  <Text style={styles.inboxDate}>
                    {n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}
                  </Text>
                </View>
              ))
            )}
          </View>
        )}
        {notificationGroups.map((group, groupIndex) => (
          <View key={groupIndex} style={styles.group}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            {group.items.map((item, itemIndex) => (
              <View
                key={item.key}
                style={[
                  styles.notificationItem,
                  itemIndex === group.items.length - 1 && styles.lastItem,
                ]}
              >
                <View style={styles.notificationInfo}>
                  <Text style={styles.notificationLabel}>{item.label}</Text>
                  <Text style={styles.notificationDescription}>{item.description}</Text>
                </View>
                <Switch
                  value={notifications[item.key]}
                  onValueChange={() => handleToggle(item.key)}
                  trackColor={{ false: COLORS.border, true: COLORS.primary }}
                  thumbColor={COLORS.background}
                />
              </View>
            ))}
          </View>
        ))}

        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={24} color={COLORS.primary} />
          <Text style={styles.infoText}>
            You will receive important updates about your orders and service requests regardless of these settings.
          </Text>
        </View>
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
  group: {
    backgroundColor: COLORS.background,
    marginTop: 16,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.border,
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  notificationInfo: {
    flex: 1,
    marginRight: 16,
  },
  notificationLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.border,
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 12,
    lineHeight: 20,
  },
  seeAll: { fontSize: 14, color: COLORS.primary, fontWeight: '600' },
  inboxSection: { marginTop: 8 },
  inboxHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.border,
  },
  inboxItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  inboxItemUnread: { backgroundColor: 'rgba(255,107,53,0.06)' },
  inboxTitle: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  inboxBody: { fontSize: 14, color: COLORS.textLight, marginTop: 4 },
  inboxDate: { fontSize: 12, color: COLORS.textLight, marginTop: 6 },
  inboxEmpty: { padding: 16, fontSize: 14, color: COLORS.textLight },
});

export default NotificationsScreen;
