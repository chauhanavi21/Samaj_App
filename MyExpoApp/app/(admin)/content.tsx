import React, { useState, useEffect } from 'react';
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
import { wp, hp, fontScale, padding } from '@/utils/responsive';

export default function AdminContent() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pages, setPages] = useState<any[]>([]);
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editForm, setEditForm] = useState<any>({});

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      const response = await adminAPI.getPages();
      if (response.success) {
        setPages(response.data);
      }
    } catch (err: any) {
      console.error('Load pages error:', err);
      Alert.alert('Error', err.response?.data?.message || 'Failed to load pages');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadPages();
  };

  const startCreate = () => {
    setEditForm({
      pageName: '',
      displayName: '',
      sections: [{ title: '', text: '', imageUrl: '', order: 0 }],
      isPublished: true,
    });
    setShowCreateModal(true);
  };

  const startEdit = (page: any) => {
    setEditForm({
      displayName: page.displayName,
      sections: page.sections.length > 0 ? page.sections : [{ title: '', text: '', imageUrl: '', order: 0 }],
      isPublished: page.isPublished,
    });
    setSelectedPage(page);
    setShowEditModal(true);
  };

  const handleCreate = async () => {
    if (!editForm.pageName.trim() || !editForm.displayName.trim()) {
      Alert.alert('Error', 'Page name and display name are required');
      return;
    }

    try {
      const response = await adminAPI.createPage(editForm);
      if (response.success) {
        Alert.alert('Success', 'Page created successfully');
        setShowCreateModal(false);
        loadPages();
      }
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to create page');
    }
  };

  const handleUpdate = async () => {
    if (!editForm.displayName.trim()) {
      Alert.alert('Error', 'Display name is required');
      return;
    }

    try {
      const response = await adminAPI.updatePage(selectedPage.pageName, editForm);
      if (response.success) {
        Alert.alert('Success', 'Page updated successfully');
        setShowEditModal(false);
        loadPages();
      }
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to update page');
    }
  };

  const handleDelete = async (pageName: string, displayName: string) => {
    Alert.alert(
      'Delete Page',
      `Are you sure you want to delete "${displayName}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await adminAPI.deletePage(pageName);
              if (response.success) {
                Alert.alert('Success', 'Page deleted successfully');
                loadPages();
              }
            } catch (err: any) {
              Alert.alert('Error', err.response?.data?.message || 'Failed to delete page');
            }
          },
        },
      ]
    );
  };

  const addSection = () => {
    const newSection = { title: '', text: '', imageUrl: '', order: editForm.sections.length };
    setEditForm({ ...editForm, sections: [...editForm.sections, newSection] });
  };

  const removeSection = (index: number) => {
    const newSections = editForm.sections.filter((_: any, i: number) => i !== index);
    setEditForm({ ...editForm, sections: newSections });
  };

  const updateSection = (index: number, field: string, value: string) => {
    const newSections = [...editForm.sections];
    newSections[index] = { ...newSections[index], [field]: value };
    setEditForm({ ...editForm, sections: newSections });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#1A3A69" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Content Management', headerShown: false }} />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Content Management</Text>
          <Text style={styles.headerSubtitle}>{pages.length} pages</Text>
        </View>
        <TouchableOpacity onPress={startCreate} style={styles.addButton}>
          <MaterialIcons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Page List */}
      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {pages.map((page) => (
          <View key={page._id} style={styles.pageCard}>
            <View style={styles.pageInfo}>
              <View style={styles.pageHeader}>
                <Text style={styles.pageName}>{page.displayName}</Text>
                {page.isPublished ? (
                  <View style={styles.publishedBadge}>
                    <Text style={styles.publishedBadgeText}>PUBLISHED</Text>
                  </View>
                ) : (
                  <View style={styles.draftBadge}>
                    <Text style={styles.draftBadgeText}>DRAFT</Text>
                  </View>
                )}
              </View>
              <Text style={styles.pageDetail}>
                <MaterialIcons name="link" size={14} /> {page.pageName}
              </Text>
              <Text style={styles.pageDetail}>
                <MaterialIcons name="view-module" size={14} /> {page.sections.length} sections
              </Text>
              <Text style={styles.pageDetail}>
                <MaterialIcons name="schedule" size={14} /> Updated {new Date(page.updatedAt).toLocaleDateString()}
              </Text>
            </View>

            <View style={styles.pageActions}>
              <TouchableOpacity onPress={() => startEdit(page)} style={styles.actionButton}>
                <MaterialIcons name="edit" size={20} color="#4CAF50" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(page.pageName, page.displayName)} style={styles.actionButton}>
                <MaterialIcons name="delete" size={20} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {pages.length === 0 && (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="article" size={64} color="#CCC" />
            <Text style={styles.emptyText}>No pages yet</Text>
            <TouchableOpacity onPress={startCreate} style={styles.createFirstButton}>
              <Text style={styles.createFirstButtonText}>Create First Page</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Create Page Modal */}
      <Modal visible={showCreateModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Page</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <Text style={styles.inputLabel}>Page Name (URL-friendly)*</Text>
              <TextInput
                style={styles.input}
                value={editForm.pageName}
                onChangeText={(text) => setEditForm({ ...editForm, pageName: text.toLowerCase().replace(/\s+/g, '-') })}
                placeholder="e.g., about-us"
                autoCapitalize="none"
              />
              
              <Text style={styles.inputLabel}>Display Name*</Text>
              <TextInput
                style={styles.input}
                value={editForm.displayName}
                onChangeText={(text) => setEditForm({ ...editForm, displayName: text })}
                placeholder="e.g., About Us"
              />

              {/* Sections */}
              <View style={styles.sectionsContainer}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionHeaderText}>Sections</Text>
                  <TouchableOpacity onPress={addSection} style={styles.addSectionButton}>
                    <MaterialIcons name="add" size={20} color="#FFF" />
                    <Text style={styles.addSectionButtonText}>Add Section</Text>
                  </TouchableOpacity>
                </View>

                {editForm.sections?.map((section: any, index: number) => (
                  <View key={index} style={styles.sectionCard}>
                    <View style={styles.sectionCardHeader}>
                      <Text style={styles.sectionCardTitle}>Section {index + 1}</Text>
                      <TouchableOpacity onPress={() => removeSection(index)}>
                        <MaterialIcons name="delete" size={20} color="#FF3B30" />
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.inputLabel}>Title</Text>
                    <TextInput
                      style={styles.input}
                      value={section.title}
                      onChangeText={(text) => updateSection(index, 'title', text)}
                      placeholder="Section title"
                    />

                    <Text style={styles.inputLabel}>Text</Text>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      value={section.text}
                      onChangeText={(text) => updateSection(index, 'text', text)}
                      placeholder="Section content"
                      multiline
                      numberOfLines={4}
                    />

                    <Text style={styles.inputLabel}>Image URL</Text>
                    <TextInput
                      style={styles.input}
                      value={section.imageUrl}
                      onChangeText={(text) => updateSection(index, 'imageUrl', text)}
                      placeholder="/uploads/image.jpg"
                      autoCapitalize="none"
                    />
                  </View>
                ))}
              </View>

              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Published</Text>
                <TouchableOpacity
                  onPress={() => setEditForm({ ...editForm, isPublished: !editForm.isPublished })}
                  style={[styles.switch, editForm.isPublished && styles.switchActive]}
                >
                  <View style={[styles.switchThumb, editForm.isPublished && styles.switchThumbActive]} />
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity onPress={handleCreate} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Create Page</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Edit Page Modal */}
      <Modal visible={showEditModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Page</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <Text style={styles.inputLabel}>Display Name*</Text>
              <TextInput
                style={styles.input}
                value={editForm.displayName}
                onChangeText={(text) => setEditForm({ ...editForm, displayName: text })}
                placeholder="e.g., About Us"
              />

              {/* Sections */}
              <View style={styles.sectionsContainer}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionHeaderText}>Sections</Text>
                  <TouchableOpacity onPress={addSection} style={styles.addSectionButton}>
                    <MaterialIcons name="add" size={20} color="#FFF" />
                    <Text style={styles.addSectionButtonText}>Add Section</Text>
                  </TouchableOpacity>
                </View>

                {editForm.sections?.map((section: any, index: number) => (
                  <View key={index} style={styles.sectionCard}>
                    <View style={styles.sectionCardHeader}>
                      <Text style={styles.sectionCardTitle}>Section {index + 1}</Text>
                      <TouchableOpacity onPress={() => removeSection(index)}>
                        <MaterialIcons name="delete" size={20} color="#FF3B30" />
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.inputLabel}>Title</Text>
                    <TextInput
                      style={styles.input}
                      value={section.title}
                      onChangeText={(text) => updateSection(index, 'title', text)}
                      placeholder="Section title"
                    />

                    <Text style={styles.inputLabel}>Text</Text>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      value={section.text}
                      onChangeText={(text) => updateSection(index, 'text', text)}
                      placeholder="Section content"
                      multiline
                      numberOfLines={4}
                    />

                    <Text style={styles.inputLabel}>Image URL</Text>
                    <TextInput
                      style={styles.input}
                      value={section.imageUrl}
                      onChangeText={(text) => updateSection(index, 'imageUrl', text)}
                      placeholder="/uploads/image.jpg"
                      autoCapitalize="none"
                    />
                  </View>
                ))}
              </View>

              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Published</Text>
                <TouchableOpacity
                  onPress={() => setEditForm({ ...editForm, isPublished: !editForm.isPublished })}
                  style={[styles.switch, editForm.isPublished && styles.switchActive]}
                >
                  <View style={[styles.switchThumb, editForm.isPublished && styles.switchThumbActive]} />
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity onPress={handleUpdate} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#1A3A69',
    paddingHorizontal: padding.lg,
    paddingTop: hp(6),
    paddingBottom: hp(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: fontScale(24),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: fontScale(14),
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: hp(0.5),
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: padding.md,
    borderRadius: 8,
  },
  content: {
    flex: 1,
  },
  pageCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: padding.md,
    marginTop: padding.md,
    padding: padding.lg,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pageInfo: {
    flex: 1,
  },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(0.5),
  },
  pageName: {
    fontSize: fontScale(16),
    fontWeight: '600',
    color: '#333',
  },
  publishedBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: padding.sm,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: padding.sm,
  },
  publishedBadgeText: {
    fontSize: fontScale(10),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  draftBadge: {
    backgroundColor: '#FF9800',
    paddingHorizontal: padding.sm,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: padding.sm,
  },
  draftBadgeText: {
    fontSize: fontScale(10),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pageDetail: {
    fontSize: fontScale(13),
    color: '#666',
    marginTop: hp(0.3),
  },
  pageActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: padding.sm,
  },
  actionButton: {
    padding: padding.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(8),
  },
  emptyText: {
    fontSize: fontScale(16),
    color: '#999',
    marginTop: hp(2),
  },
  createFirstButton: {
    marginTop: hp(2),
    backgroundColor: '#1A3A69',
    paddingHorizontal: padding.xl,
    paddingVertical: padding.md,
    borderRadius: 8,
  },
  createFirstButtonText: {
    color: '#FFFFFF',
    fontSize: fontScale(16),
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: wp(90),
    maxHeight: hp(85),
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: padding.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: fontScale(18),
    fontWeight: '600',
    color: '#333',
  },
  modalBody: {
    padding: padding.lg,
  },
  inputLabel: {
    fontSize: fontScale(14),
    color: '#666',
    marginTop: hp(1.5),
    marginBottom: hp(0.5),
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: padding.md,
    paddingVertical: padding.sm,
    fontSize: fontScale(14),
  },
  textArea: {
    minHeight: hp(10),
    textAlignVertical: 'top',
  },
  sectionsContainer: {
    marginTop: hp(2),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  sectionHeaderText: {
    fontSize: fontScale(16),
    fontWeight: '600',
    color: '#333',
  },
  addSectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: padding.md,
    paddingVertical: padding.sm,
    borderRadius: 6,
    gap: padding.xs,
  },
  addSectionButtonText: {
    color: '#FFFFFF',
    fontSize: fontScale(13),
    fontWeight: '600',
  },
  sectionCard: {
    backgroundColor: '#F9F9F9',
    padding: padding.md,
    borderRadius: 8,
    marginBottom: padding.md,
  },
  sectionCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  sectionCardTitle: {
    fontSize: fontScale(14),
    fontWeight: '600',
    color: '#666',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(2),
  },
  switchLabel: {
    fontSize: fontScale(14),
    color: '#666',
  },
  switch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#CCC',
    justifyContent: 'center',
    padding: 2,
  },
  switchActive: {
    backgroundColor: '#4CAF50',
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFF',
  },
  switchThumbActive: {
    alignSelf: 'flex-end',
  },
  saveButton: {
    backgroundColor: '#1A3A69',
    paddingVertical: padding.md,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: hp(2),
    marginBottom: hp(2),
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: fontScale(16),
    fontWeight: '600',
  },
});
