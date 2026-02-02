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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { AppHeader } from '@/components/app-header';
import { router, Stack } from 'expo-router';
import { wp, hp, fontScale, padding } from '@/utils/responsive';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { authAPI } from '@/services/api';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [memberId, setMemberId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email.trim() || !memberId.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.forgotPassword(email.trim(), memberId.trim());
      
      if (response.success) {
        // Check if email was sent or if we got a dev token
        if (response.resetToken) {
          // Development mode - email service not configured
          Alert.alert(
            'Reset Token Generated',
            'Email service is not configured. Your reset token is:\n\n' + response.resetToken + '\n\nYou will now be taken to reset your password.',
            [
              {
                text: 'OK',
                onPress: () => {
                  router.push({
                    pathname: '/reset-password',
                    params: { resetToken: response.resetToken },
                  });
                },
              },
            ]
          );
        } else {
          // Production mode - email sent successfully
          Alert.alert(
            'Email Sent! 📧',
            `We've sent a password reset link to ${response.email}. Please check your inbox and spam folder.\n\nThe link will expire in ${response.expiresIn || '10 minutes'}.`,
            [
              {
                text: 'OK',
                onPress: () => router.back(),
              },
            ]
          );
        }
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to process password reset request'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <AppHeader showBack={true} />
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.content}>
            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.subtitle}>
              Enter your email and Member ID to reset your password
            </Text>

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
                <MaterialIcons name="badge" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Member ID"
                  placeholderTextColor="#999"
                  value={memberId}
                  onChangeText={setMemberId}
                  autoCapitalize="characters"
                />
              </View>

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleForgotPassword}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Reset Password</Text>
                )}
              </TouchableOpacity>

              <View style={styles.backToLoginContainer}>
                <TouchableOpacity onPress={() => router.back()}>
                  <Text style={styles.backToLoginText}>Back to Login</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.infoBox}>
              <MaterialIcons name="info" size={20} color="#FF8C00" />
              <Text style={styles.infoText}>
                We'll send a password reset email to your registered email address. The reset link will expire in 10 minutes.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: hp(3),
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
  backToLoginContainer: {
    alignItems: 'center',
    marginTop: hp(2),
  },
  backToLoginText: {
    fontSize: fontScale(16),
    color: '#1A3A69',
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF4E6',
    padding: padding.md,
    borderRadius: wp(2),
    marginTop: hp(3),
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: fontScale(14),
    color: '#666666',
    marginLeft: wp(2),
    lineHeight: fontScale(20),
  },
});
