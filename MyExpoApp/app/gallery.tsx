import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, ActivityIndicator, RefreshControl } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack } from 'expo-router';
import { AppHeader } from '@/components/app-header';
import { AppFooter } from '@/components/app-footer';
import { wp, hp, fontScale, padding } from '@/utils/responsive';
import { API_BASE_URL } from '@/config/api';
import { contentAPI } from '@/services/api';

type GalleryItem = {
  id?: string;
  _id?: string;
  title?: string;
  imageUrl?: string;
  order?: number;
  isActive?: boolean;
};

function getApiOrigin() {
  return API_BASE_URL.replace(/\/api\/?$/, '');
}

function toAbsoluteUrl(imageUrl: string) {
  const trimmed = String(imageUrl || '').trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const origin = getApiOrigin();
  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${origin}${path}`;
}

export default function GalleryScreen() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async (mode: 'initial' | 'refresh') => {
    try {
      if (mode === 'initial') setLoading(true);
      const response = await contentAPI.getGallery({ page: 1, limit: 200 });
      setItems(response?.data ?? []);
    } catch (err: any) {
      console.error('Load gallery error:', err?.response?.data || err?.message || err);
      setItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load('initial');
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    load('refresh');
  };

  const hero = items[0];
  const grid = useMemo(() => items.slice(hero ? 1 : 0), [items]);
  const heroUrl = hero?.imageUrl ? toAbsoluteUrl(hero.imageUrl) : '';

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
          <Text style={styles.mainTitle}>Our Gallery</Text>
          <Text style={styles.titleDescription}>
            Moments captured from our journey of service and celebration.
          </Text>
        </View>

        {/* Hero Image Placeholder */}
        <View style={styles.heroImageContainer}>
          <View style={[styles.heroImage, { backgroundColor: '#D0D0D0' }]}>
            {!!heroUrl && (
              <ExpoImage
                source={{ uri: heroUrl }}
                style={StyleSheet.absoluteFillObject}
                contentFit="cover"
              />
            )}
            {!heroUrl && (
              <>
                <MaterialIcons name="photo-library" size={64} color="#999999" />
                <Text style={styles.heroImageText}>{loading ? 'Loading...' : 'No images yet'}</Text>
              </>
            )}
          </View>
        </View>

        {/* Gallery Grid */}
        <View style={styles.galleryGrid}>
          {loading && (
            <View style={styles.loadingInline}>
              <ActivityIndicator size="small" color="#1A3A69" />
              <Text style={styles.loadingInlineText}>Loading gallery...</Text>
            </View>
          )}

          {!loading && grid.length === 0 && !heroUrl && (
            <Text style={styles.emptyText}>No gallery images available.</Text>
          )}

          {grid.map((image, idx) => {
            const key = (image.id || image._id || String(idx)).toString();
            const imageUri = image.imageUrl ? toAbsoluteUrl(image.imageUrl) : '';
            const title = String(image.title || '').trim();

            return (
              <View key={key} style={styles.imageCard}>
                <View style={[styles.imagePlaceholder, { backgroundColor: '#D0D0D0' }]}>
                  {!!imageUri && (
                    <ExpoImage
                      source={{ uri: imageUri }}
                      style={StyleSheet.absoluteFillObject}
                      contentFit="cover"
                    />
                  )}
                  {!imageUri && <MaterialIcons name="image" size={32} color="#FFFFFF" />}
                </View>
                {!!title && <Text style={styles.imageTitle}>{title}</Text>}
              </View>
            );
          })}
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
  heroImageContainer: {
    paddingHorizontal: padding.md,
    marginBottom: hp(3),
  },
  heroImage: {
    height: hp(30),
    borderRadius: wp(3),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  heroImageText: {
    fontSize: fontScale(18),
    color: '#999999',
    marginTop: hp(1),
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: padding.sm,
    gap: padding.sm,
    marginBottom: hp(3),
  },
  loadingInline: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: padding.sm,
    paddingVertical: padding.md,
  },
  loadingInlineText: {
    fontSize: fontScale(14),
    color: '#666666',
  },
  emptyText: {
    width: '100%',
    textAlign: 'center',
    color: '#666666',
    paddingVertical: padding.md,
  },
  imageCard: {
    width: (wp(100) - padding.sm * 3) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: wp(2),
    overflow: 'hidden',
    marginBottom: padding.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: wp(1),
    elevation: 2,
  },
  imagePlaceholder: {
    height: hp(20),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  imageTitle: {
    fontSize: fontScale(14),
    fontWeight: '600',
    color: '#1A3A69',
    padding: padding.sm,
    textAlign: 'center',
  },
});
