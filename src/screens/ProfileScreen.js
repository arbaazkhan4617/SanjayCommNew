import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../utils/constants';
import Toast from 'react-native-toast-message';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      // Call the logout function from AuthContext
      await logout();
      
      Toast.show({
        type: 'success',
        text1: 'Logged Out',
        text2: 'Redirecting to login...',
      });
      
      // Get the root navigator
      let rootNavigator = navigation;
      while (rootNavigator.getParent && rootNavigator.getParent()) {
        rootNavigator = rootNavigator.getParent();
      }
      
      // Force a state check by triggering a navigation action
      rootNavigator.dispatch((state) => {
        return CommonActions.navigate({
          name: state.routes[state.index].name,
          params: state.routes[state.index].params,
        });
      });
      
      // Wait for React to re-render with updated navigation structure
      // Then navigate to Login
      setTimeout(() => {
        requestAnimationFrame(() => {
          try {
            rootNavigator.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              })
            );
          } catch (navError) {
            console.log('Navigation error, retrying...', navError);
            // Retry after another frame
            setTimeout(() => {
              try {
                rootNavigator.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                  })
                );
              } catch (e) {
                console.log('Navigation will update automatically');
              }
            }, 200);
          }
        });
      }, 100);
    } catch (error) {
      console.error('Error logging out:', error);
      Toast.show({
        type: 'error',
        text1: 'Logout Error',
        text2: 'Failed to logout. Please try again.',
      });
    }
  };

  const menuItems = [
    {
      id: '1',
      title: 'My Orders',
      icon: 'receipt-outline',
      onPress: () => navigation.navigate('Orders'),
    },
    {
      id: '1b',
      title: 'My Requests',
      icon: 'document-text-outline',
      onPress: () => navigation.navigate('MyRequests'),
    },
    {
      id: '1c',
      title: 'Wishlist',
      icon: 'heart-outline',
      onPress: () => navigation.navigate('Wishlist'),
    },
    {
      id: '2',
      title: 'Addresses',
      icon: 'location-outline',
      onPress: () => navigation.navigate('Addresses'),
    },
    {
      id: '3',
      title: 'Payment Methods',
      icon: 'card-outline',
      onPress: () => navigation.navigate('PaymentMethods'),
    },
    {
      id: '4',
      title: 'Notifications',
      icon: 'notifications-outline',
      onPress: () => navigation.navigate('Notifications'),
    },
    {
      id: '5',
      title: 'Help & Support',
      icon: 'help-circle-outline',
      onPress: () => navigation.navigate('HelpSupport'),
    },
    {
      id: '6',
      title: 'About',
      icon: 'information-circle-outline',
      onPress: () => navigation.navigate('AboutUs'),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* User Info */}
        <View style={styles.userSection}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color={COLORS.primary} />
          </View>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
          <Text style={styles.userPhone}>{user?.phone || '+91-9179500312'}</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name={item.icon} size={24} color={COLORS.text} />
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={COLORS.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appName}>Integrators</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.appTagline}>Secure. Smart. Connected.</Text>
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
  header: {
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
  userSection: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: COLORS.background,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  menuSection: {
    backgroundColor: COLORS.background,
    marginTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    margin: 16,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.error,
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.error,
    marginLeft: 8,
  },
  appInfo: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 16,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  appTagline: {
    fontSize: 12,
    color: COLORS.textLight,
  },
});

export default ProfileScreen;
