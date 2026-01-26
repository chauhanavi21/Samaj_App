import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Linking } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack } from 'expo-router';
import { AppHeader } from '@/components/app-header';
import { AppFooter } from '@/components/app-footer';
import { wp, hp, fontScale, padding } from '@/utils/responsive';

export default function EventsScreen() {

  const events = [
    {
      category: 'SPORTS',
      title: 'Annual Sports Meet 2026',
      date: 'March 15, 2026',
      time: '8:00 AM - 5:00 PM',
      location: 'Thali High School Ground',
      description: 'Join us for a day of competitive sports, team spirit, and fun. Cricket, Volleyball, and Athletics competitions.',
    },
    {
      category: 'HEALTH',
      title: 'Blood Donation Camp',
      date: 'April 02, 2026',
      time: '9:00 AM - 2:00 PM',
      location: 'Community Hall, Thali',
      description: 'Be a hero, save a life. Our annual blood donation drive in partnership with District Hospital.',
    },
    {
      category: 'CULTURE',
      title: "Cultural Night 'Utsav'",
      date: 'May 20, 2026',
      time: '6:00 PM onwards',
      location: 'Village Square',
      description: 'An evening of dance, music, and drama showcasing our local talent and rich traditions.',
    },
  ];

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
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <Text style={styles.heroTitle}>Upcoming Events</Text>
          <Text style={styles.heroDescription}>
            Mark your calendars! Join us in our upcoming activities and be part of the change.
          </Text>
        </View>

        {/* Events Cards */}
        <View style={styles.eventsSection}>
          {events.map((event, index) => (
            <View key={index} style={styles.eventCard}>
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
              <TouchableOpacity style={styles.registerButton}>
                <Text style={styles.registerButtonText}>Register Now</Text>
              </TouchableOpacity>
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
    marginBottom: hp(2.5),
  },
  registerButton: {
    backgroundColor: '#1A3A69',
    paddingVertical: hp(1.75),
    paddingHorizontal: padding.lg,
    borderRadius: wp(2),
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: fontScale(16),
    fontWeight: '700',
  },
});
