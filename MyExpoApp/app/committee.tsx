import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Linking,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack } from 'expo-router';
import { AppHeader } from '@/components/app-header';
import { AppFooter } from '@/components/app-footer';
import { wp, hp, fontScale, padding } from '@/utils/responsive';
import { contentAPI } from '@/services/api';

export default function CommitteeScreen() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  const handlePhone = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch((err) => console.error('Failed to call:', err));
  };

  const loadMembers = async (nextPage: number, mode: 'replace' | 'append') => {
    try {
      const response = await contentAPI.getCommittee({ page: nextPage, limit: 50 });
      const data = response?.data ?? [];
      const pagination = response?.pagination;

      setMembers((prev) => (mode === 'replace' ? data : [...prev, ...data]));
      setHasNextPage(!!pagination?.hasNextPage);
      setPage(pagination?.page ?? nextPage);
    } catch (err: any) {
      console.error('Load committee error:', err?.response?.data || err?.message || err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMembers(1, 'replace');
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadMembers(1, 'replace');
  };

  const onLoadMore = () => {
    if (!hasNextPage) return;
    loadMembers(page + 1, 'append');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <AppHeader showBack={true} />
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Thali Yuva Sangh Committee (समिति सदस्य)</Text>
          <Text style={styles.titleDescription}>
            Our dedicated team working towards the betterment of Thali.
          </Text>
        </View>

        {/* Committee Members Cards */}
        <View style={styles.membersSection}>
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#1A3A69" />
            </View>
          )}

          {!loading && members.map((member, index) => (
            <View key={member._id || String(index)} style={styles.memberCard}>
              <Text style={styles.memberName}>{member.nameEn} ({member.nameHi})</Text>
              <Pressable onPress={() => handlePhone(member.phone)} style={styles.contactRow}>
                <MaterialIcons name="phone" size={20} color="#FF8C00" />
                <Text style={styles.contactText}>{member.phone}</Text>
              </Pressable>
              <View style={styles.contactRow}>
                <MaterialIcons name="location-on" size={20} color="#666666" />
                <Text style={styles.locationText}>{member.city}</Text>
              </View>
            </View>
          ))}

          {!loading && hasNextPage && (
            <TouchableOpacity onPress={onLoadMore} style={styles.loadMoreButton}>
              <Text style={styles.loadMoreText}>Load more</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Footer */}
        <AppFooter />
      </ScrollView>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 50,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerLogo: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A3A69',
    letterSpacing: 1,
  },
  scrollView: {
    flex: 1,
  },
  titleSection: {
    padding: 32,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: fontScale(32),
    fontWeight: '700',
    color: '#1A3A69',
    marginBottom: 12,
    textAlign: 'center',
  },
  titleDescription: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  membersSection: {
    padding: 20,
    gap: 16,
  },
  loadingContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  memberCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  memberName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A3A69',
    marginBottom: 12,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  contactText: {
    fontSize: 16,
    color: '#FF8C00',
  },
  locationText: {
    fontSize: 16,
    color: '#666666',
  },
  loadMoreButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1A3A69',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  loadMoreText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A3A69',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
  },
  menuContainer: {
    backgroundColor: '#F5F5F0',
    width: '80%',
    height: '100%',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A3A69',
  },
  menuItems: {
    gap: 8,
    marginBottom: 24,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuItemActive: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFF4E6',
    borderRadius: 8,
  },
  menuItemText: {
    fontSize: 18,
    color: '#333333',
  },
  menuItemTextActive: {
    fontSize: 18,
    color: '#1A3A69',
    fontWeight: '600',
  },
  joinUsButton: {
    backgroundColor: '#FF8C00',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 40,
  },
  joinUsText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
