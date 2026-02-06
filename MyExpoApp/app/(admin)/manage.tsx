import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { Stack } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { adminAPI } from '@/services/api';
import { KeyboardSafeScroll } from '@/components/keyboard-safe-scroll';
import { wp, hp, fontScale, padding } from '@/utils/responsive';

type ContentType = 'committee' | 'sponsors' | 'offers' | 'events' | 'places';

const TYPE_LABEL: Record<ContentType, string> = {
  committee: 'Committee',
  sponsors: 'Sponsors',
  offers: 'Special Offers',
  events: 'Upcoming Events',
  places: 'Spiritual Places',
};

export default function AdminManage() {
  const [type, setType] = useState<ContentType>('committee');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [form, setForm] = useState<any>({});

  const title = useMemo(() => TYPE_LABEL[type], [type]);

  const resetForm = (nextType: ContentType, existing?: any) => {
    if (nextType === 'committee') {
      setForm({
        nameEn: existing?.nameEn ?? '',
        nameHi: existing?.nameHi ?? '',
        phone: existing?.phone ?? '',
        city: existing?.city ?? '',
      });
      return;
    }

    if (nextType === 'sponsors') {
      setForm({
        name: existing?.name ?? '',
        amount: existing?.amount ?? '',
        phone: existing?.phone ?? '',
      });
      return;
    }

    if (nextType === 'offers') {
      setForm({
        title: existing?.title ?? '',
        description: existing?.description ?? '',
        category: existing?.category ?? '',
        validityText: existing?.validityText ?? '',
        badgeText: existing?.badgeText ?? '',
        badgeColor: existing?.badgeColor ?? '#FF8C00',
      });
      return;
    }

    if (nextType === 'events') {
      setForm({
        category: existing?.category ?? '',
        title: existing?.title ?? '',
        date: existing?.date ?? '',
        time: existing?.time ?? '',
        location: existing?.location ?? '',
        description: existing?.description ?? '',
      });
      return;
    }

    setForm({
      name: existing?.name ?? '',
      address: existing?.address ?? '',
      googleMapsLink: existing?.googleMapsLink ?? '',
    });
  };

  const fetchList = async (nextPage: number, mode: 'replace' | 'append') => {
    try {
      let response: any;

      if (type === 'committee') response = await adminAPI.getCommittee({ page: nextPage, limit: 50 });
      else if (type === 'sponsors') response = await adminAPI.getSponsors({ page: nextPage, limit: 50 });
      else if (type === 'offers') response = await adminAPI.getOffers({ page: nextPage, limit: 50 });
      else if (type === 'events') response = await adminAPI.getEvents({ page: nextPage, limit: 50 });
      else response = await adminAPI.getPlaces({ page: nextPage, limit: 50 });

      const data = response?.data ?? [];
      const pagination = response?.pagination;

      setItems((prev) => (mode === 'replace' ? data : [...prev, ...data]));
      setHasNextPage(!!pagination?.hasNextPage);
      setPage(pagination?.page ?? nextPage);
    } catch (err: any) {
      console.error('Admin manage load error:', err?.response?.data || err?.message || err);
      Alert.alert('Error', err?.response?.data?.message || 'Failed to load content');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchList(1, 'replace');
  }, [type]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchList(1, 'replace');
  };

  const onLoadMore = () => {
    if (!hasNextPage) return;
    fetchList(page + 1, 'append');
  };

  const startCreate = () => {
    setEditingItem(null);
    resetForm(type);
    setModalVisible(true);
  };

  const startEdit = (item: any) => {
    setEditingItem(item);
    resetForm(type, item);
    setModalVisible(true);
  };

  const confirmDelete = (item: any) => {
    Alert.alert('Delete', 'Are you sure you want to delete this item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            if (type === 'committee') await adminAPI.deleteCommitteeMember(item._id);
            else if (type === 'sponsors') await adminAPI.deleteSponsor(item._id);
            else if (type === 'offers') await adminAPI.deleteOffer(item._id);
            else if (type === 'events') await adminAPI.deleteEvent(item._id);
            else await adminAPI.deletePlace(item._id);

            fetchList(1, 'replace');
          } catch (err: any) {
            Alert.alert('Error', err?.response?.data?.message || 'Failed to delete');
          }
        },
      },
    ]);
  };

  const save = async () => {
    try {
      if (type === 'committee') {
        if (!form.nameEn || !form.nameHi || !form.phone || !form.city) {
          Alert.alert('Error', 'Please fill all fields');
          return;
        }
        if (editingItem) await adminAPI.updateCommitteeMember(editingItem._id, form);
        else await adminAPI.createCommitteeMember(form);
      } else if (type === 'sponsors') {
        if (!form.name || !form.amount || !form.phone) {
          Alert.alert('Error', 'Please fill all fields');
          return;
        }
        if (editingItem) await adminAPI.updateSponsor(editingItem._id, form);
        else await adminAPI.createSponsor(form);
      } else if (type === 'offers') {
        if (!form.title || !form.description || !form.category || !form.validityText || !form.badgeText) {
          Alert.alert('Error', 'Please fill all fields');
          return;
        }
        if (editingItem) await adminAPI.updateOffer(editingItem._id, form);
        else await adminAPI.createOffer(form);
      } else if (type === 'events') {
        if (!form.category || !form.title || !form.date || !form.time || !form.location || !form.description) {
          Alert.alert('Error', 'Please fill all fields');
          return;
        }
        if (editingItem) await adminAPI.updateEvent(editingItem._id, form);
        else await adminAPI.createEvent(form);
      } else {
        if (!form.name || !form.address) {
          Alert.alert('Error', 'Please fill all fields');
          return;
        }
        if (editingItem) await adminAPI.updatePlace(editingItem._id, form);
        else await adminAPI.createPlace(form);
      }

      setModalVisible(false);
      fetchList(1, 'replace');
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to save');
    }
  };

  const renderItemSummary = (item: any) => {
    if (type === 'committee') {
      return (
        <>
          <Text style={styles.itemTitle}>{item.nameEn} ({item.nameHi})</Text>
          <Text style={styles.itemSubtitle}>{item.phone} • {item.city}</Text>
        </>
      );
    }

    if (type === 'sponsors') {
      return (
        <>
          <Text style={styles.itemTitle}>{item.name}</Text>
          <Text style={styles.itemSubtitle}>{item.amount} • {item.phone}</Text>
        </>
      );
    }

    if (type === 'offers') {
      return (
        <>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemSubtitle}>{item.badgeText} • {item.category} • {item.validityText}</Text>
        </>
      );
    }

    if (type === 'events') {
      return (
        <>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemSubtitle}>{item.category} • {item.date} • {item.location}</Text>
        </>
      );
    }

    return (
      <>
        <Text style={styles.itemTitle}>{item.name}</Text>
        <Text style={styles.itemSubtitle}>{item.address}</Text>
      </>
    );
  };

  const renderFormFields = () => {
    if (type === 'committee') {
      return (
        <>
          <Text style={styles.inputLabel}>Name (English)*</Text>
          <TextInput style={styles.input} value={form.nameEn} onChangeText={(t) => setForm({ ...form, nameEn: t })} />

          <Text style={styles.inputLabel}>Name (Hindi)*</Text>
          <TextInput style={styles.input} value={form.nameHi} onChangeText={(t) => setForm({ ...form, nameHi: t })} />

          <Text style={styles.inputLabel}>Phone*</Text>
          <TextInput style={styles.input} value={form.phone} onChangeText={(t) => setForm({ ...form, phone: t })} />

          <Text style={styles.inputLabel}>City*</Text>
          <TextInput style={styles.input} value={form.city} onChangeText={(t) => setForm({ ...form, city: t })} />
        </>
      );
    }

    if (type === 'sponsors') {
      return (
        <>
          <Text style={styles.inputLabel}>Sponsor Name*</Text>
          <TextInput style={styles.input} value={form.name} onChangeText={(t) => setForm({ ...form, name: t })} />

          <Text style={styles.inputLabel}>Amount* (example: ₹51,000)</Text>
          <TextInput style={styles.input} value={form.amount} onChangeText={(t) => setForm({ ...form, amount: t })} />

          <Text style={styles.inputLabel}>Phone*</Text>
          <TextInput style={styles.input} value={form.phone} onChangeText={(t) => setForm({ ...form, phone: t })} />
        </>
      );
    }

    if (type === 'offers') {
      return (
        <>
          <Text style={styles.inputLabel}>Title*</Text>
          <TextInput style={styles.input} value={form.title} onChangeText={(t) => setForm({ ...form, title: t })} />

          <Text style={styles.inputLabel}>Description*</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={form.description}
            onChangeText={(t) => setForm({ ...form, description: t })}
            multiline
            numberOfLines={4}
          />

          <Text style={styles.inputLabel}>Category*</Text>
          <TextInput style={styles.input} value={form.category} onChangeText={(t) => setForm({ ...form, category: t })} />

          <Text style={styles.inputLabel}>Date/Validity*</Text>
          <TextInput style={styles.input} value={form.validityText} onChangeText={(t) => setForm({ ...form, validityText: t })} />

          <Text style={styles.inputLabel}>Badge/Value* (example: FREE / ₹999 Only)</Text>
          <TextInput style={styles.input} value={form.badgeText} onChangeText={(t) => setForm({ ...form, badgeText: t })} />

          <Text style={styles.inputLabel}>Badge Color (hex)</Text>
          <TextInput style={styles.input} value={form.badgeColor} onChangeText={(t) => setForm({ ...form, badgeColor: t })} autoCapitalize="none" />
        </>
      );
    }

    if (type === 'events') {
      return (
        <>
          <Text style={styles.inputLabel}>Category Tag* (example: SPORTS)</Text>
          <TextInput style={styles.input} value={form.category} onChangeText={(t) => setForm({ ...form, category: t })} />

          <Text style={styles.inputLabel}>Title*</Text>
          <TextInput style={styles.input} value={form.title} onChangeText={(t) => setForm({ ...form, title: t })} />

          <Text style={styles.inputLabel}>Date*</Text>
          <TextInput style={styles.input} value={form.date} onChangeText={(t) => setForm({ ...form, date: t })} />

          <Text style={styles.inputLabel}>Time*</Text>
          <TextInput style={styles.input} value={form.time} onChangeText={(t) => setForm({ ...form, time: t })} />

          <Text style={styles.inputLabel}>Location*</Text>
          <TextInput style={styles.input} value={form.location} onChangeText={(t) => setForm({ ...form, location: t })} />

          <Text style={styles.inputLabel}>Description*</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={form.description}
            onChangeText={(t) => setForm({ ...form, description: t })}
            multiline
            numberOfLines={4}
          />
        </>
      );
    }

    return (
      <>
        <Text style={styles.inputLabel}>Place Name*</Text>
        <TextInput style={styles.input} value={form.name} onChangeText={(t) => setForm({ ...form, name: t })} />

        <Text style={styles.inputLabel}>Address/Location Text*</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={form.address}
          onChangeText={(t) => setForm({ ...form, address: t })}
          multiline
          numberOfLines={3}
        />

        <Text style={styles.inputLabel}>Google Maps Link (optional)</Text>
        <TextInput
          style={styles.input}
          value={form.googleMapsLink}
          onChangeText={(t) => setForm({ ...form, googleMapsLink: t })}
          autoCapitalize="none"
        />
      </>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Manage Content', headerShown: false }} />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Manage Content</Text>
          <Text style={styles.headerSubtitle}>{title} • {items.length} items</Text>
        </View>
        <TouchableOpacity onPress={startCreate} style={styles.addButton}>
          <MaterialIcons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.typeGrid}>
        {(Object.keys(TYPE_LABEL) as ContentType[]).map((key) => {
          const active = key === type;
          return (
            <TouchableOpacity
              key={key}
              onPress={() => setType(key)}
              style={[styles.typeButton, active && styles.typeButtonActive]}
            >
              <Text
                style={[styles.typeButtonText, active && styles.typeButtonTextActive]}
                numberOfLines={2}
              >
                {TYPE_LABEL[key]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {loading && (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#1A3A69" />
          </View>
        )}

        {!loading && items.map((item) => (
          <View key={item._id} style={styles.itemCard}>
            <View style={styles.itemInfo}>{renderItemSummary(item)}</View>
            <View style={styles.itemActions}>
              <TouchableOpacity onPress={() => startEdit(item)} style={styles.actionButton}>
                <MaterialIcons name="edit" size={20} color="#4CAF50" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => confirmDelete(item)} style={styles.actionButton}>
                <MaterialIcons name="delete" size={20} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {!loading && items.length === 0 && (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="inventory" size={64} color="#CCC" />
            <Text style={styles.emptyText}>No items yet</Text>
            <TouchableOpacity onPress={startCreate} style={styles.createFirstButton}>
              <Text style={styles.createFirstButtonText}>Add first item</Text>
            </TouchableOpacity>
          </View>
        )}

        {!loading && hasNextPage && (
          <TouchableOpacity onPress={onLoadMore} style={styles.loadMoreButton}>
            <Text style={styles.loadMoreText}>Load more</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: hp(3) }} />
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingItem ? 'Edit' : 'Add'} {title}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <KeyboardSafeScroll style={styles.modalScroll} contentContainerStyle={styles.modalBody} showsVerticalScrollIndicator={false}>
              {renderFormFields()}

              <TouchableOpacity onPress={save} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>{editingItem ? 'Save Changes' : 'Create'}</Text>
              </TouchableOpacity>
            </KeyboardSafeScroll>
          </View>
        </View>
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
    paddingTop: hp(6),
    paddingHorizontal: padding.md,
    paddingBottom: padding.md,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: fontScale(24),
    fontWeight: '700',
    color: '#1A3A69',
  },
  headerSubtitle: {
    marginTop: hp(0.5),
    fontSize: fontScale(14),
    color: '#666666',
  },
  addButton: {
    backgroundColor: '#1A3A69',
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: padding.md,
    paddingVertical: hp(1.5),
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  typeButton: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    width: '48%',
    paddingVertical: hp(1.25),
    paddingHorizontal: padding.sm,
    borderRadius: wp(3),
    backgroundColor: '#FFFFFF',
    marginBottom: hp(1),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: hp(5.5),
  },
  typeButtonActive: {
    borderColor: '#1A3A69',
    backgroundColor: '#FFF4E6',
  },
  typeButtonText: {
    fontSize: fontScale(14),
    fontWeight: '700',
    color: '#666666',
    textAlign: 'center',
  },
  typeButtonTextActive: {
    color: '#1A3A69',
  },
  content: {
    flex: 1,
    padding: padding.md,
  },
  centered: {
    paddingVertical: hp(6),
    alignItems: 'center',
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp(3),
    padding: padding.md,
    marginBottom: hp(1.5),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: wp(2),
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: wp(3),
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: fontScale(16),
    fontWeight: '700',
    color: '#1A3A69',
  },
  itemSubtitle: {
    marginTop: hp(0.5),
    fontSize: fontScale(13),
    color: '#666666',
  },
  itemActions: {
    flexDirection: 'row',
    gap: wp(2.5),
  },
  actionButton: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    paddingVertical: hp(8),
    alignItems: 'center',
  },
  emptyText: {
    marginTop: hp(1.5),
    fontSize: fontScale(16),
    color: '#999999',
  },
  createFirstButton: {
    marginTop: hp(2),
    backgroundColor: '#1A3A69',
    paddingVertical: hp(1.5),
    paddingHorizontal: padding.lg,
    borderRadius: wp(2),
  },
  createFirstButtonText: {
    color: '#FFFFFF',
    fontSize: fontScale(16),
    fontWeight: '700',
  },
  loadMoreButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1A3A69',
    paddingVertical: hp(1.75),
    borderRadius: wp(2),
    alignItems: 'center',
    marginTop: hp(1),
  },
  loadMoreText: {
    fontSize: fontScale(16),
    fontWeight: '700',
    color: '#1A3A69',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#F5F5F0',
    borderTopLeftRadius: wp(6),
    borderTopRightRadius: wp(6),
    height: '90%',
  },
  modalHeader: {
    padding: padding.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: wp(6),
    borderTopRightRadius: wp(6),
  },
  modalTitle: {
    fontSize: fontScale(18),
    fontWeight: '700',
    color: '#1A3A69',
  },
  modalBody: {
    padding: padding.md,
  },
  modalScroll: {
    flex: 1,
  },
  inputLabel: {
    fontSize: fontScale(13),
    fontWeight: '700',
    color: '#666666',
    marginTop: hp(1.5),
    marginBottom: hp(0.75),
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp(2),
    paddingHorizontal: padding.md,
    paddingVertical: hp(1.25),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontSize: fontScale(15),
  },
  textArea: {
    minHeight: hp(14),
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#1A3A69',
    paddingVertical: hp(1.75),
    borderRadius: wp(2),
    alignItems: 'center',
    marginTop: hp(2.5),
    marginBottom: hp(2),
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: fontScale(16),
    fontWeight: '700',
  },
});
