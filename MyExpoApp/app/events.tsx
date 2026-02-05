import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
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

export default function EventsScreen() {

  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  const loadEvents = async (nextPage: number, mode: 'replace' | 'append') => {
    try {
      const response = await contentAPI.getEvents({ page: nextPage, limit: 30 });
      const data = response?.data ?? [];
      const pagination = response?.pagination;

      setEvents((prev) => (mode === 'replace' ? data : [...prev, ...data]));
      setHasNextPage(!!pagination?.hasNextPage);
      setPage(pagination?.page ?? nextPage);
    } catch (err: any) {
      console.error('Load events error:', err?.response?.data || err?.message || err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadEvents(1, 'replace');
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadEvents(1, 'replace');
  };

  const onLoadMore = () => {
    if (!hasNextPage) return;
    loadEvents(page + 1, 'append');
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'SPORTS':
        return '#FF8C00';
      case 'HEALTH':
        return '#FF8C00';
      case 'CULTURE':
        return '#FF8C00';
      default:
        return '#FF8C00';
    }
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
        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <Text style={styles.heroTitle}>Upcoming Events</Text>
          <Text style={styles.heroDescription}>
            Mark your calendars! Join us in our upcoming activities and be part of the change.
          </Text>
        </View>

        {/* Events Cards */}
        <View style={styles.eventsSection}>
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#1A3A69" />
            </View>
          )}

          {!loading && events.map((event, index) => (
            <View key={event._id || String(index)} style={styles.eventCard}>
              <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(event.category) }]}>
                <Text style={styles.categoryText}>{event.category}</Text>
              </View>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <View style={styles.eventDetails}>
                <View style={styles.detailRow}>
                  <MaterialIcons name="event" size={18} color="#666666" />
                  <Text style={styles.detailText}>{event.date}</Text>
                </View>
                <View style={styles.detailRow}>
                  <MaterialIcons name="access-time" size={18} color="#666666" />
                  <Text style={styles.detailText}>{event.time}</Text>
                </View>
                <View style={styles.detailRow}>
                  <MaterialIcons name="location-on" size={18} color="#666666" />
                  <Text style={styles.detailText}>{event.location}</Text>
                </View>
              </View>
              <Text style={styles.eventDescription}>{event.description}</Text>
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
  heroBanner: {
    backgroundColor: '#1A3A69',
    padding: padding.lg,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: fontScale(36),
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: hp(1.5),
    textAlign: 'center',
  },
  heroDescription: {
    fontSize: fontScale(16),
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: fontScale(24),
  },
  eventsSection: {
    padding: padding.md,
    gap: hp(2.5),
  },
  loadingContainer: {
    paddingVertical: hp(3),
    alignItems: 'center',
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp(3),
    padding: padding.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: wp(2),
    elevation: 3,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: padding.sm,
    paddingVertical: hp(0.75),
    borderRadius: wp(5),
    marginBottom: hp(1.5),
  },
  categoryText: {
    fontSize: fontScale(12),
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  eventTitle: {
    fontSize: fontScale(24),
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: hp(2),
  },
  eventDetails: {
    gap: hp(1.25),
    marginBottom: hp(2),
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
  },
  detailText: {
    fontSize: fontScale(15),
    color: '#666666',
  },
  eventDescription: {
    fontSize: fontScale(16),
    color: '#666666',
    lineHeight: fontScale(24),
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
