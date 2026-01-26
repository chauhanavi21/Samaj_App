import { ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity, Pressable, Linking, Alert } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack } from 'expo-router';
import { AppHeader } from '@/components/app-header';
import { AppFooter } from '@/components/app-footer';
import { useState } from 'react';
import { wp, hp, fontScale, padding } from '@/utils/responsive';

export default function ContactScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (!firstName || !email || !message) {
      Alert.alert('Missing Fields', 'Please fill in all required fields');
      return;
    }
    
    console.log('Form submitted:', { firstName, lastName, email, message });
    setFirstName('');
    setLastName('');
    setEmail('');
    setMessage('');
    Alert.alert('Success', 'Thank you for your message! We will get back to you soon.');
  };

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

        {/* Contact Form */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Send us a message</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name *</Text>
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
            <Text style={styles.label}>Email *</Text>
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
            <Text style={styles.label}>Message *</Text>
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
  formCard: {
    backgroundColor: '#FFFFFF',
    margin: padding.md,
    padding: padding.lg,
    borderRadius: wp(3),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: wp(2),
    elevation: 3,
  },
  formTitle: {
    fontSize: fontScale(24),
    fontWeight: '700',
    color: '#1A3A69',
    marginBottom: hp(3),
  },
  inputGroup: {
    marginBottom: hp(2.5),
  },
  label: {
    fontSize: fontScale(15),
    fontWeight: '600',
    color: '#333333',
    marginBottom: hp(1),
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: wp(2),
    paddingHorizontal: padding.sm,
    paddingVertical: hp(1.5),
    fontSize: fontScale(16),
    color: '#333333',
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: hp(15),
    paddingTop: hp(1.5),
  },
  submitButton: {
    backgroundColor: '#FF8C00',
    paddingVertical: hp(2),
    paddingHorizontal: padding.lg,
    borderRadius: wp(2),
    alignItems: 'center',
    marginTop: hp(1),
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: fontScale(18),
    fontWeight: '700',
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
