import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { AppHeader } from '@/components/app-header';
import { AppFooter } from '@/components/app-footer';
import { Link, useRouter } from 'expo-router';
import { wp, hp, fontScale, padding } from '@/utils/responsive';
import { useAuth } from '@/contexts/AuthContext';

export default function HomeScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  return (
    <View style={styles.container}>
      <AppHeader showBack={false} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.heroContent}>
          <View style={styles.orangeBadge}>
            <Text style={styles.badgeText}>Est. 2010 • Community First</Text>
          </View>
          <Text style={styles.heroTitle}>Thali Yuva Sangh</Text>
          <Text style={styles.heroDescription}>
            Uniting the youth of Thali to build a stronger, more vibrant community through service, culture, and celebration.
          </Text>
          <Link href="/contact" asChild>
            <TouchableOpacity style={styles.joinMissionButton}>
              <Text style={styles.joinMissionText}>Join Our Mission</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/about-us" asChild>
            <TouchableOpacity style={styles.learnMoreButton}>
              <Text style={styles.learnMoreText}>Learn More</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      {/* Feature Cards Section */}
      <View style={styles.featuresSection}>
        {/* Youth Empowerment Card */}
        <View style={styles.featureCard}>
          <View style={[styles.iconContainer, { backgroundColor: '#FFF4E6' }]}>
            <IconSymbol name="person.2.fill" size={32} color="#FF8C00" />
          </View>
          <Text style={styles.featureTitle}>Youth Empowerment</Text>
          <Text style={styles.featureDescription}>
            Providing platforms for young minds to lead, innovate, and contribute to social development.
          </Text>
        </View>

        {/* Community Service Card */}
        <View style={styles.featureCard}>
          <View style={[styles.iconContainer, { backgroundColor: '#E6F3FF' }]}>
            <IconSymbol name="heart.fill" size={32} color="#0084FF" />
          </View>
          <Text style={styles.featureTitle}>Community Service</Text>
          <Text style={styles.featureDescription}>
            Organizing blood donation camps, cleanliness drives, and educational support programs.
          </Text>
        </View>

        {/* Cultural Events Card */}
        <View style={styles.featureCard}>
          <View style={[styles.iconContainer, { backgroundColor: '#FFFBE6' }]}>
            <IconSymbol name="calendar" size={32} color="#FFB800" />
          </View>
          <Text style={styles.featureTitle}>Cultural Events</Text>
          <Text style={styles.featureDescription}>
            Celebrating our rich heritage through festivals, sports meets, and cultural gatherings.
          </Text>
        </View>
      </View>

      {/* Call to Action Section */}
      <View style={styles.ctaSection}>
        <Text style={styles.ctaTitle}>Ready to make a difference?</Text>
        <Text style={styles.ctaDescription}>
          Join hundreds of active members in Thali who are working towards a better tomorrow.
        </Text>
        <TouchableOpacity 
          style={styles.becomeMemberButton}
          onPress={() => {
            if (isAuthenticated) {
              Alert.alert(
                'Already a Member',
                'You are already a member of Thali Yuva Sangh!',
                [{ text: 'OK' }]
              );
            } else {
              router.push('/signup');
            }
          }}>
          <Text style={styles.becomeMemberText}>Become a Member</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#1A3A69" />
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <AppFooter />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  heroSection: {
    minHeight: hp(60),
    backgroundColor: '#1A3A69',
    paddingTop: hp(5),
    paddingBottom: hp(5),
    paddingHorizontal: padding.md,
    position: 'relative',
    overflow: 'hidden',
  },
  heroContent: {
    alignItems: 'center',
    zIndex: 1,
  },
  orangeBadge: {
    backgroundColor: '#FF8C00',
    paddingHorizontal: padding.md,
    paddingVertical: hp(1),
    borderRadius: wp(5),
    marginBottom: hp(2.5),
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: fontScale(14),
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: fontScale(42),
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: hp(2),
    letterSpacing: 0.5,
    width: '100%',
    alignSelf: 'center',
  },
  heroDescription: {
    fontSize: fontScale(18),
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: fontScale(26),
    marginBottom: hp(4),
    paddingHorizontal: padding.sm,
  },
  joinMissionButton: {
    backgroundColor: '#FF8C00',
    paddingVertical: hp(2),
    paddingHorizontal: padding.lg,
    borderRadius: wp(2),
    marginBottom: hp(1.5),
    minWidth: wp(50),
    alignItems: 'center',
  },
  joinMissionText: {
    color: '#FFFFFF',
    fontSize: fontScale(18),
    fontWeight: '700',
  },
  learnMoreButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: hp(2),
    paddingHorizontal: padding.lg,
    borderRadius: wp(2),
    minWidth: wp(50),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  learnMoreText: {
    color: '#FFFFFF',
    fontSize: fontScale(18),
    fontWeight: '600',
  },
  featuresSection: {
    padding: padding.md,
    gap: hp(2),
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp(3),
    padding: padding.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: wp(2),
    elevation: 3,
  },
  iconContainer: {
    width: wp(16),
    height: wp(16),
    borderRadius: wp(3),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  featureTitle: {
    fontSize: fontScale(22),
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: hp(1),
  },
  featureDescription: {
    fontSize: fontScale(16),
    color: '#666666',
    lineHeight: fontScale(24),
  },
  ctaSection: {
    backgroundColor: '#1A3A69',
    padding: padding.lg,
    alignItems: 'center',
    marginHorizontal: padding.md,
    marginVertical: hp(2.5),
    borderRadius: wp(3),
  },
  ctaTitle: {
    fontSize: fontScale(32),
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: hp(1.5),
  },
  ctaDescription: {
    fontSize: fontScale(16),
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: fontScale(24),
    marginBottom: hp(3),
  },
  becomeMemberButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: hp(2),
    paddingHorizontal: padding.lg,
    borderRadius: wp(2),
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: wp(1),
    elevation: 3,
  },
  becomeMemberText: {
    color: '#1A3A69',
    fontSize: fontScale(18),
    fontWeight: '700',
  },
});
