import { ScrollView, StyleSheet, Text, View, Pressable, Linking } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack } from 'expo-router';
import { AppHeader } from '@/components/app-header';
import { AppFooter } from '@/components/app-footer';
import { wp, hp, fontScale, padding } from '@/utils/responsive';

export default function ContactScreen() {
  const handleContact = (type: string, value: string) => {
    if (type === 'phone') {
      Linking.openURL(`tel:${value}`).catch((err) => console.error('Failed to call:', err));
    } else if (type === 'email') {
      Linking.openURL(`mailto:${value}`).catch((err) => console.error('Failed to email:', err));
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <AppHeader showBack={true} />

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Contact Us</Text>
          <Text style={styles.titleDescription}>
            Have questions or want to volunteer? Reach out to us.
          </Text>
        </View>

        {/* Contact Information Section */}
        <View style={styles.contactInfoSection}>
          <Text style={styles.contactInfoTitle}>Contact Information</Text>
          
          <Pressable onPress={() => handleContact('address', '')} style={styles.contactRow}>
            <MaterialIcons name="location-on" size={24} color="#FFFFFF" />
            <View style={styles.contactDetails}>
              <Text style={styles.contactText}>Thali Yuva Sangh HQ</Text>
              <Text style={styles.contactText}>Near Village Temple, Thali</Text>
              <Text style={styles.contactText}>District, State, India 123456</Text>
            </View>
          </Pressable>

          <Pressable onPress={() => handleContact('phone', '+919876543210')} style={styles.contactRow}>
            <MaterialIcons name="phone" size={24} color="#FFFFFF" />
            <Text style={styles.contactText}>+91 98765 43210</Text>
          </Pressable>

          <Pressable onPress={() => handleContact('email', 'contact@thaliyuvasangh.org')} style={styles.contactRow}>
            <MaterialIcons name="email" size={24} color="#FFFFFF" />
            <Text style={styles.contactText}>contact@thaliyuvasangh.org</Text>
          </Pressable>
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
  contactInfoSection: {
    backgroundColor: '#1A3A69',
    padding: padding.lg,
    marginTop: hp(2.5),
  },
  contactInfoTitle: {
    fontSize: fontScale(24),
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: hp(3),
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: wp(4),
    marginBottom: hp(2.5),
  },
  contactDetails: {
    flex: 1,
  },
  contactText: {
    fontSize: fontScale(16),
    color: '#FFFFFF',
    lineHeight: fontScale(24),
  },
});
