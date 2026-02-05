import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack } from 'expo-router';
import { AppHeader } from '@/components/app-header';
import { AppFooter } from '@/components/app-footer';
import { wp, hp, fontScale, padding } from '@/utils/responsive';
import { contentAPI } from '@/services/api';

export default function TemplesScreen() {
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  const handleGoogleMaps = (place: any) => {
    const directLink = String(place?.googleMapsLink || '').trim();
    if (directLink) {
      Linking.openURL(directLink).catch((err) => console.error('Failed to open maps:', err));
      return;
    }

    const location = String(place?.address || '').trim();
    const encodedLocation = encodeURIComponent(location);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodedLocation}`).catch((err) =>
      console.error('Failed to open maps:', err)
    );
  };

  const loadPlaces = async (nextPage: number, mode: 'replace' | 'append') => {
    try {
      const response = await contentAPI.getPlaces({ page: nextPage, limit: 30 });
      const data = response?.data ?? [];
      const pagination = response?.pagination;

      setPlaces((prev) => (mode === 'replace' ? data : [...prev, ...data]));
      setHasNextPage(!!pagination?.hasNextPage);
      setPage(pagination?.page ?? nextPage);
    } catch (err: any) {
      console.error('Load places error:', err?.response?.data || err?.message || err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPlaces(1, 'replace');
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadPlaces(1, 'replace');
  };

  const onLoadMore = () => {
    if (!hasNextPage) return;
    loadPlaces(page + 1, 'append');
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
          <Text style={styles.mainTitle}>Spiritual Places in Thali</Text>
          <Text style={styles.titleDescription}>
            Explore the beautiful and serene temples that form the spiritual heart of our community.
          </Text>
        </View>

        {/* Temples Cards */}
        <View style={styles.templesSection}>
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#1A3A69" />
            </View>
          )}

          {!loading && places.map((place, index) => (
            <View key={place._id || String(index)} style={styles.templeCard}>
              <Text style={styles.templeName}>{place.name}</Text>
              <View style={styles.addressRow}>
                <MaterialIcons name="location-on" size={20} color="#FF8C00" />
                <Text style={styles.addressText}>{place.address}</Text>
              </View>
              {/* Map Placeholder */}
              <View style={styles.mapContainer}>
                <View style={styles.mapPlaceholder}>
                  <Text style={styles.mapPlaceholderText}>Map View</Text>
                </View>
                <TouchableOpacity 
                  style={styles.googleMapsButton}
                  onPress={() => handleGoogleMaps(place)}>
                  <Text style={styles.googleMapsText}>View on Google Maps</Text>
                  <MaterialIcons name="open-in-new" size={18} color="#1A3A69" />
                </TouchableOpacity>
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
  templesSection: {
    padding: padding.md,
    gap: hp(2.5),
  },
  loadingContainer: {
    paddingVertical: hp(3),
    alignItems: 'center',
  },
  templeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp(3),
    padding: padding.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: wp(2),
    elevation: 3,
  },
  templeName: {
    fontSize: fontScale(24),
    fontWeight: '700',
    color: '#1A3A69',
    marginBottom: hp(1.5),
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
    marginBottom: hp(2),
  },
  addressText: {
    fontSize: fontScale(15),
    color: '#666666',
    flex: 1,
    lineHeight: fontScale(22),
  },
  mapContainer: {
    marginTop: hp(1),
  },
  mapPlaceholder: {
    height: hp(25),
    backgroundColor: '#E0E0E0',
    borderRadius: wp(2),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(1.5),
  },
  mapPlaceholderText: {
    fontSize: fontScale(14),
    color: '#999999',
  },
  googleMapsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1A3A69',
    paddingVertical: hp(1.5),
    paddingHorizontal: padding.md,
    borderRadius: wp(2),
    gap: wp(2),
  },
  googleMapsText: {
    fontSize: fontScale(16),
    fontWeight: '600',
    color: '#1A3A69',
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
