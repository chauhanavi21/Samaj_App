import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { Stack } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { adminAPI } from '@/services/api';
import { wp, hp, fontScale, padding } from '@/utils/responsive';

type RoleFilter = 'all' | 'user' | 'admin';

function getUserId(user: any): string {
  return String(
    user?._id ??
      user?.id ??
      user?.user?._id ??
      user?.user?.id ??
      ''
  );
}

function getUserRole(user: any): 'user' | 'admin' {
  const role = user?.role ?? user?.user?.role ?? 'user';
  return role === 'admin' ? 'admin' : 'user';
}

function normalizeUser(user: any) {
  const source = user?.user ? { ...user, ...user.user } : user || {};
  return {
    _id: getUserId(source),
    name: source?.name ?? '-',
    email: source?.email ?? '-',
    phone: source?.phone ?? '',
    memberId: source?.memberId ?? '-',
    role: getUserRole(source),
    createdAt: source?.createdAt,
    raw: user,
  };
}

function normalizePagination(p: any = {}) {
  return {
    page: Number(p?.page ?? p?.currentPage ?? 1),
    pages: Number(p?.pages ?? p?.totalPages ?? 1),
    total: Number(p?.total ?? p?.totalUsers ?? 0),
    limit: Number(p?.limit ?? 10),
  };
}

function toCSVValue(v: any) {
  const str = String(v ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export default function AdminUsers() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 10 });
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [exporting, setExporting] = useState(false);

  const [editForm, setEditForm] = useState<any>({
    name: '',
    email: '',
    phone: '',
    memberId: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const editScrollRef = useRef<ScrollView>(null);
  const passScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, roleFilter]);

  const totalUsersText = useMemo(() => `${pagination.total || 0} total users`, [pagination.total]);

  const loadUsers = async (opts?: { keepLoading?: boolean }) => {
    const keepLoading = opts?.keepLoading ?? false;
    try {
      if (!keepLoading) setLoading(true);

      const params: any = {
        page: currentPage,
        limit: 10,
      };

      const trimmed = search.trim();
      if (trimmed) params.search = trimmed;
      if (roleFilter !== 'all') params.role = roleFilter;

      const response = await adminAPI.getUsers(params);

      // Defensive response handling
      const listRaw =
        response?.data?.data ??
        response?.data ??
        response?.users ??
        [];

      const pageRaw =
        response?.data?.pagination ??
        response?.pagination ??
        {};

      const normalized = Array.isArray(listRaw) ? listRaw.map(normalizeUser) : [];
      setUsers(normalized);
      setPagination(normalizePagination(pageRaw));
    } catch (err: any) {
      console.error('Load users error:', err);
      Alert.alert('Error', err?.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadUsers({ keepLoading: true });
  };

  const clearSearch = () => {
    setSearch('');
    setCurrentPage(1);
    // give state a tick
    setTimeout(() => loadUsers({ keepLoading: true }), 0);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setCurrentPage(1);
    loadUsers({ keepLoading: true });
  };

  const viewUserDetails = async (userId: string) => {
    if (!userId) {
      Alert.alert('Error', 'Invalid user id');
      return;
    }
    try {
      const response = await adminAPI.getUserById(userId);
      const detail = response?.data?.data ?? response?.data ?? response;
      setSelectedUser(detail);
      setShowUserModal(true);
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to load user details');
    }
  };

  const startEdit = (user: any) => {
    const id = getUserId(user);
    if (!id) {
      Alert.alert('Error', 'Invalid user id');
      return;
    }
    setSelectedUser(user);
    setEditForm({
      name: user?.name ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      memberId: user?.memberId ?? '',
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    const userId = getUserId(selectedUser);
    if (!userId) {
      Alert.alert('Error', 'Invalid user id');
      return;
    }

    try {
      const payload = {
        name: editForm?.name?.trim(),
        email: editForm?.email?.trim(),
        phone: editForm?.phone?.trim(),
        memberId: editForm?.memberId?.trim(),
      };

      const response = await adminAPI.updateUser(userId, payload);
      if (response?.success || response?.data?.success || response?.status === 200) {
        Alert.alert('Success', 'User updated successfully');
        setShowEditModal(false);
        loadUsers({ keepLoading: true });
      } else {
        Alert.alert('Error', response?.message || 'Failed to update user');
      }
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to update user');
    }
  };

  const handleRoleChange = async (user: any) => {
    const userId = getUserId(user);
    if (!userId) {
      Alert.alert('Error', 'Invalid user id');
      return;
    }

    const currentRole = getUserRole(user);
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const action = newRole === 'admin' ? 'promote to admin' : 'demote to user';

    Alert.alert('Confirm Role Change', `Are you sure you want to ${action}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm',
        onPress: async () => {
          try {
            const response = await adminAPI.updateUserRole(userId, newRole);
            if (response?.success || response?.data?.success) {
              Alert.alert('Success', response?.message || 'Role updated');
              loadUsers({ keepLoading: true });
            } else {
              Alert.alert('Error', response?.message || 'Failed to update role');
            }
          } catch (err: any) {
            Alert.alert('Error', err?.response?.data?.message || 'Failed to update role');
          }
        },
      },
    ]);
  };

  const handleDelete = async (user: any) => {
    const userId = getUserId(user);
    if (!userId) {
      Alert.alert('Error', 'Invalid user id');
      return;
    }

    Alert.alert(
      'Delete User',
      `Are you sure you want to delete ${user?.name || 'this user'}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await adminAPI.deleteUser(userId, true);
              if (response?.success || response?.data?.success) {
                Alert.alert('Success', 'User deleted successfully');
                loadUsers({ keepLoading: true });
              } else {
                Alert.alert('Error', response?.message || 'Failed to delete user');
              }
            } catch (err: any) {
              Alert.alert('Error', err?.response?.data?.message || 'Failed to delete user');
            }
          },
        },
      ]
    );
  };

  const startPasswordChange = (user: any) => {
    const userId = getUserId(user);
    if (!userId) {
      Alert.alert('Error', 'Invalid user id');
      return;
    }
    setSelectedUser(user);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setShowPasswordModal(true);
  };

  const handlePasswordChange = async () => {
    const userId = getUserId(selectedUser);
    if (!userId) {
      Alert.alert('Error', 'Invalid user id');
      return;
    }

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
        userId,
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      if (response?.success || response?.data?.success) {
        Alert.alert('Success', 'Password changed successfully');
        setShowPasswordModal(false);
      } else {
        Alert.alert('Error', response?.message || 'Failed to change password');
      }
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to change password');
    }
  };

  const handleExportUsersCSV = async () => {
  if (exporting) return;

  try {
    setExporting(true);

    if (!users || users.length === 0) {
      Alert.alert('No data', 'There are no users to export.');
      return;
    }

    const escapeCSV = (value: any) => {
      const str = String(value ?? '');
      if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
      return str;
    };

    const lines = [
      'Name,Email,Member ID,Phone,Role,Created At',
      ...users.map((u: any) =>
        [
          escapeCSV(u?.name),
          escapeCSV(u?.email),
          escapeCSV(u?.memberId),
          escapeCSV(u?.phone || ''),
          escapeCSV(u?.role),
          escapeCSV(u?.createdAt ? new Date(u.createdAt).toLocaleString() : ''),
        ].join(',')
      ),
    ];

    const csvContent = lines.join('\n');
    const fileName = `users_export_${Date.now()}.csv`;
    const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

    // IMPORTANT: use plain string 'utf8' instead of FileSystem.EncodingType.UTF8
    await FileSystem.writeAsStringAsync(fileUri, csvContent, {
      encoding: 'utf8' as any,
    });

    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv',
        dialogTitle: 'Export users',
        UTI: 'public.comma-separated-values-text',
      });
    } else {
      Alert.alert('Export complete', `CSV saved at:\n${fileUri}`);
    }
  } catch (err: any) {
    console.error('Export error:', err);
    Alert.alert('Export failed', err?.message || 'Could not export users');
  } finally {
    setExporting(false);
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

      <View style={styles.header}>
        <Text style={styles.headerTitle}>User Management</Text>
        <Text style={styles.headerSubtitle}>{totalUsersText}</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <MaterialIcons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, email, member ID..."
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {search !== '' && (
            <TouchableOpacity onPress={clearSearch}>
              <MaterialIcons name="close" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <MaterialIcons name="search" size={24} color="#FFF" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleExportUsersCSV}
          style={[styles.exportButton, exporting && { opacity: 0.6 }]}
          disabled={exporting}
        >
          {exporting ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <MaterialIcons name="download" size={22} color="#FFF" />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        {(['all', 'user', 'admin'] as const).map((role) => (
          <TouchableOpacity
            key={role}
            onPress={() => {
              setRoleFilter(role);
              setCurrentPage(1);
            }}
            style={[styles.filterButton, roleFilter === role && styles.filterButtonActive]}
          >
            <Text style={[styles.filterButtonText, roleFilter === role && styles.filterButtonTextActive]}>
              {role === 'all' ? 'All' : role === 'admin' ? 'Admins' : 'Users'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.content}
        keyboardShouldPersistTaps="handled"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {users.map((user) => {
          const uid = getUserId(user);
          return (
            <View key={uid || Math.random().toString()} style={styles.userCard}>
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
                {!!user.phone && (
                  <Text style={styles.userDetail}>
                    <MaterialIcons name="phone" size={14} /> {user.phone}
                  </Text>
                )}
              </View>

              <View style={styles.userActions}>
                <TouchableOpacity onPress={() => viewUserDetails(uid)} style={styles.actionButton}>
                  <MaterialIcons name="visibility" size={20} color="#2196F3" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => startEdit(user)} style={styles.actionButton}>
                  <MaterialIcons name="edit" size={20} color="#4CAF50" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => startPasswordChange(user)} style={styles.actionButton}>
                  <MaterialIcons name="lock" size={20} color="#FF9800" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleRoleChange(user)} style={styles.actionButton}>
                  <MaterialIcons name="admin-panel-settings" size={20} color="#FF9800" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(user)} style={styles.actionButton}>
                  <MaterialIcons name="delete" size={20} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        {users.length === 0 && (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="people-outline" size={64} color="#CCC" />
            <Text style={styles.emptyText}>No users found</Text>
          </View>
        )}

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
      <Modal visible={showUserModal} animationType="slide" transparent onRequestClose={() => setShowUserModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>User Details</Text>
              <TouchableOpacity onPress={() => setShowUserModal(false)}>
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} keyboardShouldPersistTaps="handled">
              {(() => {
                const u = selectedUser?.user ? selectedUser.user : selectedUser;
                if (!u) return null;
                return (
                  <>
                    <Text style={styles.detailLabel}>Name:</Text>
                    <Text style={styles.detailValue}>{u?.name ?? '-'}</Text>

                    <Text style={styles.detailLabel}>Email:</Text>
                    <Text style={styles.detailValue}>{u?.email ?? '-'}</Text>

                    <Text style={styles.detailLabel}>Member ID:</Text>
                    <Text style={styles.detailValue}>{u?.memberId ?? '-'}</Text>

                    <Text style={styles.detailLabel}>Role:</Text>
                    <Text style={styles.detailValue}>{u?.role ?? '-'}</Text>

                    {!!u?.phone && (
                      <>
                        <Text style={styles.detailLabel}>Phone:</Text>
                        <Text style={styles.detailValue}>{u.phone}</Text>
                      </>
                    )}

                    <Text style={styles.detailLabel}>Family Tree Entries:</Text>
                    <Text style={styles.detailValue}>{selectedUser?.familyTreeCount ?? 0} entries (view-only)</Text>

                    <Text style={styles.detailLabel}>Joined:</Text>
                    <Text style={styles.detailValue}>
                      {u?.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}
                    </Text>
                  </>
                );
              })()}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Edit User Modal */}
      <Modal visible={showEditModal} animationType="slide" transparent onRequestClose={() => setShowEditModal(false)}>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 24 : 0}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit User</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView
              ref={editScrollRef}
              style={styles.modalBody}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: hp(4) }}
            >
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                value={editForm.name}
                onChangeText={(text) => setEditForm((prev: any) => ({ ...prev, name: text }))}
                returnKeyType="next"
                onFocus={() => editScrollRef.current?.scrollTo({ y: 40, animated: true })}
              />

              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={editForm.email}
                onChangeText={(text) => setEditForm((prev: any) => ({ ...prev, email: text }))}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                onFocus={() => editScrollRef.current?.scrollTo({ y: 120, animated: true })}
              />

              <Text style={styles.inputLabel}>Member ID</Text>
              <TextInput
                style={styles.input}
                value={editForm.memberId}
                onChangeText={(text) => setEditForm((prev: any) => ({ ...prev, memberId: text }))}
                returnKeyType="next"
                onFocus={() => editScrollRef.current?.scrollTo({ y: 220, animated: true })}
              />

              <Text style={styles.inputLabel}>Phone</Text>
              <TextInput
                style={styles.input}
                value={editForm.phone}
                onChangeText={(text) => setEditForm((prev: any) => ({ ...prev, phone: text }))}
                keyboardType="phone-pad"
                returnKeyType="done"
                onFocus={() => editScrollRef.current?.scrollTo({ y: 300, animated: true })}
              />

              <TouchableOpacity onPress={handleUpdate} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Change Password Modal */}
      <Modal visible={showPasswordModal} animationType="slide" transparent onRequestClose={() => setShowPasswordModal(false)}>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 24 : 0}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change Password</Text>
              <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView
              ref={passScrollRef}
              style={styles.modalBody}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: hp(4) }}
            >
              <Text style={styles.inputLabel}>Current Password*</Text>
              <TextInput
                style={styles.input}
                value={passwordForm.currentPassword}
                onChangeText={(text) => setPasswordForm((prev) => ({ ...prev, currentPassword: text }))}
                secureTextEntry
                placeholder="Enter current password"
                onFocus={() => passScrollRef.current?.scrollTo({ y: 40, animated: true })}
              />

              <Text style={styles.inputLabel}>New Password* (min 6 characters)</Text>
              <TextInput
                style={styles.input}
                value={passwordForm.newPassword}
                onChangeText={(text) => setPasswordForm((prev) => ({ ...prev, newPassword: text }))}
                secureTextEntry
                placeholder="Enter new password"
                onFocus={() => passScrollRef.current?.scrollTo({ y: 160, animated: true })}
              />

              <Text style={styles.inputLabel}>Confirm New Password*</Text>
              <TextInput
                style={styles.input}
                value={passwordForm.confirmPassword}
                onChangeText={(text) => setPasswordForm((prev) => ({ ...prev, confirmPassword: text }))}
                secureTextEntry
                placeholder="Re-enter new password"
                onFocus={() => passScrollRef.current?.scrollTo({ y: 260, animated: true })}
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
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: {
    backgroundColor: '#1A3A69',
    paddingHorizontal: padding.lg,
    paddingTop: hp(6),
    paddingBottom: hp(2),
  },
  headerTitle: { fontSize: fontScale(24), fontWeight: '700', color: '#FFFFFF' },
  headerSubtitle: { fontSize: fontScale(14), color: '#FFFFFF', opacity: 0.8, marginTop: hp(0.5) },

  searchContainer: { flexDirection: 'row', padding: padding.md, gap: padding.sm },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: padding.md,
    gap: padding.sm,
  },
  searchInput: { flex: 1, paddingVertical: padding.md, fontSize: fontScale(14) },
  searchButton: {
    backgroundColor: '#1A3A69',
    padding: padding.md,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exportButton: {
    backgroundColor: '#2E7D32',
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
  filterButtonActive: { backgroundColor: '#1A3A69' },
  filterButtonText: { fontSize: fontScale(14), color: '#666' },
  filterButtonTextActive: { color: '#FFFFFF', fontWeight: '600' },

  content: { flex: 1 },

  userCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: padding.md,
    marginBottom: padding.md,
    padding: padding.lg,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: padding.sm,
  },
  userInfo: { flex: 1 },
  userHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: hp(0.5), flexWrap: 'wrap' },
  userName: { fontSize: fontScale(16), fontWeight: '600', color: '#333' },
  adminBadge: { backgroundColor: '#FF9800', paddingHorizontal: padding.sm, paddingVertical: 2, borderRadius: 4, marginLeft: padding.sm },
  adminBadgeText: { fontSize: fontScale(10), fontWeight: '700', color: '#FFFFFF' },
  userDetail: { fontSize: fontScale(13), color: '#666', marginTop: hp(0.3) },

  userActions: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: padding.sm,
    maxWidth: wp(30),
    justifyContent: 'flex-end',
  },
  actionButton: {
    padding: padding.sm,
    backgroundColor: '#F7F7F7',
    borderRadius: 8,
  },

  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: hp(8) },
  emptyText: { fontSize: fontScale(16), color: '#999', marginTop: hp(2) },

  pagination: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: hp(2), gap: padding.lg },
  paginationButton: { padding: padding.sm },
  paginationButtonDisabled: { opacity: 0.3 },
  paginationText: { fontSize: fontScale(14), color: '#666' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: padding.md,
  },
  modalContent: {
    width: wp(92),
    maxHeight: hp(82),
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
  modalTitle: { fontSize: fontScale(18), fontWeight: '600', color: '#333' },
  modalBody: { padding: padding.lg },

  detailLabel: { fontSize: fontScale(12), color: '#999', marginTop: hp(1.5), marginBottom: hp(0.5) },
  detailValue: { fontSize: fontScale(16), color: '#333' },

  inputLabel: { fontSize: fontScale(14), color: '#666', marginTop: hp(1.5), marginBottom: hp(0.5) },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: padding.md,
    paddingVertical: padding.sm,
    fontSize: fontScale(14),
    backgroundColor: '#FFF',
  },

  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: padding.md,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: hp(2),
    marginBottom: hp(1),
  },
  saveButtonText: { color: '#FFFFFF', fontSize: fontScale(16), fontWeight: '600' },

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
