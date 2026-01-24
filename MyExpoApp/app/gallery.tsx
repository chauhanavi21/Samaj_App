import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Modal, Pressable, Image, Dimensions } from 'react-native';
import { Link, router } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';

const { width } = Dimensions.get('window');

export default function GalleryScreen() {
  const [menuVisible, setMenuVisible] = useState(false);

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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#1A3A69" />
        </TouchableOpacity>
        <Text style={styles.headerLogo}>THALI YUVA SANGH</Text>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <MaterialIcons name="menu" size={24} color="#1A3A69" />
        </TouchableOpacity>
      </View>

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
      </ScrollView>

      {/* Navigation Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setMenuVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Menu</Text>
              <TouchableOpacity onPress={() => setMenuVisible(false)}>
                <MaterialIcons name="close" size={24} color="#1A3A69" />
              </TouchableOpacity>
            </View>
            <View style={styles.menuItems}>
              <Link href="/(tabs)" asChild>
                <TouchableOpacity style={styles.menuItem} onPress={() => setMenuVisible(false)}>
                  <Text style={styles.menuItemText}>Home</Text>
                </TouchableOpacity>
              </Link>
              <Link href="/about-us" asChild>
                <TouchableOpacity style={styles.menuItem} onPress={() => setMenuVisible(false)}>
                  <Text style={styles.menuItemText}>About</Text>
                </TouchableOpacity>
              </Link>
              <Link href="/committee" asChild>
                <TouchableOpacity style={styles.menuItem} onPress={() => setMenuVisible(false)}>
                  <Text style={styles.menuItemText}>Committee</Text>
                </TouchableOpacity>
              </Link>
              <Link href="/sponsors" asChild>
                <TouchableOpacity style={styles.menuItem} onPress={() => setMenuVisible(false)}>
                  <Text style={styles.menuItemText}>Sponsors</Text>
                </TouchableOpacity>
              </Link>
              <Link href="/temples" asChild>
                <TouchableOpacity style={styles.menuItem} onPress={() => setMenuVisible(false)}>
                  <Text style={styles.menuItemText}>Temples</Text>
                </TouchableOpacity>
              </Link>
              <Link href="/events" asChild>
                <TouchableOpacity style={styles.menuItem} onPress={() => setMenuVisible(false)}>
                  <Text style={styles.menuItemText}>Events</Text>
                </TouchableOpacity>
              </Link>
              <Link href="/gallery" asChild>
                <TouchableOpacity style={styles.menuItemActive} onPress={() => setMenuVisible(false)}>
                  <Text style={styles.menuItemTextActive}>Gallery</Text>
                </TouchableOpacity>
              </Link>
              <TouchableOpacity style={styles.menuItem} onPress={() => setMenuVisible(false)}>
                <Text style={styles.menuItemText}>Contact</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.joinUsButton}>
              <Text style={styles.joinUsText}>Join Us</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
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
    fontSize: 36,
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
  heroImageContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  heroImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  heroImageText: {
    marginTop: 12,
    fontSize: 14,
    color: '#999999',
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    gap: 12,
  },
  imageCard: {
    width: (width - 52) / 2,
    marginBottom: 12,
  },
  imagePlaceholder: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginTop: 8,
    textAlign: 'center',
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
