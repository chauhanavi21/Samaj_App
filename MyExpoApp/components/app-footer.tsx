import { StyleSheet, Text, View, Pressable, Linking, Platform } from 'react-native';
import { Link } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { wp, hp, fontScale, padding } from '@/utils/responsive';

export function AppFooter() {
  const handleSocialPress = (url: string) => {
    Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
  };

  const handleContact = (type: string, value: string) => {
    if (type === 'phone') {
      Linking.openURL(`tel:${value}`).catch((err) => console.error('Failed to call:', err));
    } else if (type === 'email') {
      Linking.openURL(`mailto:${value}`).catch((err) => console.error('Failed to email:', err));
    }
  };

  return (
    <View style={styles.footerSection}>
      <Text style={styles.footerTitle}>Thali Yuva Sangh</Text>
      <Text style={styles.footerDescription}>
        Empowering youth, serving the community, and preserving our culture since 2010.
      </Text>

      {/* Social Media Icons */}
      <View style={styles.socialContainer}>
        <Pressable onPress={() => handleSocialPress('https://facebook.com')}>
          <MaterialIcons name="facebook" size={24} color="#FFFFFF" />
        </Pressable>
        <Pressable onPress={() => handleSocialPress('https://instagram.com')}>
          <MaterialIcons name="photo-camera" size={24} color="#FFFFFF" />
        </Pressable>
        <Pressable onPress={() => handleSocialPress('https://twitter.com')}>
          <MaterialIcons name="alternate-email" size={24} color="#FFFFFF" />
        </Pressable>
      </View>

      {/* Quick Links */}
      <Text style={styles.sectionTitle}>Quick Links</Text>
      <View style={styles.quickLinks}>
        <Link href="/about-us" asChild>
          <Pressable>
            <Text style={styles.linkText}>About Us</Text>
          </Pressable>
        </Link>

        {/* Added exactly after About Us */}
        <Link href="/information" asChild>
          <Pressable>
            <Text style={styles.linkText}>Information</Text>
          </Pressable>
        </Link>

        <Link href="/events" asChild>
          <Pressable>
            <Text style={styles.linkText}>Upcoming Events</Text>
          </Pressable>
        </Link>
        <Link href="/gallery" asChild>
          <Pressable>
            <Text style={styles.linkText}>Photo Gallery</Text>
          </Pressable>
        </Link>
        <Link href="/contact" asChild>
          <Pressable>
            <Text style={styles.linkText}>Contact Support</Text>
          </Pressable>
        </Link>
      </View>

      {/* Contact Us */}
      <Text style={styles.sectionTitle}>Contact Us</Text>
      <View style={styles.contactContainer}>
        <Pressable onPress={() => handleContact('address', '')}>
          <View style={styles.contactRow}>
            <MaterialIcons name="location-on" size={20} color="#FF8C00" />
            <Text style={styles.contactText}>
              123 Main Street, Thali Village, District, State, 123456
            </Text>
          </View>
        </Pressable>
        <Pressable onPress={() => handleContact('phone', '+919876543210')}>
          <View style={styles.contactRow}>
            <MaterialIcons name="phone" size={20} color="#FF8C00" />
            <Text style={styles.contactText}>+91 98765 43210</Text>
          </View>
        </Pressable>
        <Pressable onPress={() => handleContact('email', 'contact@thaliyuvasangh.org')}>
          <View style={styles.contactRow}>
            <MaterialIcons name="email" size={20} color="#FF8C00" />
            <Text style={styles.contactText}>contact@thaliyuvasangh.org</Text>
          </View>
        </Pressable>
      </View>

      {/* Copyright */}
      <Text style={styles.copyright}>© 2026 Thali Yuva Sangh. All rights reserved.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footerSection: {
    backgroundColor: '#1A3A69',
    padding: padding.lg,
    paddingBottom: Platform.OS === 'ios' ? hp(6) : padding.lg,
    paddingTop: padding.lg,
  },
  footerTitle: {
    fontSize: fontScale(28),
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: hp(1.5),
  },
  footerDescription: {
    fontSize: fontScale(16),
    color: '#FFFFFF',
    lineHeight: fontScale(24),
    marginBottom: hp(3),
  },
  socialContainer: {
    flexDirection: 'row',
    gap: wp(5),
    marginBottom: hp(4),
  },
  sectionTitle: {
    fontSize: fontScale(22),
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: hp(2),
    marginTop: hp(1),
  },
  quickLinks: {
    gap: hp(1.5),
    marginBottom: hp(3),
  },
  linkText: {
    fontSize: fontScale(16),
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
  contactContainer: {
    gap: hp(2),
    marginBottom: hp(3),
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(3),
  },
  contactText: {
    fontSize: fontScale(16),
    color: '#FFFFFF',
    flex: 1,
    textDecorationLine: 'underline',
  },
  copyright: {
    fontSize: fontScale(14),
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: hp(2),
    opacity: 0.8,
  },
});
