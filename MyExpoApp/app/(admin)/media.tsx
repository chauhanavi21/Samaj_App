import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Stack } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { adminAPI } from '@/services/api';
import { wp, hp, fontScale, padding } from '@/utils/responsive';

export default function AdminMedia() {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    // Request permissions
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please grant permission to access photos');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      uploadImage(result.assets[0].uri);
    }
  };

  const takePicture = async () => {
    // Request permissions
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please grant permission to use camera');
      return;
    }

    // Launch camera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string) => {
    setUploading(true);
    try {
      // Create FormData
      const formData = new FormData();
      const filename = uri.split('/').pop() || 'image.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('image', {
        uri,
        name: filename,
        type,
      } as any);

      // Upload
      const response = await adminAPI.uploadImage(formData);
      
      if (response.success) {
        Alert.alert('Success', 'Image uploaded successfully');
        setUploadedImages([response.data.imageUrl, ...uploadedImages]);
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      Alert.alert('Error', err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = async (url: string) => {
    await Clipboard.setStringAsync(url);
    Alert.alert('Copied', 'Image URL copied to clipboard');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Media Upload', headerShown: false }} />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Media Upload</Text>
          <Text style={styles.headerSubtitle}>Upload and manage images</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Upload Buttons */}
        <View style={styles.uploadSection}>
          <TouchableOpacity
            onPress={pickImage}
            style={styles.uploadButton}
            disabled={uploading}
          >
            <MaterialIcons name="photo-library" size={32} color="#1A3A69" />
            <Text style={styles.uploadButtonText}>Choose from Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={takePicture}
            style={styles.uploadButton}
            disabled={uploading}
          >
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

        {/* Upload Guidelines */}
        <View style={styles.guidelinesCard}>
          <Text style={styles.guidelinesTitle}>
            <MaterialIcons name="info" size={16} /> Upload Guidelines
          </Text>
          <Text style={styles.guidelineText}>• Max file size: 5MB</Text>
          <Text style={styles.guidelineText}>• Supported formats: JPEG, PNG, GIF, WebP</Text>
          <Text style={styles.guidelineText}>• Images are optimized automatically</Text>
          <Text style={styles.guidelineText}>• Copy URL to use in Content Management</Text>
        </View>

        {/* Uploaded Images */}
        {uploadedImages.length > 0 && (
          <View style={styles.imagesSection}>
            <Text style={styles.sectionTitle}>Recently Uploaded</Text>
            {uploadedImages.map((url, index) => (
              <View key={index} style={styles.imageCard}>
                <Image
                  source={{ uri: `https://samaj-app-api.onrender.com${url}` }}
                  style={styles.imagePreview}
                  resizeMode="cover"
                />
                <View style={styles.imageInfo}>
                  <Text style={styles.imageUrl} numberOfLines={1}>
                    {url}
                  </Text>
                  <TouchableOpacity
                    onPress={() => copyToClipboard(url)}
                    style={styles.copyButton}
                  >
                    <MaterialIcons name="content-copy" size={18} color="#1A3A69" />
                    <Text style={styles.copyButtonText}>Copy URL</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Instructions */}
        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>How to Use</Text>
          <View style={styles.instructionStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.stepText}>
              Upload an image using "Choose from Gallery" or "Take Photo"
            </Text>
          </View>
          <View style={styles.instructionStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepText}>
              Once uploaded, the image URL will appear below
            </Text>
          </View>
          <View style={styles.instructionStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepText}>
              Tap "Copy URL" to copy the image path
            </Text>
          </View>
          <View style={styles.instructionStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>4</Text>
            </View>
            <Text style={styles.stepText}>
              Paste the URL in Content Management section images
            </Text>
          </View>
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
  imageUrl: {
    fontSize: fontScale(12),
    color: '#666',
    backgroundColor: '#F5F5F5',
    padding: padding.sm,
    borderRadius: 6,
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
