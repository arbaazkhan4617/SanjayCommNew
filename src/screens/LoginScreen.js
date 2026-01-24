import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../utils/constants';
import { validateEmail, formatValidationError } from '../utils/validation';
import { salesAPI, adminAPI } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const LoginScreen = () => {
  const navigation = useNavigation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill in all fields',
      });
      return;
    }

    // Validate email format
    if (!validateEmail(email)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Email',
        text2: 'Please enter a valid email address (e.g., user@example.com)',
      });
      return;
    }

    // Check if it's an admin email - automatically redirect to admin dashboard
    if (email.toLowerCase().trim() === 'admin@integrators.com') {
      try {
        setLoading(true);
        const response = await adminAPI.login(email, password);
        
        if (response.data.success) {
          const adminUser = {
            id: response.data.user.id,
            name: response.data.user.name,
            email: response.data.user.email,
            role: response.data.user.role,
          };
          
          await AsyncStorage.setItem('adminUser', JSON.stringify(adminUser));
          
          Toast.show({
            type: 'success',
            text1: 'Login Successful',
            text2: 'Welcome to Admin Dashboard',
          });
          
          setTimeout(() => {
            const rootNavigation = navigation.getParent() || navigation;
            rootNavigation.reset({
              index: 0,
              routes: [{ name: 'AdminStack' }],
            });
          }, 200);
        } else {
          Toast.show({
            type: 'error',
            text1: 'Login Failed',
            text2: response.data.error || 'Invalid credentials',
          });
        }
      } catch (error) {
        console.error('Admin login error:', error);
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: error.response?.data?.error || error.message || 'Unable to login',
        });
      } finally {
        setLoading(false);
      }
      return;
    }

    // Check if it's a sales email - automatically redirect to sales dashboard
    if (email.toLowerCase().trim() === 'sales@sanjaycomm.com') {
      try {
        setLoading(true);
        const response = await salesAPI.login(email, password);
        
        if (response.data.success) {
          const salesUser = {
            id: response.data.user.id,
            name: response.data.user.name,
            email: response.data.user.email,
            role: response.data.user.role,
          };
          
          await AsyncStorage.setItem('salesUser', JSON.stringify(salesUser));
          
          Toast.show({
            type: 'success',
            text1: 'Login Successful',
            text2: 'Welcome to Sales Dashboard',
          });
          
          // Force App.js to re-check by triggering a small delay
          // The App.js will detect salesUser and show SalesStack
          setTimeout(() => {
            // Try to get parent navigator (root navigator)
            const rootNavigation = navigation.getParent() || navigation;
            rootNavigation.reset({
              index: 0,
              routes: [{ name: 'SalesStack' }],
            });
          }, 200);
        } else {
          Toast.show({
            type: 'error',
            text1: 'Login Failed',
            text2: response.data.error || 'Invalid credentials',
          });
        }
      } catch (error) {
        console.error('Sales login error:', error);
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: error.response?.data?.error || error.message || 'Unable to login',
        });
      } finally {
        setLoading(false);
      }
      return;
    }

    // Regular user login
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Logged in successfully',
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: result.error || 'Invalid email or password',
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.logo}>Integrators</Text>
          <Text style={styles.tagline}>Secure. Smart. Connected.</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={COLORS.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={COLORS.textLight}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={COLORS.textLight}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color={COLORS.textLight}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  form: {
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 50,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
  eyeIcon: {
    padding: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  registerLink: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
