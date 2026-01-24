import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Modal, Pressable, Linking } from 'react-native';
import { Link, router } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';

export default function TemplesScreen() {
  const [menuVisible, setMenuVisible] = useState(false);

  const handleGoogleMaps = (location: string) => {
    const encodedLocation = encodeURIComponent(location);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodedLocation}`).catch((err) => 
      console.error('Failed to open maps:', err)
    );
  };

  const temples = [
    {
      name: 'Shri Mahadev Temple',
      address: 'Main Circle, Thali Village, District - 380001',
      location: 'Main Circle, Thali Village, District - 380001',
    },
    {
      name: 'Hanuman Mandir',
      address: 'Station Road, Near High School, Thali',
      location: 'Station Road, Near High School, Thali',
    },
    {
      name: 'Shakti Mata Temple',
      address: 'Temple Hill, West Thali, District - 380001',
      location: 'Temple Hill, West Thali, District - 380001',
    },
    {
      name: 'Jain Temple (Derasar)',
      address: 'Bazaar Street, Thali Village',
      location: 'Bazaar Street, Thali Village',
    },
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
          <Text style={styles.mainTitle}>Spiritual Places in Thali</Text>
          <Text style={styles.titleDescription}>
            Explore the beautiful and serene temples that form the spiritual heart of our community.
          </Text>
        </View>

        {/* Temples Cards */}
        <View style={styles.templesSection}>
          {temples.map((temple, index) => (
            <View key={index} style={styles.templeCard}>
              <Text style={styles.templeName}>{temple.name}</Text>
              <View style={styles.addressRow}>
                <MaterialIcons name="location-on" size={20} color="#FF8C00" />
                <Text style={styles.addressText}>{temple.address}</Text>
              </View>
              {/* Map Placeholder */}
              <View style={styles.mapContainer}>
                <View style={styles.mapPlaceholder}>
                  <Text style={styles.mapPlaceholderText}>Map View</Text>
                </View>
                <TouchableOpacity 
                  style={styles.googleMapsButton}
                  onPress={() => handleGoogleMaps(temple.location)}>
                  <Text style={styles.googleMapsText}>View on Google Maps</Text>
                  <MaterialIcons name="open-in-new" size={18} color="#1A3A69" />
                </TouchableOpacity>
              </View>
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
                <TouchableOpacity style={styles.menuItemActive} onPress={() => setMenuVisible(false)}>
                  <Text style={styles.menuItemTextActive}>Temples</Text>
                </TouchableOpacity>
              </Link>
              <Link href="/events" asChild>
                <TouchableOpacity style={styles.menuItem} onPress={() => setMenuVisible(false)}>
                  <Text style={styles.menuItemText}>Events</Text>
                </TouchableOpacity>
              </Link>
              <TouchableOpacity style={styles.menuItem} onPress={() => setMenuVisible(false)}>
                <Text style={styles.menuItemText}>Gallery</Text>
              </TouchableOpacity>
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
    fontSize: 32,
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
  templesSection: {
    padding: 20,
    gap: 20,
  },
  templeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  templeName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A3A69',
    marginBottom: 12,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  addressText: {
    fontSize: 15,
    color: '#666666',
    flex: 1,
  },
  mapContainer: {
    position: 'relative',
    marginTop: 8,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  mapPlaceholderText: {
    fontSize: 14,
    color: '#999999',
  },
  googleMapsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1A3A69',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  googleMapsText: {
    fontSize: 16,
    fontWeight: '600',
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
