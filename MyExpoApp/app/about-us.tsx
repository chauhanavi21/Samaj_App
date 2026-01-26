import { ScrollView, StyleSheet, Text, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack } from 'expo-router';
import { AppHeader } from '@/components/app-header';
import { AppFooter } from '@/components/app-footer';
import { wp, hp, fontScale, padding } from '@/utils/responsive';

export default function AboutUsScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <AppHeader showBack={true} />

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* About Us Title */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>About Us</Text>
          <Text style={styles.titleDescription}>
            Get to know the history, mission, and the people behind Thali Yuva Sangh.
          </Text>
        </View>

        {/* Our Mission Section */}
        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <Text style={styles.missionText}>
            Thali Yuva Sangh was established with a vision to unite the youth of our village and channel their energy towards constructive social development. We believe that empowered youth builds a resilient community.
          </Text>
          <Text style={styles.missionText}>
            Since our inception, we have been at the forefront of social initiatives, education support, and cultural preservation in the Thali region.
          </Text>
        </View>

        {/* Key Objectives */}
        <View style={styles.objectivesSection}>
          <View style={styles.objectiveItem}>
            <View style={styles.checkIcon}>
              <MaterialIcons name="check" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.objectiveText}>Promote Education & Sports</Text>
          </View>
          <View style={styles.objectiveItem}>
            <View style={styles.checkIcon}>
              <MaterialIcons name="check" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.objectiveText}>Community Health & Hygiene</Text>
          </View>
          <View style={styles.objectiveItem}>
            <View style={styles.checkIcon}>
              <MaterialIcons name="check" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.objectiveText}>Cultural Preservation</Text>
          </View>
        </View>

        {/* Logo Card */}
        <View style={styles.logoCard}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <View style={styles.logoHalfBlue} />
              <View style={styles.logoHalfOrange} />
              <Text style={styles.logoTextTop}>THALI</Text>
              <Text style={styles.logoTextBottom}>YUVA SANGH</Text>
            </View>
          </View>
          <Text style={styles.logoCardText}>THALI YUVA SANGH</Text>
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
    fontSize: fontScale(32),
    fontWeight: '700',
    color: '#1A3A69',
    marginBottom: 12,
  },
  titleDescription: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  contentSection: {
    padding: 32,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A3A69',
    marginBottom: 16,
  },
  missionText: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
    marginBottom: 16,
  },
  objectivesSection: {
    padding: 32,
    paddingTop: 0,
    gap: 16,
  },
  objectiveItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF8C00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  objectiveText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  logoCard: {
    backgroundColor: '#FFFFFF',
    margin: 32,
    marginTop: 16,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoHalfBlue: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '50%',
    height: '100%',
    backgroundColor: '#1A3A69',
  },
  logoHalfOrange: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: '50%',
    height: '100%',
    backgroundColor: '#FF8C00',
  },
  logoTextTop: {
    position: 'absolute',
    top: 20,
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
    zIndex: 1,
  },
  logoTextBottom: {
    position: 'absolute',
    bottom: 20,
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
    zIndex: 1,
  },
  logoCardText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF8C00',
    letterSpacing: 1,
  },
});
