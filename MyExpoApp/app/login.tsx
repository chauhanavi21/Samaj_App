import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth, PendingApprovalError, AccountRejectedError } from '@/contexts/AuthContext';
import { AppHeader } from '@/components/app-header';
import { router, Stack } from 'expo-router';
import { wp, hp, fontScale, padding } from '@/utils/responsive';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const user = await login(email.trim(), password);
      
      // Route based on user role (from backend)
      if (user.role === 'admin') {
        router.replace('/(admin)');
      } else {
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      
      // Handle pending approval
      if (err instanceof PendingApprovalError || err.name === 'PendingApprovalError') {
        Alert.alert(
          'Account Pending Approval',
          'Your account is pending admin approval. You will be notified within 48 hours. Please try signing in again after approval.',
          [{ text: 'OK', style: 'default' }]
        );
        return;
      }
      
      // Handle rejected account
      if (err instanceof AccountRejectedError || err.name === 'AccountRejectedError') {
        Alert.alert(
          'Account Not Approved',
          err.message + (err.rejectionReason ? `\n\nReason: ${err.rejectionReason}` : ''),
          [{ text: 'Contact Support', style: 'default' }]
        );
        return;
      }
      
      const errorMessage = err.response?.data?.message || err.message || 'Login failed. Please check your credentials.';
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <AppHeader showBack={true} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Login to your account</Text>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <MaterialIcons name="email" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            <View style={styles.inputContainer}>
              <MaterialIcons name="lock" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <MaterialIcons
                  name={showPassword ? 'visibility' : 'visibility-off'}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.forgotPasswordButton}
              onPress={() => router.push('/forgot-password')}
            >
              <Text style={styles.forgotPasswordButtonText}>Forgot Password</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/signup')}>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: padding.lg,
    paddingTop: hp(3),
  },
  title: {
    fontSize: fontScale(36),
    fontWeight: '700',
    color: '#1A3A69',
    marginBottom: hp(1),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontScale(16),
    color: '#666666',
    marginBottom: hp(4),
    textAlign: 'center',
  },
  form: {
    marginTop: hp(2),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: wp(2),
    marginBottom: hp(2),
    paddingHorizontal: padding.md,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputIcon: {
    marginRight: wp(2),
  },
  input: {
    flex: 1,
    fontSize: fontScale(16),
    color: '#333333',
    paddingVertical: hp(1.5),
  },
  eyeIcon: {
    padding: wp(1),
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginBottom: hp(1),
    paddingHorizontal: padding.sm,
  },
  forgotPasswordButton: {
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#1A3A69',
    borderRadius: wp(2),
    paddingVertical: hp(1.2),
    paddingHorizontal: padding.lg,
    marginBottom: hp(2),
  },
  forgotPasswordButtonText: {
    fontSize: fontScale(14),
    color: '#1A3A69',
    fontWeight: '600',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1A3A69',
    paddingVertical: hp(2),
    borderRadius: wp(2),
    alignItems: 'center',
    marginTop: hp(1),
    marginBottom: hp(2),
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: fontScale(18),
    fontWeight: '700',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp(2),
  },
  signupText: {
    fontSize: fontScale(16),
    color: '#666666',
  },
  signupLink: {
    fontSize: fontScale(16),
    color: '#1A3A69',
    fontWeight: '600',
  },
});
