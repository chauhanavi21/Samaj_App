import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { familyTreeAPI } from '@/services/api';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface Child {
  name: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
}

export default function EditFamilyTreeScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [personName, setPersonName] = useState('');
  const [personPhone, setPersonPhone] = useState('');
  const [personOccupation, setPersonOccupation] = useState('');
  const [spouseName, setSpouseName] = useState('');
  const [spousePhone, setSpousePhone] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [fatherPhone, setFatherPhone] = useState('');
  const [motherName, setMotherName] = useState('');
  const [motherPhone, setMotherPhone] = useState('');
  const [children, setChildren] = useState<Child[]>([]);
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchEntry();
  }, [id]);

  const fetchEntry = async () => {
    try {
      const response = await familyTreeAPI.getById(id as string);
      if (response.success) {
        const data = response.data;
        setPersonName(data.personName || '');
        setPersonPhone(data.personPhone || '');
        setPersonOccupation(data.personOccupation || '');
        setSpouseName(data.spouseName || '');
        setSpousePhone(data.spousePhone || '');
        setFatherName(data.fatherName || '');
        setFatherPhone(data.fatherPhone || '');
        setMotherName(data.motherName || '');
        setMotherPhone(data.motherPhone || '');
        setChildren(data.children || []);
        setAddress(data.address || '');
        setNotes(data.notes || '');
      }
    } catch (error: any) {
      console.error('Fetch error:', error);
      Alert.alert('Error', 'Failed to load entry', [
        { text: 'Go Back', onPress: () => router.back() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const addChild = () => {
    setChildren([...children, { name: '', gender: undefined }]);
  };

  const removeChild = (index: number) => {
    setChildren(children.filter((_, i) => i !== index));
  };

  const updateChild = (index: number, field: string, value: string) => {
    const updated = [...children];
    updated[index] = { ...updated[index], [field]: value };
    setChildren(updated);
  };

  const handleSubmit = async () => {
    if (!personName.trim()) {
      Alert.alert('Validation Error', 'Person name is required');
      return;
    }

    setSaving(true);

    try {
      const data = {
        personName: personName.trim(),
        personPhone: personPhone.trim(),
        personOccupation: personOccupation.trim(),
        spouseName: spouseName.trim(),
        spousePhone: spousePhone.trim(),
        fatherName: fatherName.trim(),
        fatherPhone: fatherPhone.trim(),
        motherName: motherName.trim(),
        motherPhone: motherPhone.trim(),
        children: children.filter(c => c.name.trim() !== ''),
        address: address.trim(),
        notes: notes.trim(),
      };

      const response = await familyTreeAPI.update(id as string, data);
      
      if (response.success) {
        Alert.alert('Success', 'Family tree entry updated successfully', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      }
    } catch (error: any) {
      console.error('Update error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to update entry'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading entry...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color="#007AFF" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Family Entry</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Person Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 Person Information</Text>
          
          <Text style={styles.label}>Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter person's name"
            value={personName}
            onChangeText={setPersonName}
          />

          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter phone number"
            value={personPhone}
            onChangeText={setPersonPhone}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Occupation</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter occupation"
            value={personOccupation}
            onChangeText={setPersonOccupation}
          />
        </View>

        {/* Spouse Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💑 Spouse Information</Text>
          
          <Text style={styles.label}>Spouse Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter spouse's name"
            value={spouseName}
            onChangeText={setSpouseName}
          />

          <Text style={styles.label}>Spouse Phone</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter spouse's phone"
            value={spousePhone}
            onChangeText={setSpousePhone}
            keyboardType="phone-pad"
          />
        </View>

        {/* Parents Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👨‍👩‍👦 Parents Information</Text>
          
          <Text style={styles.label}>Father's Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter father's name"
            value={fatherName}
            onChangeText={setFatherName}
          />

          <Text style={styles.label}>Father's Phone</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter father's phone"
            value={fatherPhone}
            onChangeText={setFatherPhone}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Mother's Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter mother's name"
            value={motherName}
            onChangeText={setMotherName}
          />

          <Text style={styles.label}>Mother's Phone</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter mother's phone"
            value={motherPhone}
            onChangeText={setMotherPhone}
            keyboardType="phone-pad"
          />
        </View>

        {/* Children Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>👶 Children</Text>
            <TouchableOpacity onPress={addChild} style={styles.addChildButton}>
              <IconSymbol name="plus.circle.fill" size={24} color="#007AFF" />
              <Text style={styles.addChildText}>Add Child</Text>
            </TouchableOpacity>
          </View>

          {children.map((child, index) => (
            <View key={index} style={styles.childCard}>
              <View style={styles.childHeader}>
                <Text style={styles.childLabel}>Child {index + 1}</Text>
                <TouchableOpacity onPress={() => removeChild(index)}>
                  <IconSymbol name="trash" size={20} color="#FF3B30" />
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Child's name"
                value={child.name}
                onChangeText={(text) => updateChild(index, 'name', text)}
              />

              <Text style={styles.label}>Gender</Text>
              <View style={styles.genderButtons}>
                {['male', 'female', 'other'].map((gender) => (
                  <TouchableOpacity
                    key={gender}
                    style={[
                      styles.genderButton,
                      child.gender === gender && styles.genderButtonActive,
                    ]}
                    onPress={() => updateChild(index, 'gender', gender)}>
                    <Text
                      style={[
                        styles.genderButtonText,
                        child.gender === gender && styles.genderButtonTextActive,
                      ]}>
                      {gender.charAt(0).toUpperCase() + gender.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          {children.length === 0 && (
            <Text style={styles.emptyChildrenText}>
              No children added yet. Click "Add Child" to add.
            </Text>
          )}
        </View>

        {/* Additional Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 Additional Information</Text>
          
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter address"
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={3}
          />

          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Any additional notes"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, saving && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={saving}>
          {saving ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.submitButtonText}>Update Entry</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backText: {
    color: '#007AFF',
    fontSize: 17,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  addChildButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addChildText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  childCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  childHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  childLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  genderButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#FFF',
    alignItems: 'center',
  },
  genderButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  genderButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  genderButtonTextActive: {
    color: '#FFF',
  },
  emptyChildrenText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    fontStyle: 'italic',
    padding: 20,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
