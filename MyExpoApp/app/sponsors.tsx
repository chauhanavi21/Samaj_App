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

export default function SponsorsScreen() {
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  const handlePhone = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch((err) => console.error('Failed to call:', err));
  };

  const loadSponsors = async (nextPage: number, mode: 'replace' | 'append') => {
    try {
      const response = await contentAPI.getSponsors({ page: nextPage, limit: 50 });
      const data = response?.data ?? [];
      const pagination = response?.pagination;

      setSponsors((prev) => (mode === 'replace' ? data : [...prev, ...data]));
      setHasNextPage(!!pagination?.hasNextPage);
      setPage(pagination?.page ?? nextPage);
    } catch (err: any) {
      console.error('Load sponsors error:', err?.response?.data || err?.message || err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSponsors(1, 'replace');
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadSponsors(1, 'replace');
  };

  const onLoadMore = () => {
    if (!hasNextPage) return;
    loadSponsors(page + 1, 'append');
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
          <Text style={styles.mainTitle}>Our Proud Sponsors</Text>
          <Text style={styles.titleDescription}>
            We are deeply grateful for the support of our sponsors who help us make our community initiatives possible.
          </Text>
        </View>

        {/* Sponsors Table */}
        <View style={styles.tableContainer}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <View style={styles.headerCellName}>
              <MaterialIcons name="person" size={20} color="#1A3A69" />
              <Text style={styles.headerText} numberOfLines={1}>Sponsor Name</Text>
            </View>
            <View style={styles.headerCellAmount}>
              <Text style={styles.rupeeSymbol}>₹</Text>
              <Text style={styles.headerText}>Amount</Text>
            </View>
            <View style={styles.headerCellPhone}>
              <MaterialIcons name="phone" size={20} color="#1A3A69" />
              <Text style={styles.headerText} numberOfLines={1}>Phone</Text>
            </View>
          </View>

          {/* Table Rows */}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#1A3A69" />
            </View>
          )}

          {!loading && sponsors.map((sponsor, index) => (
            <View key={sponsor._id || String(index)} style={styles.tableRow}>
              <View style={styles.tableCellName}>
                <Text style={styles.sponsorName} numberOfLines={2}>{sponsor.name}</Text>
              </View>
              <View style={styles.tableCellAmount}>
                <Text style={styles.amount} numberOfLines={1} adjustsFontSizeToFit>{sponsor.amount}</Text>
              </View>
              <View style={styles.tableCellPhone}>
                <Pressable onPress={() => handlePhone(sponsor.phone)}>
                  <Text style={styles.phoneNumber} numberOfLines={1}>{sponsor.phone}</Text>
                </Pressable>
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
  scrollView: {
    flex: 1,
  },
  titleSection: {
    padding: padding.lg,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: fontScale(32),
    fontWeight: '700',
    color: '#1A3A69',
    marginBottom: hp(1.5),
    textAlign: 'center',
  },
  titleDescription: {
    fontSize: fontScale(16),
    color: '#666666',
    textAlign: 'center',
    lineHeight: fontScale(24),
  },
  tableContainer: {
    margin: padding.md,
    backgroundColor: '#FFFFFF',
    borderRadius: wp(3),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: wp(2),
    elevation: 3,
  },
  loadingContainer: {
    paddingVertical: hp(3),
    alignItems: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    paddingVertical: hp(2),
    paddingHorizontal: padding.sm,
    borderBottomWidth: 2,
    borderBottomColor: '#E0E0E0',
  },
  headerCellName: {
    flex: 2.5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1.5),
    paddingRight: wp(2),
  },
  headerCellAmount: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
    paddingHorizontal: wp(1),
  },
  headerCellPhone: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1.5),
    paddingLeft: wp(1),
  },
  headerText: {
    fontSize: fontScale(14),
    fontWeight: '700',
    color: '#1A3A69',
    flexShrink: 1,
  },
  rupeeSymbol: {
    fontSize: fontScale(18),
    fontWeight: '700',
    color: '#1A3A69',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: hp(2),
    paddingHorizontal: padding.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    alignItems: 'center',
  },
  tableCellName: {
    flex: 2.5,
    justifyContent: 'center',
    paddingRight: wp(2),
  },
  tableCellAmount: {
    flex: 1.5,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: wp(1),
  },
  tableCellPhone: {
    flex: 2,
    justifyContent: 'center',
    paddingLeft: wp(1),
  },
  sponsorName: {
    fontSize: fontScale(15),
    fontWeight: '600',
    color: '#333333',
    flexShrink: 1,
  },
  amount: {
    fontSize: fontScale(15),
    fontWeight: '600',
    color: '#FF8C00',
    flexWrap: 'wrap',
  },
  phoneNumber: {
    fontSize: fontScale(14),
    color: '#666666',
    textDecorationLine: 'underline',
    flexShrink: 1,
  },
  loadMoreButton: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingVertical: hp(2),
    alignItems: 'center',
  },
  loadMoreText: {
    fontSize: fontScale(15),
    fontWeight: '700',
    color: '#1A3A69',
  },
});
