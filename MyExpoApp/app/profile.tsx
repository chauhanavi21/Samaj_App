import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { AppHeader } from '@/components/app-header';
import { router, Stack } from 'expo-router';
import { wp, hp, fontScale, padding } from '@/utils/responsive';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { authAPI } from '@/services/api';

export default function ProfileScreen() {
  const { user, signOut, syncUser } = useAuth();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newMemberId, setNewMemberId] = useState(user?.memberId || '');
  const [updating, setUpdating] = useState(false);

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
            await signOut();
            router.replace('/login');
          },
        },
      ]
    );
  };

  const handleEditMemberId = () => {
    setNewMemberId(user?.memberId || '');
    setEditModalVisible(true);
  };

  const handleUpdateMemberId = async () => {
    if (!newMemberId.trim()) {
      Alert.alert('Error', 'Member ID cannot be empty');
      return;
    }

    setUpdating(true);
    try {
      const response = await authAPI.updateProfile({ memberId: newMemberId.trim() });
      if (response.success) {
        await syncUser(); // Refresh user data
        setEditModalVisible(false);
        Alert.alert('Success', 'Member ID updated successfully!');
      } else {
        Alert.alert('Error', response.message || 'Failed to update Member ID');
      }
    } catch (error: any) {
      console.error('Update Member ID error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || error.message || 'Failed to update Member ID'
      );
    } finally {
      setUpdating(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
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
              <MaterialIcons name="badge" size={20} color="#1A3A69" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Member ID</Text>
                <Text style={styles.infoValue}>
                  {user.memberId || 'Not set'}
                </Text>
              </View>
              <TouchableOpacity onPress={handleEditMemberId} style={styles.editButton}>
                <MaterialIcons name="edit" size={18} color="#1A3A69" />
              </TouchableOpacity>
            </View>

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

      {/* Edit Member ID Modal */}
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Member ID</Text>
            <Text style={styles.modalDescription}>
              Update your unique Member ID. This ID will be used to identify you in the Family Tree.
            </Text>

            <View style={styles.inputContainer}>
              <MaterialIcons name="badge" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter Member ID"
                placeholderTextColor="#999"
                value={newMemberId}
                onChangeText={setNewMemberId}
                autoCapitalize="characters"
                editable={!updating}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
                disabled={updating}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleUpdateMemberId}
                disabled={updating}
              >
                {updating ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.saveButtonText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  editButton: {
    padding: wp(2),
    borderRadius: wp(1),
    backgroundColor: '#E6F3FF',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp(3),
    padding: padding.lg,
    width: wp(85),
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: fontScale(24),
    fontWeight: '700',
    color: '#1A3A69',
    marginBottom: hp(1),
  },
  modalDescription: {
    fontSize: fontScale(14),
    color: '#666666',
    marginBottom: hp(3),
    lineHeight: fontScale(20),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: wp(2),
    paddingHorizontal: padding.sm,
    paddingVertical: hp(1.5),
    marginBottom: hp(3),
    backgroundColor: '#FAFAFA',
  },
  inputIcon: {
    marginRight: wp(2),
  },
  input: {
    flex: 1,
    fontSize: fontScale(16),
    color: '#333333',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: wp(3),
  },
  modalButton: {
    flex: 1,
    paddingVertical: hp(1.5),
    borderRadius: wp(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F0F0F0',
  },
  cancelButtonText: {
    fontSize: fontScale(16),
    fontWeight: '600',
    color: '#666666',
  },
  saveButton: {
    backgroundColor: '#1A3A69',
  },
  saveButtonText: {
    fontSize: fontScale(16),
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
