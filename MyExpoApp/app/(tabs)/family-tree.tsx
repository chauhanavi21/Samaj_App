import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { familyTreeAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { wp, hp, fontScale, padding } from '@/utils/responsive';

interface Child {
  name: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
}

interface FamilyTreeEntry {
  id?: string;
  _id?: string;
  memberId?: string;
  personName: string;
  personPhone?: string;
  personDateOfBirth?: string | null;
  personOccupation?: string;
  spouseName?: string;
  spousePhone?: string;
  fatherName?: string;
  fatherPhone?: string;
  motherName?: string;
  motherPhone?: string;
  children: Child[];
  address?: string;
  notes?: string;
  createdAt: string;
  createdBy?: any;
}

export default function FamilyTreeScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [entries, setEntries] = useState<FamilyTreeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEntries = async () => {
    try {
      const response = await familyTreeAPI.getAll();
      if (response.success) {
        setEntries(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching family tree:', error);
      Alert.alert('Error', 'Failed to load family tree entries');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Check authentication and redirect if not logged in
  useFocusEffect(
    useCallback(() => {
      if (!authLoading && !isAuthenticated) {
        Alert.alert(
          'Sign Up Required',
          'For Family Tree you need to sign up first. After signing up, your information will automatically appear in the Family Tree.',
          [
            {
              text: 'Sign Up',
              onPress: () => router.push('/signup'),
            },
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => router.push('/(tabs)'),
            },
          ]
        );
        return;
      }
      
      if (isAuthenticated) {
        setLoading(true);
        fetchEntries();
      }
    }, [isAuthenticated, authLoading])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchEntries();
  };

  const handleDelete = (id: string, personName: string) => {
    Alert.alert(
      'Delete Entry',
      `Are you sure you want to delete ${personName}'s entry?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await familyTreeAPI.delete(id);
              Alert.alert('Success', 'Entry deleted successfully');
              fetchEntries();
            } catch (error: any) {
              console.error('Delete error:', error);
              Alert.alert('Error', 'Failed to delete entry');
            }
          },
        },
      ]
    );
  };

  const renderEntry = ({ item }: { item: FamilyTreeEntry }) => {
    const entryId = (item.id || item._id || '').toString();
    const display = (value: any) => {
      const trimmed = String(value ?? '').trim();
      return trimmed ? trimmed : 'Not provided';
    };

    return (
      <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.personName}>{item.personName}</Text>
        <View style={styles.cardActions}>
          <TouchableOpacity
            onPress={() => {
              if (!entryId) {
                Alert.alert('Error', 'Missing entry id');
                return;
              }
              router.push(`/family-tree/edit/${entryId}`);
            }}
            style={styles.iconButton}>
            <IconSymbol name="pencil" size={22} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (!entryId) {
                Alert.alert('Error', 'Missing entry id');
                return;
              }
              handleDelete(entryId, item.personName);
            }}
            style={styles.iconButton}>
            <IconSymbol name="trash" size={22} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Phone:</Text>
        <Text style={styles.value}>{display(item.personPhone)}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Member ID:</Text>
        <Text style={styles.value}>{display(item.memberId)}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>DOB:</Text>
        <Text style={styles.value}>{display(item.personDateOfBirth)}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Occupation:</Text>
        <Text style={styles.value}>{display(item.personOccupation)}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.infoRow}>
        <Text style={styles.label}>Spouse Name:</Text>
        <Text style={styles.value}>{display(item.spouseName)}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Spouse Phone:</Text>
        <Text style={styles.value}>{display(item.spousePhone)}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Father Name:</Text>
        <Text style={styles.value}>{display(item.fatherName)}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Father Phone:</Text>
        <Text style={styles.value}>{display(item.fatherPhone)}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Mother Name:</Text>
        <Text style={styles.value}>{display(item.motherName)}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Mother Phone:</Text>
        <Text style={styles.value}>{display(item.motherPhone)}</Text>
      </View>

      <View style={styles.childrenSection}>
        <Text style={styles.sectionTitle}>Children</Text>
        {item.children && item.children.length > 0 ? (
          item.children.map((child, index) => (
            <Text key={index} style={styles.childText}>
              • {display(child.name)}
              {child.gender ? ` (${child.gender})` : ''}
              {child.dateOfBirth ? ` • DOB: ${child.dateOfBirth}` : ''}
            </Text>
          ))
        ) : (
          <Text style={styles.childText}>No children provided</Text>
        )}
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Address:</Text>
        <Text style={styles.value}>{display(item.address)}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Notes:</Text>
        <Text style={styles.value}>{display(item.notes)}</Text>
      </View>
      </View>
    );
  };

  if (authLoading || loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>
          {authLoading ? 'Checking authentication...' : 'Loading family tree...'}
        </Text>
      </View>
    );
  }

  // If not authenticated, show empty view (alert will handle redirect)
  if (!isAuthenticated) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Redirecting to signup...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Family Tree</Text>
      </View>

      {entries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Family Entries Yet</Text>
          <Text style={styles.emptyText}>
            Your family tree information will appear here after signup.
          </Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          renderItem={renderEntry}
          keyExtractor={(item, index) => (item.id || item._id || String(index)).toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
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
    paddingHorizontal: padding.md,
    paddingVertical: hp(2),
    paddingTop: hp(7),
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: fontScale(28),
    fontWeight: 'bold',
    color: '#000',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    borderRadius: wp(5),
    gap: wp(1.5),
  },
  addButtonText: {
    color: '#FFF',
    fontSize: fontScale(16),
    fontWeight: '600',
  },
  listContainer: {
    padding: padding.md,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: wp(4),
    padding: padding.md,
    marginBottom: hp(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: wp(2),
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1.5),
  },
  personName: {
    fontSize: fontScale(24),
    fontWeight: '700',
    color: '#1A3A69',
    flex: 1,
    letterSpacing: 0.3,
  },
  cardActions: {
    flexDirection: 'row',
    gap: wp(4),
  },
  iconButton: {
    padding: wp(1.5),
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: hp(2),
  },
  detailText: {
    fontSize: fontScale(16),
    color: '#666',
    marginBottom: hp(1),
    lineHeight: fontScale(22),
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: hp(1.2),
    flexWrap: 'wrap',
  },
  label: {
    fontSize: fontScale(17),
    fontWeight: '600',
    color: '#333',
    marginRight: wp(2),
    minWidth: wp(20),
  },
  value: {
    fontSize: fontScale(17),
    color: '#666',
    flex: 1,
  },
  sectionTitle: {
    fontSize: fontScale(18),
    fontWeight: '600',
    color: '#333',
    marginTop: hp(1),
    marginBottom: hp(1),
  },
  childrenSection: {
    marginTop: hp(1.5),
  },
  childText: {
    fontSize: fontScale(16),
    color: '#666',
    marginLeft: wp(2.5),
    marginBottom: hp(0.8),
    lineHeight: fontScale(22),
  },
  addressText: {
    fontSize: fontScale(16),
    color: '#666',
    marginTop: hp(1.5),
    fontStyle: 'italic',
    lineHeight: fontScale(22),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: padding.lg,
  },
  emptyTitle: {
    fontSize: fontScale(26),
    fontWeight: '700',
    color: '#1A3A69',
    marginBottom: hp(1.5),
    textAlign: 'center',
  },
  emptyText: {
    fontSize: fontScale(16),
    color: '#666',
    textAlign: 'center',
    marginBottom: hp(4),
    lineHeight: fontScale(24),
  },
  emptyButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: wp(8),
    paddingVertical: hp(1.5),
    borderRadius: wp(6),
  },
  emptyButtonText: {
    color: '#FFF',
    fontSize: fontScale(16),
    fontWeight: '600',
  },
});
