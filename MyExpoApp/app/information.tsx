import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { informationAPI } from '../services/api';

type InfoItem = {
  _id: string;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
  memberId?: string | null;
  number?: string | null;
};

export default function InformationScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<InfoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const router = useRouter();

  const trimmedQuery = useMemo(() => query.trim(), [query]);

  const getDisplayName = (item: InfoItem) =>
    item.fullName ||
    [item.firstName, item.middleName, item.lastName].filter(Boolean).join(' ').trim() ||
    'Unnamed';

  async function handleSearch() {
    if (!trimmedQuery) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      const res = await informationAPI.search(trimmedQuery);
      setResults(Array.isArray(res?.data) ? res.data : []);
    } catch (error) {
      console.error('Search failed', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Information</Text>
          <Text style={styles.subtitle}>
            Search by first name, full name, or full sequence (first middle last)
          </Text>

          <View style={styles.searchCard}>
            <TextInput
              placeholder="Type name here..."
              placeholderTextColor="#9CA3AF"
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSearch}
              style={styles.input}
              returnKeyType="search"
              autoCapitalize="words"
              autoCorrect={false}
              blurOnSubmit={false}
            />

            <Pressable
              style={[styles.searchButton, !trimmedQuery && styles.searchButtonDisabled]}
              onPress={handleSearch}
              disabled={!trimmedQuery}
            >
              <Text style={styles.searchButtonText}>Search</Text>
            </Pressable>
          </View>

          {loading ? (
            <ActivityIndicator size="large" style={styles.loader} color="#1A3A69" />
          ) : (
            <FlatList
              data={results}
              keyExtractor={(item) => item._id}
              keyboardShouldPersistTaps="always"
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.resultCard}
                  onPress={() => router.push(`/information/${item._id}`)}
                >
                  <Text style={styles.resultName}>{getDisplayName(item)}</Text>
                  <View style={styles.metaRow}>
                    <Text style={styles.metaLabel}>Member ID:</Text>
                    <Text style={styles.metaValue}>{item.memberId || 'Not provided'}</Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Text style={styles.metaLabel}>Number:</Text>
                    <Text style={styles.metaValue}>{item.number || 'Not provided'}</Text>
                  </View>
                </Pressable>
              )}
              ListEmptyComponent={
                hasSearched ? (
                  <Text style={styles.emptyText}>No results found.</Text>
                ) : (
                  <Text style={styles.hintText}>
                    Start typing a name and tap Search.
                  </Text>
                )
              }
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F0',
  },
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: '#F5F5F0',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A3A69',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 14,
    lineHeight: 20,
  },
  searchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    color: '#111827',
    fontSize: 16,
  },
  searchButton: {
    marginTop: 10,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#1A3A69',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonDisabled: {
    opacity: 0.5,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  loader: {
    marginTop: 30,
  },
  listContent: {
    paddingBottom: 24,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
  },
  resultName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A3A69',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    marginTop: 2,
  },
  metaLabel: {
    width: 90,
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  metaValue: {
    flex: 1,
    fontSize: 13,
    color: '#111827',
  },
  emptyText: {
    marginTop: 26,
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 16,
  },
  hintText: {
    marginTop: 26,
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 14,
  },
});
