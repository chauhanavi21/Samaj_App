import { ScrollView, StyleSheet, Text, View, Pressable, Linking } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack } from 'expo-router';
import { AppHeader } from '@/components/app-header';
import { AppFooter } from '@/components/app-footer';
import { wp, hp, fontScale, padding } from '@/utils/responsive';

export default function CommitteeScreen() {

  const handlePhone = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch((err) => console.error('Failed to call:', err));
  };

  const committeeMembers = [
    { name: 'Rahul Sharma', nameHindi: 'राहुल शर्मा', phone: '+91 98765 43210', location: 'Ahmedabad' },
    { name: 'Amit Patel', nameHindi: 'अमित पटेल', phone: '+91 98765 43211', location: 'Ahmedabad' },
    { name: 'Suresh Meena', nameHindi: 'सुरेश मीणा', phone: '+91 98765 43212', location: 'Ahmedabad' },
    { name: 'Vijay Singh', nameHindi: 'विजय सिंह', phone: '+91 98765 43213', location: 'Ahmedabad' },
    { name: 'Deepak Vyas', nameHindi: 'दीपक व्यास', phone: '+91 98765 43214', location: 'Ahmedabad' },
    { name: 'Manoj Kumar', nameHindi: 'मनोज कुमार', phone: '+91 98765 43215', location: 'Ahmedabad' },
  ];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <AppHeader showBack={true} />
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Thali Yuva Sangh Committee (समिति सदस्य)</Text>
          <Text style={styles.titleDescription}>
            Our dedicated team working towards the betterment of Thali.
          </Text>
        </View>

        {/* Committee Members Cards */}
        <View style={styles.membersSection}>
          {committeeMembers.map((member, index) => (
            <View key={index} style={styles.memberCard}>
              <Text style={styles.memberName}>{member.name} ({member.nameHindi})</Text>
              <Pressable onPress={() => handlePhone(member.phone)} style={styles.contactRow}>
                <MaterialIcons name="phone" size={20} color="#FF8C00" />
                <Text style={styles.contactText}>{member.phone}</Text>
              </Pressable>
              <View style={styles.contactRow}>
                <MaterialIcons name="location-on" size={20} color="#666666" />
                <Text style={styles.locationText}>{member.location}</Text>
              </View>
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
    textAlign: 'center',
  },
  titleDescription: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  membersSection: {
    padding: 20,
    gap: 16,
  },
  memberCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  memberName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A3A69',
    marginBottom: 12,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  contactText: {
    fontSize: 16,
    color: '#FF8C00',
  },
  locationText: {
    fontSize: 16,
    color: '#666666',
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
