import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import type { Counterparty } from '@fintrak/types';
import { commonStyles, componentStyles, colors, spacing, typography } from '../styles';
import UserProfile from '../components/UserProfile';
import { uploadMedia, updateCounterparty, getCounterparty } from '../services/api';

/**
 * Counterparty Detail Screen
 *
 * Comprehensive view and edit interface for counterparty (payee/vendor) details.
 * Supports viewing, editing, and uploading logos via S3 media storage.
 *
 * Features:
 * - View mode: Display all counterparty information
 * - Edit mode: Inline editing of all fields
 * - Logo upload: Image picker with S3 upload integration
 * - Type selector: Choose between company, person, institution, other
 * - Auto-save: Logo uploads save immediately
 * - Loading states: Shows spinners during fetch and upload operations
 * - Error handling: Displays error messages and retry options
 *
 * @example
 * // Basic usage
 * <CounterpartyDetailScreen
 *   counterparty={selectedCounterparty}
 *   onBack={() => navigateBack()}
 *   onNavigateToProfile={() => showProfile()}
 *   onUpdate={(updated) => refreshCounterpartyData(updated)}
 * />
 *
 * @component
 * @requires expo-image-picker - For logo upload functionality
 * @requires S3 service - Backend must have /api/upload/media endpoint
 */
interface CounterpartyDetailScreenProps {
  /** Initial counterparty data - full details fetched on mount */
  counterparty: Counterparty;

  /** Callback when user navigates back */
  onBack: () => void;

  /** Callback when user taps profile avatar */
  onNavigateToProfile: () => void;

  /** Optional callback when counterparty is updated (for parent state refresh) */
  onUpdate?: (updatedCounterparty: Counterparty) => void;
}

export default function CounterpartyDetailScreen({
  counterparty,
  onBack,
  onNavigateToProfile,
  onUpdate,
}: CounterpartyDetailScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [editedData, setEditedData] = useState<Counterparty>({
    ...counterparty,
  });

  // Fetch full counterparty details on mount
  useEffect(() => {
    const fetchCounterpartyDetails = async () => {
      try {
        setIsLoading(true);
        const fullData = await getCounterparty(counterparty.key);
        setEditedData(fullData);
        setLoadError(null);
      } catch (error) {
        console.error('Error fetching counterparty:', error);
        setLoadError('Failed to load counterparty details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCounterpartyDetails();
  }, [counterparty.key]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updated = await updateCounterparty(counterparty.key, editedData);
      setIsEditing(false);
      if (onUpdate) {
        onUpdate(updated);
      }
      Alert.alert('Success', 'Counterparty updated successfully');
    } catch (error) {
      console.error('Error updating counterparty:', error);
      Alert.alert('Error', 'Failed to update counterparty');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedData({ ...counterparty });
    setIsEditing(false);
  };

  const handlePickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please allow access to your photo library');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadImageToServer(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const uploadImageToServer = async (imageUri: string) => {
    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      const filename = imageUri.split('/').pop() || 'logo.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('file', {
        uri: imageUri,
        name: filename,
        type: type,
      } as any);
      formData.append('type', 'counterparty-logo');

      const response = await uploadMedia(formData);
      const updatedData = { ...editedData, logo: response.url };
      setEditedData(updatedData);

      const updated = await updateCounterparty(counterparty.key, updatedData);
      if (onUpdate) {
        onUpdate(updated);
      }

      Alert.alert('Success', 'Logo uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload logo');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case 'company':
        return 'business';
      case 'person':
        return 'person';
      case 'institution':
        return 'school';
      default:
        return 'help-circle';
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={componentStyles.headerContainer}>
          <TouchableOpacity style={componentStyles.headerButton} onPress={onBack}>
            <Ionicons name="chevron-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={componentStyles.headerTitle}>Counterparty Details</Text>
          <UserProfile onPress={onNavigateToProfile} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loadError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={componentStyles.headerContainer}>
          <TouchableOpacity style={componentStyles.headerButton} onPress={onBack}>
            <Ionicons name="chevron-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={componentStyles.headerTitle}>Counterparty Details</Text>
          <UserProfile onPress={onNavigateToProfile} />
        </View>
        <View style={styles.loadingContainer}>
          <Ionicons name="alert-circle" size={64} color={colors.accent.error} />
          <Text style={styles.errorText}>{loadError}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={onBack}>
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={componentStyles.headerContainer}>
        <TouchableOpacity style={componentStyles.headerButton} onPress={onBack}>
          <Ionicons name="chevron-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={componentStyles.headerTitle}>Counterparty Details</Text>
        <UserProfile onPress={onNavigateToProfile} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            {editedData.logo ? (
              <Image source={{ uri: editedData.logo }} style={styles.logo} />
            ) : (
              <View style={[styles.logo, styles.logoPlaceholder]}>
                <Ionicons name="business" size={48} color={colors.text.secondary} />
              </View>
            )}
            {isUploadingImage && (
              <View style={styles.uploadingOverlay}>
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            )}
            {isEditing && (
              <TouchableOpacity
                style={styles.changeLogoButton}
                onPress={handlePickImage}
                disabled={isUploadingImage}
              >
                <Ionicons name="camera" size={20} color={colors.text.inverse} />
                <Text style={styles.changeLogoText}>Change Logo</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Name</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={editedData.name}
                onChangeText={(text) => setEditedData({ ...editedData, name: text })}
                placeholder="Counterparty name"
                placeholderTextColor={colors.text.secondary}
              />
            ) : (
              <Text style={styles.value}>{editedData.name}</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Type</Text>
            {isEditing ? (
              <View style={styles.typeSelector}>
                {(['company', 'person', 'institution', 'other'] as const).map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeOption,
                      editedData.type === type && styles.typeOptionSelected,
                    ]}
                    onPress={() => setEditedData({ ...editedData, type })}
                  >
                    <Ionicons
                      name={getTypeIcon(type)}
                      size={20}
                      color={editedData.type === type ? colors.primary : colors.text.secondary}
                    />
                    <Text
                      style={[
                        styles.typeOptionText,
                        editedData.type === type && styles.typeOptionTextSelected,
                      ]}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.typeDisplay}>
                <Ionicons
                  name={getTypeIcon(editedData.type)}
                  size={20}
                  color={colors.text.secondary}
                />
                <Text style={styles.value}>
                  {editedData.type
                    ? editedData.type.charAt(0).toUpperCase() + editedData.type.slice(1)
                    : 'Not specified'}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Email</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={editedData.email || ''}
                onChangeText={(text) => setEditedData({ ...editedData, email: text })}
                placeholder="email@example.com"
                placeholderTextColor={colors.text.secondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            ) : (
              <Text style={styles.value}>{editedData.email || 'Not provided'}</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Phone</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={editedData.phone || ''}
                onChangeText={(text) => setEditedData({ ...editedData, phone: text })}
                placeholder="+1 234 567 8900"
                placeholderTextColor={colors.text.secondary}
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.value}>{editedData.phone || 'Not provided'}</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Address</Text>
            {isEditing ? (
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editedData.address || ''}
                onChangeText={(text) => setEditedData({ ...editedData, address: text })}
                placeholder="Street address, city, country"
                placeholderTextColor={colors.text.secondary}
                multiline
                numberOfLines={3}
              />
            ) : (
              <Text style={styles.value}>{editedData.address || 'Not provided'}</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Notes</Text>
            {isEditing ? (
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editedData.notes || ''}
                onChangeText={(text) => setEditedData({ ...editedData, notes: text })}
                placeholder="Additional notes"
                placeholderTextColor={colors.text.secondary}
                multiline
                numberOfLines={4}
              />
            ) : (
              <Text style={styles.value}>{editedData.notes || 'No notes'}</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Title Template</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={editedData.titleTemplate || ''}
                onChangeText={(text) => setEditedData({ ...editedData, titleTemplate: text })}
                placeholder="e.g., Payment to {name}"
                placeholderTextColor={colors.text.secondary}
              />
            ) : (
              <Text style={styles.value}>{editedData.titleTemplate || 'Not set'}</Text>
            )}
          </View>

          <View style={styles.buttonContainer}>
            {isEditing ? (
              <View style={styles.editActions}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleCancel}
                  disabled={isSaving}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.saveButton]}
                  onPress={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <ActivityIndicator size="small" color={colors.text.inverse} />
                  ) : (
                    <Text style={styles.saveButtonText}>Save</Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.button, styles.editButton]}
                onPress={() => setIsEditing(true)}
              >
                <Ionicons name="create-outline" size={20} color={colors.text.inverse} />
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={{ height: spacing.xl }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.md,
  },
  content: {
    paddingHorizontal: spacing.md,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: spacing.xl,
    position: 'relative',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.background.secondary,
  },
  logoPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 60,
    width: 120,
    height: 120,
    alignSelf: 'center',
  },
  changeLogoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: spacing.sm,
  },
  changeLogoText: {
    marginLeft: spacing.xs,
    color: colors.text.inverse,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium as any,
  },
  section: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium as any,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: typography.sizes.md,
    color: colors.text.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border.primary,
    borderRadius: spacing.sm,
    padding: spacing.sm,
    fontSize: typography.sizes.md,
    color: colors.text.primary,
    backgroundColor: colors.background.secondary,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.primary,
    borderRadius: spacing.sm,
    backgroundColor: colors.background.secondary,
  },
  typeOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '20',
  },
  typeOptionText: {
    marginLeft: spacing.xs,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  typeOptionTextSelected: {
    color: colors.primary,
    fontWeight: typography.weights.medium as any,
  },
  typeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  buttonContainer: {
    marginTop: spacing.xl,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: spacing.sm,
  },
  editButton: {
    backgroundColor: colors.primary,
  },
  editButtonText: {
    marginLeft: spacing.xs,
    color: colors.text.inverse,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold as any,
  },
  editActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  cancelButtonText: {
    color: colors.text.primary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold as any,
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  saveButtonText: {
    color: colors.text.inverse,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold as any,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
  },
  errorText: {
    marginTop: spacing.md,
    fontSize: typography.sizes.md,
    color: colors.text.primary,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.primary,
    borderRadius: spacing.sm,
  },
  retryButtonText: {
    color: colors.text.inverse,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold as any,
  },
});
