import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { AppHeader } from '@/components/app-header';
import { router } from 'expo-router';
import { wp, hp, fontScale, padding } from '@/utils/responsive';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <AppHeader showBack={true} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.name}>{user.name}</Text>
            <View style={[styles.roleBadge, user.role === 'admin' && styles.adminBadge]}>
              <Text style={styles.roleText}>
                {user.role === 'admin' ? 'Administrator' : 'Member'}
              </Text>
            </View>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <MaterialIcons name="email" size={20} color="#1A3A69" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user.email}</Text>
              </View>
            </View>

            {user.phone && (
              <View style={styles.infoRow}>
                <MaterialIcons name="phone" size={20} color="#1A3A69" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>{user.phone}</Text>
                </View>
              </View>
            )}

            <View style={styles.infoRow}>
              <MaterialIcons name="person" size={20} color="#1A3A69" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Role</Text>
                <Text style={styles.infoValue}>
                  {user.role === 'admin' ? 'Administrator' : 'Regular User'}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialIcons name="logout" size={20} color="#FFFFFF" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: hp(4),
  },
  avatar: {
    width: wp(25),
    height: wp(25),
    borderRadius: wp(12.5),
    backgroundColor: '#1A3A69',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  avatarText: {
    fontSize: fontScale(36),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  name: {
    fontSize: fontScale(28),
    fontWeight: '700',
    color: '#1A3A69',
    marginBottom: hp(1),
  },
  roleBadge: {
    backgroundColor: '#E6F3FF',
    paddingHorizontal: padding.md,
    paddingVertical: hp(0.75),
    borderRadius: wp(5),
  },
  adminBadge: {
    backgroundColor: '#FFF4E6',
  },
  roleText: {
    fontSize: fontScale(14),
    fontWeight: '600',
    color: '#1A3A69',
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp(3),
    padding: padding.md,
    marginBottom: hp(3),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1.5),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoContent: {
    marginLeft: wp(3),
    flex: 1,
  },
  infoLabel: {
    fontSize: fontScale(14),
    color: '#666666',
    marginBottom: hp(0.5),
  },
  infoValue: {
    fontSize: fontScale(16),
    fontWeight: '600',
    color: '#333333',
  },
  logoutButton: {
    backgroundColor: '#FF4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(2),
    borderRadius: wp(2),
    gap: wp(2),
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: fontScale(18),
    fontWeight: '700',
  },
});
