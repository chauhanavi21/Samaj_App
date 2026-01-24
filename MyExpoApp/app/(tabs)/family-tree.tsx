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
import { IconSymbol } from '@/components/ui/icon-symbol';

interface Child {
  name: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
}

interface FamilyTreeEntry {
  _id: string;
  personName: string;
  personPhone?: string;
  spouseName?: string;
  fatherName?: string;
  motherName?: string;
  children: Child[];
  address?: string;
  createdAt: string;
}

export default function FamilyTreeScreen() {
  const router = useRouter();
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

  // Fetch on mount and when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchEntries();
    }, [])
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

  const renderEntry = ({ item }: { item: FamilyTreeEntry }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.personName}>👤 {item.personName}</Text>
        <View style={styles.cardActions}>
          <TouchableOpacity
            onPress={() => router.push(`/family-tree/edit/${item._id}`)}
            style={styles.iconButton}>
            <IconSymbol name="pencil" size={20} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDelete(item._id, item.personName)}
            style={styles.iconButton}>
            <IconSymbol name="trash" size={20} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>

      {item.personPhone && (
        <Text style={styles.detailText}>📞 {item.personPhone}</Text>
      )}

      <View style={styles.divider} />

      {item.spouseName && (
        <Text style={styles.detailText}>💑 Spouse: {item.spouseName}</Text>
      )}

      {item.fatherName && (
        <Text style={styles.detailText}>👨 Father: {item.fatherName}</Text>
      )}

      {item.motherName && (
        <Text style={styles.detailText}>👩 Mother: {item.motherName}</Text>
      )}

      {item.children && item.children.length > 0 && (
        <View style={styles.childrenSection}>
          <Text style={styles.sectionTitle}>👶 Children:</Text>
          {item.children.map((child, index) => (
            <Text key={index} style={styles.childText}>
              • {child.name}
              {child.gender && ` (${child.gender})`}
            </Text>
          ))}
        </View>
      )}

      {item.address && (
        <Text style={styles.addressText}>📍 {item.address}</Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading family tree...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Family Tree</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/family-tree/add')}>
          <IconSymbol name="plus" size={24} color="#FFF" />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {entries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🌳</Text>
          <Text style={styles.emptyTitle}>No Family Entries Yet</Text>
          <Text style={styles.emptyText}>
            Start building your family tree by adding your first entry
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => router.push('/family-tree/add')}>
            <Text style={styles.emptyButtonText}>Add First Entry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={entries}
          renderItem={renderEntry}
          keyExtractor={(item) => item._id}
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
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  personName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 12,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
  },
  childrenSection: {
    marginTop: 8,
  },
  childText: {
    fontSize: 15,
    color: '#666',
    marginLeft: 8,
    marginBottom: 3,
  },
  addressText: {
    fontSize: 15,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  emptyButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  emptyButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
