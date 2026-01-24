import { ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity, Modal, Pressable, Linking } from 'react-native';
import { Link, router } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';

export default function ContactScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    // Handle form submission here
    console.log('Form submitted:', { firstName, lastName, email, message });
    // Reset form
    setFirstName('');
    setLastName('');
    setEmail('');
    setMessage('');
    alert('Thank you for your message! We will get back to you soon.');
  };

  const handleContact = (type: string, value: string) => {
    if (type === 'phone') {
      Linking.openURL(`tel:${value}`).catch((err) => console.error('Failed to call:', err));
    } else if (type === 'email') {
      Linking.openURL(`mailto:${value}`).catch((err) => console.error('Failed to email:', err));
    }
  };

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
          <Text style={styles.mainTitle}>Contact Us</Text>
          <Text style={styles.titleDescription}>
            Have questions or want to volunteer? Reach out to us.
          </Text>
        </View>

        {/* Contact Form */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Send us a message</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder="John"
              value={firstName}
              onChangeText={setFirstName}
              placeholderTextColor="#999999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Doe"
              value={lastName}
              onChangeText={setLastName}
              placeholderTextColor="#999999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="john@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#999999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Message</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Tell us how you'd like to help..."
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              placeholderTextColor="#999999"
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Send Message</Text>
          </TouchableOpacity>
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
                <TouchableOpacity style={styles.menuItem} onPress={() => setMenuVisible(false)}>
                  <Text style={styles.menuItemText}>Gallery</Text>
                </TouchableOpacity>
              </Link>
              <Link href="/contact" asChild>
                <TouchableOpacity style={styles.menuItemActive} onPress={() => setMenuVisible(false)}>
                  <Text style={styles.menuItemTextActive}>Contact</Text>
                </TouchableOpacity>
              </Link>
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
  formCard: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A3A69',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333333',
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 120,
    paddingTop: 12,
  },
  submitButton: {
    backgroundColor: '#FF8C00',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  contactInfoSection: {
    backgroundColor: '#1A3A69',
    padding: 32,
    marginTop: 20,
  },
  contactInfoTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 20,
  },
  contactDetails: {
    flex: 1,
  },
  contactText: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
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
