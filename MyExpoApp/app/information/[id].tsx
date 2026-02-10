import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getInformationById, InformationRecord } from '../../services/informationService';

/*
 * Information detail screen
 *
 * Shows the details of a single record from the `information` collection.
 * Displays first name, middle name, last name, full name, member ID and
 * phone number. If a field is missing, displays "Not provided". A
 * back button allows navigation back to the search results.
 */

export default function InformationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [record, setRecord] = useState<InformationRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const doc = await getInformationById(String(id));
        setRecord(doc);
      } catch (err) {
        console.error('Fetch failed', err);
        setRecord(null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const displayName = useMemo(() => {
    if (!record) return 'Not provided';
    return (
      record.fullName ||
      [record.firstName, record.middleName, record.lastName].filter(Boolean).join(' ').trim() ||
      'Not provided'
    );
  }, [record]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#1A3A69" />
          <Text style={styles.loadingText}>Loading details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!record) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.notFoundTitle}>Record not found</Text>
          <Text style={styles.notFoundSub}>We couldn’t find this information record.</Text>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Information Details</Text>
        <Text style={styles.pageSubtitle}>Complete record imported from Excel</Text>

        <View style={styles.card}>
          <Field label="Full Name" value={displayName} />
          <Field label="First Name" value={record.firstName || 'Not provided'} />
          <Field label="Middle Name" value={record.middleName || 'Not provided'} />
          <Field label="Last Name" value={record.lastName || 'Not provided'} />
          <Field label="Member ID" value={record.memberId || 'Not provided'} />
          <Field label="Number" value={record.number || 'Not provided'} />
        </View>

        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.fieldRow}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F0',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 24,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A3A69',
  },
  pageSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 14,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  fieldRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F4',
  },
  fieldLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  backButton: {
    marginTop: 16,
    backgroundColor: '#1A3A69',
    borderRadius: 10,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 22,
    backgroundColor: '#F5F5F0',
  },
  loadingText: {
    marginTop: 10,
    color: '#6B7280',
    fontSize: 14,
  },
  notFoundTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A3A69',
    textAlign: 'center',
  },
  notFoundSub: {
    marginTop: 8,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 18,
  },
});