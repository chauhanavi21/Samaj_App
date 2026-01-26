import { ScrollView, StyleSheet, Text, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack } from 'expo-router';
import { AppHeader } from '@/components/app-header';
import { AppFooter } from '@/components/app-footer';
import { wp, hp, fontScale, padding } from '@/utils/responsive';

export default function GalleryScreen() {
  // Placeholder images - in a real app, these would be actual image URIs
  const galleryImages = [
    { id: 1, title: 'Community Gathering', color: '#A1CEDC' },
    { id: 2, title: 'Youth Activities', color: '#FFB800' },
    { id: 3, title: 'Cultural Events', color: '#FF8C00' },
    { id: 4, title: 'Community Service', color: '#1A3A69' },
    { id: 5, title: 'Sports Events', color: '#0084FF' },
    { id: 6, title: 'Festival Celebration', color: '#E6F3FF' },
  ];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <AppHeader showBack={true} />

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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
            <MaterialIcons name="photo-library" size={64} color="#999999" />
            <Text style={styles.heroImageText}>Gallery Image</Text>
          </View>
        </View>

        {/* Gallery Grid */}
        <View style={styles.galleryGrid}>
          {galleryImages.map((image) => (
            <View key={image.id} style={styles.imageCard}>
              <View style={[styles.imagePlaceholder, { backgroundColor: image.color }]}>
                <MaterialIcons name="image" size={32} color="#FFFFFF" />
              </View>
              <Text style={styles.imageTitle}>{image.title}</Text>
            </View>
          ))}
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
  },
  imageTitle: {
    fontSize: fontScale(14),
    fontWeight: '600',
    color: '#1A3A69',
    padding: padding.sm,
    textAlign: 'center',
  },
});
