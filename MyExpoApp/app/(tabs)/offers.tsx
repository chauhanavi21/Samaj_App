import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { wp, hp, fontScale, padding } from '@/utils/responsive';

interface Offer {
  id: string;
  title: string;
  description: string;
  badge: string;
  badgeColor: string;
  date: string;
  category: string;
}

export default function OffersScreen() {
  const [refreshing, setRefreshing] = React.useState(false);

  const offers: Offer[] = [
    {
      id: '1',
      title: 'Student Stationery Kit',
      description: 'Free stationery kits for school children of Thali village members at the start of the academic year.',
      badge: 'FREE',
      badgeColor: '#FF8C00',
      date: 'June 2026',
      category: 'Education',
    },
    {
      id: '2',
      title: 'Health Checkup Package',
      description: 'Special discounted full-body checkup at City Hospital for Sangh members and their families.',
      badge: '₹999 Only',
      badgeColor: '#FF8C00',
      date: 'Limited Time',
      category: 'Health',
    },
    {
      id: '3',
      title: 'Member Exclusive: Wedding Venue Discount',
      description: 'Get 20% off on booking the community hall for family weddings. Valid for active members only.',
      badge: '20% OFF',
      badgeColor: '#FF8C00',
      date: 'Valid until Dec 2026',
      category: 'Community',
    },
  ];

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Special Offers</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>Special Offers</Text>
          <Text style={styles.pageDescription}>
            Exclusive benefits and discounts for the members of Thali Yuva Sangh.
          </Text>
        </View>

        {/* Offers List */}
        <View style={styles.offersContainer}>
          {offers.map((offer) => (
            <View key={offer.id} style={styles.offerCard}>
              {/* Badge */}
              <View style={[styles.badge, { backgroundColor: offer.badgeColor }]}>
                <Text style={styles.badgeText}>{offer.badge}</Text>
              </View>

              {/* Title */}
              <Text style={styles.offerTitle}>{offer.title}</Text>

              {/* Description */}
              <Text style={styles.offerDescription}>{offer.description}</Text>

              {/* Date */}
              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>📅</Text>
                <Text style={styles.infoText}>{offer.date}</Text>
              </View>

              {/* Category */}
              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>🏷️</Text>
                <Text style={styles.infoText}>Category: {offer.category}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Footer Note */}
        <View style={styles.footerNote}>
          <Text style={styles.footerText}>
            More exclusive offers coming soon for our members!
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F0',
  },
  header: {
    paddingHorizontal: padding.md,
    paddingVertical: hp(2),
    paddingTop: hp(7),
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: fontScale(28),
    fontWeight: 'bold',
    color: '#000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: hp(4),
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
});
