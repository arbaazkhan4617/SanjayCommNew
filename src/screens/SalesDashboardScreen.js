import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../utils/constants';
import { salesAPI } from '../services/api';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');

const SalesDashboardScreen = () => {
  const navigation = useNavigation();
  const [salesUser, setSalesUser] = useState(null);

  useEffect(() => {
    loadSalesUser();
  }, []);

  const loadSalesUser = async () => {
    try {
      const salesData = await AsyncStorage.getItem('salesUser');
      if (salesData) {
        setSalesUser(JSON.parse(salesData));
      }
    } catch (error) {
      console.error('Error loading sales user:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('salesUser');
      setSalesUser(null); // Clear local state
      
      // Get the root navigator and reset to SalesLogin
      // This will trigger AppNavigator's onStateChange which will re-check salesUser
      const rootNavigator = navigation.getRootNavigator ? navigation.getRootNavigator() : navigation;
      if (rootNavigator) {
        rootNavigator.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'SalesLogin' }],
          })
        );
      } else {
        // Fallback: navigate to trigger state change
        navigation.navigate('SalesLogin');
      }
    } catch (error) {
      console.error('Error logging out:', error);
      Toast.show({
        type: 'error',
        text1: 'Logout Error',
        text2: 'Failed to logout. Please try again.',
      });
    }
  };
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [ordersData, setOrdersData] = useState(null);
  const [serviceRequestsData, setServiceRequestsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [chartDays, setChartDays] = useState(7);

  useEffect(() => {
    loadDashboardData();
  }, [chartDays]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, revenueRes, ordersRes, serviceRequestsRes] = await Promise.all([
        salesAPI.getDashboardStats(),
        salesAPI.getRevenueChart(chartDays),
        salesAPI.getOrdersChart(chartDays),
        salesAPI.getServiceRequestsChart(chartDays),
      ]);

      setStats(statsRes.data);
      setRevenueData(revenueRes.data);
      setOrdersData(ordersRes.data);
      setServiceRequestsData(serviceRequestsRes.data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load dashboard data',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const chartConfig = {
    backgroundColor: COLORS.background,
    backgroundGradientFrom: COLORS.background,
    backgroundGradientTo: COLORS.background,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 107, 53, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: COLORS.primary,
    },
  };

  if (loading && !stats) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Sales Dashboard</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Sales Dashboard</Text>
          {salesUser && (
            <Text style={styles.headerSubtitle}>Welcome, {salesUser.name}</Text>
          )}
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statRow}>
            <View style={[styles.statCard, { backgroundColor: COLORS.primary }]}>
              <Ionicons name="cash" size={32} color={COLORS.background} />
              <Text style={styles.statValue}>
                ₹{stats?.totalRevenue ? parseFloat(stats.totalRevenue).toLocaleString() : '0'}
              </Text>
              <Text style={styles.statLabel}>Total Revenue</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: '#4CAF50' }]}>
              <Ionicons name="cash-outline" size={32} color={COLORS.background} />
              <Text style={styles.statValue}>
                ₹{stats?.todayRevenue ? parseFloat(stats.todayRevenue).toLocaleString() : '0'}
              </Text>
              <Text style={styles.statLabel}>Today's Revenue</Text>
            </View>
          </View>

          <View style={styles.statRow}>
            <View style={[styles.statCard, { backgroundColor: '#2196F3' }]}>
              <Ionicons name="receipt" size={32} color={COLORS.background} />
              <Text style={styles.statValue}>{stats?.totalOrders || 0}</Text>
              <Text style={styles.statLabel}>Total Orders</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: '#FF9800' }]}>
              <Ionicons name="construct" size={32} color={COLORS.background} />
              <Text style={styles.statValue}>{stats?.totalServiceRequests || 0}</Text>
              <Text style={styles.statLabel}>Service Requests</Text>
            </View>
          </View>

          <View style={styles.statRow}>
            <View style={[styles.statCard, { backgroundColor: '#9C27B0' }]}>
              <Ionicons name="people" size={32} color={COLORS.background} />
              <Text style={styles.statValue}>{stats?.totalCustomers || 0}</Text>
              <Text style={styles.statLabel}>Total Customers</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: '#F44336' }]}>
              <Ionicons name="time" size={32} color={COLORS.background} />
              <Text style={styles.statValue}>{stats?.pendingOrders || 0}</Text>
              <Text style={styles.statLabel}>Pending Orders</Text>
            </View>
          </View>
        </View>

        {/* Chart Period Selector */}
        <View style={styles.periodSelector}>
          <Text style={styles.sectionTitle}>Chart Period</Text>
          <View style={styles.periodButtons}>
            {[7, 30, 90].map((days) => (
              <TouchableOpacity
                key={days}
                style={[
                  styles.periodButton,
                  chartDays === days && styles.periodButtonActive,
                ]}
                onPress={() => setChartDays(days)}
              >
                <Text
                  style={[
                    styles.periodButtonText,
                    chartDays === days && styles.periodButtonTextActive,
                  ]}
                >
                  {days} Days
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Revenue Chart */}
        {revenueData && revenueData.labels && revenueData.labels.length > 0 && (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Revenue Trend</Text>
            <LineChart
              data={{
                labels: revenueData.labels,
                datasets: [
                  {
                    data: revenueData.data,
                  },
                ],
              }}
              width={width - 32}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              withInnerLines={true}
              withOuterLines={true}
              withVerticalLabels={true}
              withHorizontalLabels={true}
            />
          </View>
        )}

        {/* Orders Chart */}
        {ordersData && ordersData.labels && ordersData.labels.length > 0 && (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Orders Trend</Text>
            <BarChart
              data={{
                labels: ordersData.labels,
                datasets: [
                  {
                    data: ordersData.data,
                  },
                ],
              }}
              width={width - 32}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
              withInnerLines={true}
              withVerticalLabels={true}
              withHorizontalLabels={true}
            />
          </View>
        )}

        {/* Service Requests Chart */}
        {serviceRequestsData && serviceRequestsData.labels && serviceRequestsData.labels.length > 0 && (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Service Requests Trend</Text>
            <BarChart
              data={{
                labels: serviceRequestsData.labels,
                datasets: [
                  {
                    data: serviceRequestsData.data,
                  },
                ],
              }}
              width={width - 32}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
              withInnerLines={true}
              withVerticalLabels={true}
              withHorizontalLabels={true}
            />
          </View>
        )}

        {/* Status Summary */}
        <View style={styles.statusContainer}>
          <Text style={styles.sectionTitle}>Status Summary</Text>
          
          <View style={styles.statusRow}>
            <View style={styles.statusItem}>
              <View style={[styles.statusIndicator, { backgroundColor: '#FF9800' }]} />
              <Text style={styles.statusLabel}>Pending Orders</Text>
              <Text style={styles.statusValue}>{stats?.pendingOrders || 0}</Text>
            </View>
            <View style={styles.statusItem}>
              <View style={[styles.statusIndicator, { backgroundColor: '#4CAF50' }]} />
              <Text style={styles.statusLabel}>Completed Orders</Text>
              <Text style={styles.statusValue}>{stats?.completedOrders || 0}</Text>
            </View>
          </View>

          <View style={styles.statusRow}>
            <View style={styles.statusItem}>
              <View style={[styles.statusIndicator, { backgroundColor: '#FF9800' }]} />
              <Text style={styles.statusLabel}>Pending Requests</Text>
              <Text style={styles.statusValue}>{stats?.pendingServiceRequests || 0}</Text>
            </View>
            <View style={styles.statusItem}>
              <View style={[styles.statusIndicator, { backgroundColor: '#2196F3' }]} />
              <Text style={styles.statusLabel}>In Progress</Text>
              <Text style={styles.statusValue}>{stats?.inProgressServiceRequests || 0}</Text>
            </View>
            <View style={styles.statusItem}>
              <View style={[styles.statusIndicator, { backgroundColor: '#4CAF50' }]} />
              <Text style={styles.statusLabel}>Completed</Text>
              <Text style={styles.statusValue}>{stats?.completedServiceRequests || 0}</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('SalesOrders')}
          >
            <Ionicons name="receipt" size={24} color={COLORS.primary} />
            <View style={styles.actionButtonContent}>
              <Text style={styles.actionButtonTitle}>Manage Orders</Text>
              <Text style={styles.actionButtonSubtitle}>View and update order status</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('SalesServiceRequests')}
          >
            <Ionicons name="construct" size={24} color={COLORS.primary} />
            <View style={styles.actionButtonContent}>
              <Text style={styles.actionButtonTitle}>Service Requests</Text>
              <Text style={styles.actionButtonSubtitle}>Manage service requests</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
          </TouchableOpacity>
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
  statsContainer: {
    padding: 16,
  },
  statRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.background,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.background,
    opacity: 0.9,
    textAlign: 'center',
  },
  periodSelector: {
    padding: 16,
    backgroundColor: COLORS.background,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  periodButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  periodButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  periodButtonTextActive: {
    color: COLORS.background,
  },
  chartContainer: {
    padding: 16,
    backgroundColor: COLORS.background,
    marginBottom: 8,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  statusContainer: {
    padding: 16,
    backgroundColor: COLORS.background,
    marginTop: 8,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statusItem: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.border,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  actionsContainer: {
    padding: 16,
    backgroundColor: COLORS.background,
    marginTop: 8,
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  actionButtonContent: {
    flex: 1,
    marginLeft: 12,
  },
  actionButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  actionButtonSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 4,
  },
  logoutButton: {
    padding: 8,
  },
});

export default SalesDashboardScreen;
