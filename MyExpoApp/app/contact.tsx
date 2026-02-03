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

        {/* Contact Information Section with Cards */}
        <View style={styles.contactInfoSection}>
          <Text style={styles.sectionTitle}>Get In Touch</Text>
          
          {/* Address Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="location-on" size={28} color="#1A3A69" />
              <Text style={styles.cardTitle}>Address</Text>
            </View>
            <Text style={styles.cardText}>Thali Yuva Sangh HQ</Text>
            <Text style={styles.cardText}>Near Village Temple, Thali</Text>
            <Text style={styles.cardText}>District, State, India 123456</Text>
          </View>

          {/* Phone Card */}
          <Pressable 
            onPress={() => handleContact('phone', '+919876543210')} 
            style={styles.card}
          >
            <View style={styles.cardHeader}>
              <MaterialIcons name="phone" size={28} color="#1A3A69" />
              <Text style={styles.cardTitle}>Phone</Text>
            </View>
            <Text style={[styles.cardText, styles.linkText]}>+91 98765 43210</Text>
            <Text style={styles.cardSubtext}>Tap to call</Text>
          </Pressable>

          {/* Email Card */}
          <Pressable 
            onPress={() => handleContact('email', 'contact@thaliyuvasangh.org')} 
            style={styles.card}
          >
            <View style={styles.cardHeader}>
              <MaterialIcons name="email" size={28} color="#1A3A69" />
              <Text style={styles.cardTitle}>Email</Text>
            </View>
            <Text style={[styles.cardText, styles.linkText]}>contact@thaliyuvasangh.org</Text>
            <Text style={styles.cardSubtext}>Tap to send email</Text>
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
    padding: padding.lg,
    marginTop: hp(2),
  },
  sectionTitle: {
    fontSize: fontScale(24),
    fontWeight: '700',
    color: '#1A3A69',
    marginBottom: hp(2.5),
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: padding.lg,
    marginBottom: hp(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1.5),
    gap: wp(3),
  },
  cardTitle: {
    fontSize: fontScale(20),
    fontWeight: '600',
    color: '#1A3A69',
  },
  cardText: {
    fontSize: fontScale(16),
    color: '#333333',
    lineHeight: fontScale(24),
  },
  linkText: {
    color: '#1A3A69',
    fontWeight: '500',
  },
  cardSubtext: {
    fontSize: fontScale(14),
    color: '#999999',
    marginTop: hp(0.5),
    fontStyle: 'italic',
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
