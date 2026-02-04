import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { Stack } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { adminAPI } from '@/services/api';
import { wp, hp, fontScale, padding } from '@/utils/responsive';

export default function AdminUsers() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>({});
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    loadUsers();
  }, [currentPage, roleFilter]);

  const loadUsers = async () => {
    try {
      const params: any = {
        page: currentPage,
        limit: 10,
        search: search.trim(),
      };
      if (roleFilter !== 'all') {
        params.role = roleFilter;
      }

      const response = await adminAPI.getUsers(params);
      if (response.success) {
        setUsers(response.data);
        setPagination(response.pagination);
      }
    } catch (err: any) {
      console.error('Load users error:', err);
      Alert.alert('Error', err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadUsers();
  };

  const onRefresh = () => {
    setRefreshing(true);
    setCurrentPage(1);
    loadUsers();
  };

  const viewUserDetails = async (userId: string) => {
    try {
      const response = await adminAPI.getUserById(userId);
      if (response.success) {
        setSelectedUser(response.data);
        setShowUserModal(true);
      }
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to load user details');
    }
  };

  const startEdit = (user: any) => {
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      memberId: user.memberId,
    });
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await adminAPI.updateUser(selectedUser._id, editForm);
      if (response.success) {
        Alert.alert('Success', 'User updated successfully');
        setShowEditModal(false);
        loadUsers();
      }
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to update user');
    }
  };

  const handleRoleChange = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const action = newRole === 'admin' ? 'promote to admin' : 'demote to user';
    
    Alert.alert(
      'Confirm Role Change',
      `Are you sure you want to ${action}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              const response = await adminAPI.updateUserRole(userId, newRole);
              if (response.success) {
                Alert.alert('Success', response.message);
                loadUsers();
              }
            } catch (err: any) {
              Alert.alert('Error', err.response?.data?.message || 'Failed to update role');
            }
          },
        },
      ]
    );
  };

  const handleDelete = async (userId: string, userName: string) => {
    Alert.alert(
      'Delete User',
      `Are you sure you want to delete ${userName}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await adminAPI.deleteUser(userId, true);
              if (response.success) {
                Alert.alert('Success', 'User deleted successfully');
                loadUsers();
              }
            } catch (err: any) {
              Alert.alert('Error', err.response?.data?.message || 'Failed to delete user');
            }
          },
        },
      ]
    );
  };

  const startPasswordChange = (user: any) => {
    setSelectedUser(user);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setShowPasswordModal(true);
  };

  const handlePasswordChange = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      Alert.alert('Error', 'All password fields are required');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    try {
      const response = await adminAPI.changeUserPassword(
        selectedUser._id,
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      if (response.success) {
        Alert.alert('Success', 'Password changed successfully');
        setShowPasswordModal(false);
      }
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to change password');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#1A3A69" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'User Management', headerShown: false }} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>User Management</Text>
        <Text style={styles.headerSubtitle}>{pagination.total || 0} total users</Text>
      </View>

      {/* Search & Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <MaterialIcons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, email, member ID..."
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSearch}
          />
          {search !== '' && (
            <TouchableOpacity onPress={() => { setSearch(''); handleSearch(); }}>
              <MaterialIcons name="close" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <MaterialIcons name="search" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Role Filter */}
      <View style={styles.filterContainer}>
        {(['all', 'user', 'admin'] as const).map((role) => (
          <TouchableOpacity
            key={role}
            onPress={() => { setRoleFilter(role); setCurrentPage(1); }}
            style={[styles.filterButton, roleFilter === role && styles.filterButtonActive]}
          >
            <Text style={[styles.filterButtonText, roleFilter === role && styles.filterButtonTextActive]}>
              {role === 'all' ? 'All' : role === 'admin' ? 'Admins' : 'Users'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* User List */}
      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {users.map((user) => (
          <View key={user._id} style={styles.userCard}>
            <View style={styles.userInfo}>
              <View style={styles.userHeader}>
                <Text style={styles.userName}>{user.name}</Text>
                {user.role === 'admin' && (
                  <View style={styles.adminBadge}>
                    <Text style={styles.adminBadgeText}>ADMIN</Text>
                  </View>
                )}
              </View>
              <Text style={styles.userDetail}>
                <MaterialIcons name="email" size={14} /> {user.email}
              </Text>
              <Text style={styles.userDetail}>
                <MaterialIcons name="badge" size={14} /> {user.memberId}
              </Text>
              {user.phone && (
                <Text style={styles.userDetail}>
                  <MaterialIcons name="phone" size={14} /> {user.phone}
                </Text>
              )}
            </View>

            <View style={styles.userActions}>
              <TouchableOpacity onPress={() => viewUserDetails(user._id)} style={styles.actionButton}>
                <MaterialIcons name="visibility" size={20} color="#2196F3" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => startEdit(user)} style={styles.actionButton}>
                <MaterialIcons name="edit" size={20} color="#4CAF50" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => startPasswordChange(user)} style={styles.actionButton}>
                <MaterialIcons name="lock" size={20} color="#FF9800" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleRoleChange(user._id, user.role)} style={styles.actionButton}>
                <MaterialIcons name="admin-panel-settings" size={20} color="#FF9800" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(user._id, user.name)} style={styles.actionButton}>
                <MaterialIcons name="delete" size={20} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {users.length === 0 && (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="people-outline" size={64} color="#CCC" />
            <Text style={styles.emptyText}>No users found</Text>
          </View>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <View style={styles.pagination}>
            <TouchableOpacity
              onPress={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              style={[styles.paginationButton, currentPage === 1 && styles.paginationButtonDisabled]}
            >
              <MaterialIcons name="chevron-left" size={24} color={currentPage === 1 ? '#CCC' : '#1A3A69'} />
            </TouchableOpacity>
            
            <Text style={styles.paginationText}>
              Page {currentPage} of {pagination.pages}
            </Text>
            
            <TouchableOpacity
              onPress={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
              disabled={currentPage === pagination.pages}
              style={[styles.paginationButton, currentPage === pagination.pages && styles.paginationButtonDisabled]}
            >
              <MaterialIcons name="chevron-right" size={24} color={currentPage === pagination.pages ? '#CCC' : '#1A3A69'} />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* User Details Modal */}
      <Modal visible={showUserModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>User Details</Text>
              <TouchableOpacity onPress={() => setShowUserModal(false)}>
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            {selectedUser && (
              <ScrollView style={styles.modalBody}>
                <Text style={styles.detailLabel}>Name:</Text>
                <Text style={styles.detailValue}>{selectedUser.user?.name}</Text>
                
                <Text style={styles.detailLabel}>Email:</Text>
                <Text style={styles.detailValue}>{selectedUser.user?.email}</Text>
                
                <Text style={styles.detailLabel}>Member ID:</Text>
                <Text style={styles.detailValue}>{selectedUser.user?.memberId}</Text>
                
                <Text style={styles.detailLabel}>Role:</Text>
                <Text style={styles.detailValue}>{selectedUser.user?.role}</Text>
                
                {selectedUser.user?.phone && (
                  <>
                    <Text style={styles.detailLabel}>Phone:</Text>
                    <Text style={styles.detailValue}>{selectedUser.user.phone}</Text>
                  </>
                )}
                
                <Text style={styles.detailLabel}>Family Tree Entries:</Text>
                <Text style={styles.detailValue}>{selectedUser.familyTreeCount} entries (view-only)</Text>
                
                <Text style={styles.detailLabel}>Joined:</Text>
                <Text style={styles.detailValue}>
                  {new Date(selectedUser.user?.createdAt).toLocaleDateString()}
                </Text>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Edit User Modal */}
      <Modal visible={showEditModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit User</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                value={editForm.name}
                onChangeText={(text) => setEditForm({ ...editForm, name: text })}
              />
              
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={editForm.email}
                onChangeText={(text) => setEditForm({ ...editForm, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              
              <Text style={styles.inputLabel}>Member ID</Text>
              <TextInput
                style={styles.input}
                value={editForm.memberId}
                onChangeText={(text) => setEditForm({ ...editForm, memberId: text })}
              />
              
              <Text style={styles.inputLabel}>Phone</Text>
              <TextInput
                style={styles.input}
                value={editForm.phone}
                onChangeText={(text) => setEditForm({ ...editForm, phone: text })}
                keyboardType="phone-pad"
              />
              
              <TouchableOpacity onPress={handleUpdate} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Change Password Modal */}
      <Modal visible={showPasswordModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change Password</Text>
              <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <Text style={styles.inputLabel}>Current Password*</Text>
              <TextInput
                style={styles.input}
                value={passwordForm.currentPassword}
                onChangeText={(text) => setPasswordForm({ ...passwordForm, currentPassword: text })}
                secureTextEntry
                placeholder="Enter current password"
              />
              
              <Text style={styles.inputLabel}>New Password* (min 6 characters)</Text>
              <TextInput
                style={styles.input}
                value={passwordForm.newPassword}
                onChangeText={(text) => setPasswordForm({ ...passwordForm, newPassword: text })}
                secureTextEntry
                placeholder="Enter new password"
              />
              
              <Text style={styles.inputLabel}>Confirm New Password*</Text>
              <TextInput
                style={styles.input}
                value={passwordForm.confirmPassword}
                onChangeText={(text) => setPasswordForm({ ...passwordForm, confirmPassword: text })}
                secureTextEntry
                placeholder="Re-enter new password"
              />

              <View style={styles.passwordNote}>
                <MaterialIcons name="info" size={16} color="#FF9800" />
                <Text style={styles.passwordNoteText}>
                  After changing password, please update ENABLE_ADMIN_BOOTSTRAP=false on Render to prevent reset.
                </Text>
              </View>
              
              <TouchableOpacity onPress={handlePasswordChange} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Change Password</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#1A3A69',
    paddingHorizontal: padding.lg,
    paddingTop: hp(6),
    paddingBottom: hp(2),
  },
  headerTitle: {
    fontSize: fontScale(24),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: fontScale(14),
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: hp(0.5),
  },
  searchContainer: {
    flexDirection: 'row',
    padding: padding.md,
    gap: padding.sm,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: padding.md,
    gap: padding.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: padding.md,
    fontSize: fontScale(14),
  },
  searchButton: {
    backgroundColor: '#1A3A69',
    padding: padding.md,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: padding.md,
    gap: padding.sm,
    marginBottom: padding.md,
  },
  filterButton: {
    flex: 1,
    paddingVertical: padding.sm,
    paddingHorizontal: padding.md,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#1A3A69',
  },
  filterButtonText: {
    fontSize: fontScale(14),
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: padding.md,
    marginBottom: padding.md,
    padding: padding.lg,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userInfo: {
    flex: 1,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(0.5),
  },
  userName: {
    fontSize: fontScale(16),
    fontWeight: '600',
    color: '#333',
  },
  adminBadge: {
    backgroundColor: '#FF9800',
    paddingHorizontal: padding.sm,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: padding.sm,
  },
  adminBadgeText: {
    fontSize: fontScale(10),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  userDetail: {
    fontSize: fontScale(13),
    color: '#666',
    marginTop: hp(0.3),
  },
  userActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: padding.sm,
  },
  actionButton: {
    padding: padding.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(8),
  },
  emptyText: {
    fontSize: fontScale(16),
    color: '#999',
    marginTop: hp(2),
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(2),
    gap: padding.lg,
  },
  paginationButton: {
    padding: padding.sm,
  },
  paginationButtonDisabled: {
    opacity: 0.3,
  },
  paginationText: {
    fontSize: fontScale(14),
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: wp(90),
    maxHeight: hp(80),
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: padding.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: fontScale(18),
    fontWeight: '600',
    color: '#333',
  },
  modalBody: {
    padding: padding.lg,
  },
  detailLabel: {
    fontSize: fontScale(12),
    color: '#999',
    marginTop: hp(1.5),
    marginBottom: hp(0.5),
  },
  detailValue: {
    fontSize: fontScale(16),
    color: '#333',
  },
  inputLabel: {
    fontSize: fontScale(14),
    color: '#666',
    marginTop: hp(1.5),
    marginBottom: hp(0.5),
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: padding.md,
    paddingVertical: padding.sm,
    fontSize: fontScale(14),
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: padding.md,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: hp(2),
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: fontScale(16),
    fontWeight: '600',
  },
  passwordNote: {
    flexDirection: 'row',
    gap: padding.sm,
    backgroundColor: '#FFF3E0',
    padding: padding.md,
    borderRadius: 8,
    marginTop: hp(2),
  },
  passwordNoteText: {
    flex: 1,
    fontSize: fontScale(12),
    color: '#E65100',
    lineHeight: fontScale(18),
  },
});
