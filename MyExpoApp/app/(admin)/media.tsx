import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  TextInput,
  RefreshControl,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Stack } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { API_BASE_URL } from '@/config/api';
import { adminAPI } from '@/services/api';
import { wp, hp, fontScale, padding } from '@/utils/responsive';

type GalleryItem = {
  id?: string;
  _id?: string;
  title?: string;
  imageUrl?: string;
  order?: number;
  isActive?: boolean;
};

function getApiOrigin() {
  return API_BASE_URL.replace(/\/api\/?$/, '');
}

function toAbsoluteUrl(imageUrl: string) {
  const trimmed = String(imageUrl || '').trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const origin = getApiOrigin();
  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${origin}${path}`;
}

export default function AdminMedia() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const visibleItems = useMemo(
    () => (galleryItems || []).filter((x) => x && String(x.imageUrl || '').trim()),
    [galleryItems]
  );

  const loadGallery = async (mode: 'initial' | 'refresh') => {
    try {
      if (mode === 'initial') setLoadingList(true);
      const response = await adminAPI.getGalleryImages({ page: 1, limit: 200 });
      setGalleryItems(response?.data ?? []);
    } catch (err: any) {
      console.error('Load gallery images error:', err?.response?.data || err?.message || err);
      setGalleryItems([]);
    } finally {
      setLoadingList(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadGallery('initial');
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadGallery('refresh');
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please grant permission to access photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.6,
    });

    if (!result.canceled && result.assets[0]) {
      uploadImage(result.assets[0].uri);
    }
  };

  const takePicture = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please grant permission to use camera');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.6,
    });

    if (!result.canceled && result.assets[0]) {
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string) => {
    setUploading(true);
    try {
      const formData = new FormData();
      const filename = uri.split('/').pop() || 'image.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('image', {
        uri,
        name: filename,
        type,
      } as any);

      const response = await adminAPI.uploadImage(formData);
      if (!response?.success) {
        throw new Error(response?.message || 'Upload failed');
      }

      const imageUrl = response?.data?.imageUrl || response?.data?.url;
      if (!imageUrl) {
        throw new Error('Upload succeeded but no image URL was returned');
      }

      await adminAPI.createGalleryImage({
        imageUrl,
        title: newTitle.trim(),
      });

      setNewTitle('');
      Alert.alert('Success', 'Gallery image added successfully');
      loadGallery('refresh');
    } catch (err: any) {
      console.error('Upload error:', err);
      Alert.alert('Error', err?.response?.data?.message || err?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = async (url: string) => {
    await Clipboard.setStringAsync(url);
    Alert.alert('Copied', 'Image URL copied to clipboard');
  };

  const confirmDelete = (item: GalleryItem) => {
    const itemId = (item.id || item._id || '').toString();
    if (!itemId) {
      Alert.alert('Error', 'Missing gallery item id');
      return;
    }

    Alert.alert('Delete', 'Remove this image from the gallery?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await adminAPI.deleteGalleryImage(itemId);
            loadGallery('refresh');
          } catch (err: any) {
            Alert.alert('Error', err?.response?.data?.message || 'Failed to delete');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Media Upload', headerShown: false }} />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Gallery</Text>
          <Text style={styles.headerSubtitle}>Upload and manage gallery images</Text>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleInputCard}>
          <Text style={styles.titleInputLabel}>Title (optional)</Text>
          <TextInput
            style={styles.titleInput}
            placeholder="e.g., Community Gathering"
            value={newTitle}
            onChangeText={setNewTitle}
          />
        </View>

        <View style={styles.uploadSection}>
          <TouchableOpacity onPress={pickImage} style={styles.uploadButton} disabled={uploading}>
            <MaterialIcons name="photo-library" size={32} color="#1A3A69" />
            <Text style={styles.uploadButtonText}>Choose from Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={takePicture} style={styles.uploadButton} disabled={uploading}>
            <MaterialIcons name="camera-alt" size={32} color="#1A3A69" />
            <Text style={styles.uploadButtonText}>Take Photo</Text>
          </TouchableOpacity>
        </View>

        {uploading && (
          <View style={styles.uploadingContainer}>
            <ActivityIndicator size="large" color="#1A3A69" />
            <Text style={styles.uploadingText}>Uploading...</Text>
          </View>
        )}

        <View style={styles.guidelinesCard}>
          <Text style={styles.guidelinesTitle}>
            <MaterialIcons name="info" size={16} /> Upload Guidelines
          </Text>
          <Text style={styles.guidelineText}>• Max file size: 2MB</Text>
          <Text style={styles.guidelineText}>• Supported formats: JPEG, PNG, GIF, WebP</Text>
          <Text style={styles.guidelineText}>• Keep images small for Firestore free tier</Text>
        </View>

        <View style={styles.imagesSection}>
          <Text style={styles.sectionTitle}>Gallery Images</Text>

          {loadingList && (
            <View style={styles.uploadingContainer}>
              <ActivityIndicator size="large" color="#1A3A69" />
              <Text style={styles.uploadingText}>Loading...</Text>
            </View>
          )}

          {!loadingList && visibleItems.length === 0 && (
            <Text style={styles.emptyText}>No gallery images yet.</Text>
          )}

          {visibleItems.map((item, index) => {
            const key = (item.id || item._id || String(index)).toString();
            const url = String(item.imageUrl || '').trim();
            const previewUri = toAbsoluteUrl(url);
            const title = String(item.title || '').trim();

            return (
              <View key={key} style={styles.imageCard}>
                <Image source={{ uri: previewUri }} style={styles.imagePreview} resizeMode="cover" />
                <View style={styles.imageInfo}>
                  {!!title && (
                    <Text style={styles.imageTitleText} numberOfLines={1}>
                      {title}
                    </Text>
                  )}

                  <Text style={styles.imageUrl} numberOfLines={1}>
                    {url}
                  </Text>

                  <View style={styles.imageButtonsRow}>
                    <TouchableOpacity onPress={() => copyToClipboard(url)} style={styles.copyButton}>
                      <MaterialIcons name="content-copy" size={18} color="#1A3A69" />
                      <Text style={styles.copyButtonText}>Copy URL</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => confirmDelete(item)} style={styles.deleteButton}>
                      <MaterialIcons name="delete" size={18} color="#B00020" />
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#1A3A69',
    paddingHorizontal: padding.lg,
    paddingTop: hp(6),
    paddingBottom: hp(2),
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
  content: {
    flex: 1,
    paddingHorizontal: padding.md,
  },
  titleInputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: padding.md,
    marginTop: hp(2),
  },
  titleInputLabel: {
    fontSize: fontScale(12),
    color: '#666',
    marginBottom: hp(0.6),
  },
  titleInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: padding.md,
    paddingVertical: hp(1.2),
    fontSize: fontScale(14),
    color: '#333',
  },
  uploadSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(2),
    gap: padding.md,
  },
  uploadButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: padding.xl,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#1A3A69',
    borderStyle: 'dashed',
  },
  uploadButtonText: {
    marginTop: hp(1),
    fontSize: fontScale(14),
    fontWeight: '600',
    color: '#1A3A69',
    textAlign: 'center',
  },
  uploadingContainer: {
    backgroundColor: '#FFFFFF',
    marginTop: hp(2),
    padding: padding.xl,
    borderRadius: 12,
    alignItems: 'center',
  },
  uploadingText: {
    marginTop: hp(1),
    fontSize: fontScale(14),
    color: '#666',
  },
  guidelinesCard: {
    backgroundColor: '#E3F2FD',
    marginTop: hp(2),
    padding: padding.lg,
    borderRadius: 12,
  },
  guidelinesTitle: {
    fontSize: fontScale(16),
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: hp(1),
  },
  guidelineText: {
    fontSize: fontScale(13),
    color: '#1565C0',
    marginTop: hp(0.5),
  },
  imagesSection: {
    marginTop: hp(3),
  },
  sectionTitle: {
    fontSize: fontScale(18),
    fontWeight: '600',
    color: '#333',
    marginBottom: hp(1.5),
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    paddingVertical: padding.md,
  },
  imageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: padding.md,
    marginBottom: padding.md,
    flexDirection: 'row',
    gap: padding.md,
  },
  imagePreview: {
    width: wp(25),
    height: wp(25),
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  },
  imageInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  imageTitleText: {
    fontSize: fontScale(14),
    fontWeight: '700',
    color: '#1A3A69',
    marginBottom: hp(0.5),
  },
  imageUrl: {
    fontSize: fontScale(12),
    color: '#666',
    backgroundColor: '#F5F5F5',
    padding: padding.sm,
    borderRadius: 6,
  },
  imageButtonsRow: {
    flexDirection: 'row',
    gap: padding.sm,
    flexWrap: 'wrap',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingVertical: padding.sm,
    paddingHorizontal: padding.md,
    borderRadius: 6,
    gap: padding.xs,
    alignSelf: 'flex-start',
  },
  copyButtonText: {
    fontSize: fontScale(13),
    fontWeight: '600',
    color: '#1A3A69',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F0',
    paddingVertical: padding.sm,
    paddingHorizontal: padding.md,
    borderRadius: 6,
    gap: padding.xs,
    alignSelf: 'flex-start',
  },
  deleteButtonText: {
    fontSize: fontScale(13),
    fontWeight: '600',
    color: '#B00020',
  },
  instructionsCard: {
    backgroundColor: '#FFFFFF',
    marginTop: hp(3),
    marginBottom: hp(3),
    padding: padding.xl,
    borderRadius: 12,
  },
  instructionsTitle: {
    fontSize: fontScale(18),
    fontWeight: '600',
    color: '#333',
    marginBottom: hp(2),
  },
  instructionStep: {
    flexDirection: 'row',
    marginBottom: hp(1.5),
    gap: padding.md,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1A3A69',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: fontScale(14),
    fontWeight: '600',
  },
  stepText: {
    flex: 1,
    fontSize: fontScale(14),
    color: '#666',
    lineHeight: fontScale(20),
  },
});
