import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Stack } from 'expo-router';
import { AppHeader } from '@/components/app-header';
import { AppFooter } from '@/components/app-footer';
import { wp, hp, fontScale, padding } from '@/utils/responsive';
import { contentAPI } from '@/services/api';

interface Offer {
  _id: string;
  title: string;
  description: string;
  badgeText: string;
  badgeColor: string;
  validityText: string;
  category: string;
}

export default function OffersScreen() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  const loadOffers = async (nextPage: number, mode: 'replace' | 'append') => {
    try {
      const response = await contentAPI.getOffers({ page: nextPage, limit: 30 });
      const data = (response?.data ?? []) as Offer[];
      const pagination = response?.pagination;

      setOffers((prev) => (mode === 'replace' ? data : [...prev, ...data]));
      setHasNextPage(!!pagination?.hasNextPage);
      setPage(pagination?.page ?? nextPage);
    } catch (err: any) {
      console.error('Load offers error:', err?.response?.data || err?.message || err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadOffers(1, 'replace');
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadOffers(1, 'replace');
  };

  const onLoadMore = () => {
    if (!hasNextPage) return;
    loadOffers(page + 1, 'append');
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
          <Text style={styles.pageTitle}>Special Offers</Text>
          <Text style={styles.pageDescription}>
            Exclusive benefits and discounts for the members of Thali Yuva Sangh.
          </Text>
        </View>

        {/* Offers List */}
        <View style={styles.offersContainer}>
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#1A3A69" />
            </View>
          )}

          {offers.map((offer) => (
            <View key={offer._id} style={styles.offerCard}>
              {/* Badge */}
              <View style={[styles.badge, { backgroundColor: offer.badgeColor }]}>
                <Text style={styles.badgeText}>{offer.badgeText}</Text>
              </View>

              {/* Title */}
              <Text style={styles.offerTitle}>{offer.title}</Text>

              {/* Description */}
              <Text style={styles.offerDescription}>{offer.description}</Text>

              {/* Date */}
              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>📅</Text>
                <Text style={styles.infoText}>{offer.validityText}</Text>
              </View>

              {/* Category */}
              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>🏷️</Text>
                <Text style={styles.infoText}>Category: {offer.category}</Text>
              </View>
            </View>
          ))}

          {!loading && hasNextPage && (
            <TouchableOpacity onPress={onLoadMore} style={styles.loadMoreButton}>
              <Text style={styles.loadMoreText}>Load more</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Footer Note */}
        <View style={styles.footerNote}>
          <Text style={styles.footerText}>
            More exclusive offers coming soon for our members!
          </Text>
        </View>

        {/* App Footer */}
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
    backgroundColor: '#FFF9E6',
  },
  pageTitle: {
    fontSize: fontScale(32),
    fontWeight: '700',
    color: '#1A3A69',
    marginBottom: hp(1.5),
    textAlign: 'center',
  },
  pageDescription: {
    fontSize: fontScale(16),
    color: '#666666',
    textAlign: 'center',
    lineHeight: fontScale(24),
  },
  offersContainer: {
    padding: padding.md,
    gap: hp(2),
  },
  loadingContainer: {
    paddingVertical: hp(3),
    alignItems: 'center',
  },
  offerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp(3),
    padding: padding.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: wp(2),
    elevation: 3,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: padding.md,
    right: padding.md,
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    borderRadius: wp(4),
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: fontScale(14),
    fontWeight: '700',
  },
  offerTitle: {
    fontSize: fontScale(22),
    fontWeight: '700',
    color: '#1A3A69',
    marginBottom: hp(1.5),
    marginRight: wp(20),
  },
  offerDescription: {
    fontSize: fontScale(16),
    color: '#666666',
    lineHeight: fontScale(24),
    marginBottom: hp(2),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  infoIcon: {
    fontSize: fontScale(18),
    marginRight: wp(2),
  },
  infoText: {
    fontSize: fontScale(15),
    color: '#666666',
  },
  footerNote: {
    padding: padding.lg,
    alignItems: 'center',
  },
  footerText: {
    fontSize: fontScale(15),
    color: '#999999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  loadMoreButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1A3A69',
    paddingVertical: hp(1.75),
    borderRadius: wp(2),
    alignItems: 'center',
    marginTop: hp(1),
  },
  loadMoreText: {
    fontSize: fontScale(16),
    fontWeight: '700',
    color: '#1A3A69',
  },
});
