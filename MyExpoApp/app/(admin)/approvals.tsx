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
} from 'react-native';
import { Stack } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { adminAPI } from '@/services/api';
import { wp, hp, fontScale, padding } from '@/utils/responsive';

function toMillis(ts: any) {
  if (!ts) return 0;
  if (typeof ts === 'number') return ts;
  if (typeof ts === 'string') {
    const parsed = Date.parse(ts);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  if (typeof ts?.toMillis === 'function') return ts.toMillis();
  if (typeof ts?.toDate === 'function') return ts.toDate().getTime();
  if (typeof ts?._seconds === 'number') return ts._seconds * 1000;
  return 0;
}

export default function AdminApprovals() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  const inFlightRef = useRef(false);

  const sorted = useMemo(() => {
    const copy = [...items];
    copy.sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
    return copy;
  }, [items]);

  const load = async () => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    try {
      setLoading(true);
      const params: any = {};
      const trimmed = search.trim();
      if (trimmed) params.search = trimmed;
      const res = await adminAPI.getApprovals(params);
      const list = res?.data ?? [];
      setItems(Array.isArray(list) ? list : []);
    } catch (err: any) {
      console.error('Approvals load error:', err);
      Alert.alert('Error', err?.response?.data?.message || 'Failed to load approvals');
    } finally {
      inFlightRef.current = false;
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  const approve = async (user: any) => {
    const id = String(user?.id || user?._id || '');
    if (!id) return;

    Alert.alert('Approve user', `Approve ${user?.name || 'this user'}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Approve',
        onPress: async () => {
          try {
            await adminAPI.approveUser(id);
            Alert.alert('Approved', 'User approved successfully');
            load();
          } catch (err: any) {
            Alert.alert('Error', err?.response?.data?.message || 'Failed to approve user');
          }
        },
      },
    ]);
  };

  const reject = async (user: any) => {
    const id = String(user?.id || user?._id || '');
    if (!id) return;

    Alert.alert('Reject user', `Reject ${user?.name || 'this user'}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reject',
        style: 'destructive',
        onPress: async () => {
          try {
            await adminAPI.rejectUser(id, '');
            Alert.alert('Rejected', 'User rejected');
            load();
          } catch (err: any) {
            Alert.alert('Error', err?.response?.data?.message || 'Failed to reject user');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pending Approvals</Text>
        <Text style={styles.headerSubtitle}>Approve or reject new signups</Text>
      </View>

      <View style={styles.searchRow}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search name, email, memberId, phone"
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
          returnKeyType="search"
          onSubmitEditing={load}
        />
        <TouchableOpacity style={styles.searchButton} onPress={load}>
          <MaterialIcons name="search" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#1A3A69" />
          <Text style={styles.loadingText}>Loading pending approvals...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {sorted.length === 0 ? (
            <Text style={styles.emptyText}>No pending approvals</Text>
          ) : (
            sorted.map((u, idx) => (
              <View key={u.id || idx} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={styles.cardInfo}>
                    <Text style={styles.name}>{u.name || '-'}</Text>
                    <Text style={styles.meta}>{u.email || '-'}</Text>
                    <Text style={styles.meta}>Member ID: {u.memberId || '-'}</Text>
                    <Text style={styles.meta}>Phone: {u.phone || '-'}</Text>
                  </View>
                </View>

                <View style={styles.actions}>
                  <TouchableOpacity style={[styles.actionBtn, styles.approveBtn]} onPress={() => approve(u)}>
                    <MaterialIcons name="check" size={18} color="#FFFFFF" />
                    <Text style={styles.actionText}>Approve</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.actionBtn, styles.rejectBtn]} onPress={() => reject(u)}>
                    <MaterialIcons name="close" size={18} color="#FFFFFF" />
                    <Text style={styles.actionText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}

          <View style={{ height: hp(4) }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#1A3A69',
    paddingHorizontal: padding.lg,
    paddingTop: hp(6),
    paddingBottom: hp(2),
  },
  headerTitle: {
    fontSize: fontScale(22),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: fontScale(13),
    color: '#FFFFFF',
    opacity: 0.85,
    marginTop: hp(0.5),
  },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: padding.lg,
    paddingVertical: hp(1.5),
    gap: wp(2),
    backgroundColor: '#F5F5F5',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: wp(2),
    paddingHorizontal: padding.md,
    paddingVertical: hp(1.2),
    fontSize: fontScale(14),
    color: '#111827',
  },
  searchButton: {
    backgroundColor: '#1A3A69',
    paddingHorizontal: padding.md,
    borderRadius: wp(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: padding.lg,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: hp(2),
    fontSize: fontScale(14),
    color: '#666',
  },
  emptyText: {
    marginTop: hp(3),
    textAlign: 'center',
    color: '#666',
    fontSize: fontScale(14),
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp(3),
    borderWidth: 1,
    borderColor: '#E5E5E5',
    padding: padding.md,
    marginTop: hp(1.5),
  },
  cardTop: {
    flexDirection: 'row',
  },
  cardInfo: {
    flex: 1,
  },
  name: {
    fontSize: fontScale(16),
    fontWeight: '700',
    color: '#111827',
    marginBottom: hp(0.3),
  },
  meta: {
    fontSize: fontScale(12.5),
    color: '#4B5563',
    marginTop: hp(0.2),
  },
  actions: {
    flexDirection: 'row',
    gap: wp(3),
    marginTop: hp(1.5),
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: wp(1.5),
    paddingVertical: hp(1.2),
    borderRadius: wp(2),
  },
  approveBtn: {
    backgroundColor: '#16A34A',
  },
  rejectBtn: {
    backgroundColor: '#DC2626',
  },
  actionText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: fontScale(13.5),
  },
});
