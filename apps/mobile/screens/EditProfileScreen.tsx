import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { useUser } from '../context/UserContext';
import { apiService } from '../services/api';
import { colors, spacing, typography } from '../styles';
import { componentStyles } from '../styles';

interface EditProfileScreenProps {
  onBack: () => void;
  onSave: (userData: UserData) => void;
}

interface UserData {
  name: string;
  lastName: string;
  email: string;
}

export default function EditProfileScreen({ onBack, onSave }: EditProfileScreenProps) {
  const { user } = useUser();

  const [formData, setFormData] = useState<UserData>({
    name: user?.name || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const getInitials = () => {
    if (user?.name && user?.lastName) {
      return `${user.name.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    if (user?.name) {
      return user.name.substring(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const getFullName = () => {
    if (user?.name && user?.lastName) {
      return `${user.name} ${user.lastName}`;
    }
    if (user?.name) {
      return user.name;
    }
    return 'User';
  };

  const uploadImage = async (imageUri: string) => {
    try {
      // Resize image to smaller size (max 400x400 for profile pictures)
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: 400, height: 400 } }],
        { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
      );

      imageUri = manipulatedImage.uri;
      setSelectedImage(imageUri);

      // Convert image to base64 using new File API
      const file = new FileSystem.File(imageUri);
      const base64 = await file.base64();

      // Double check file size (base64 is roughly 1.33x the original size)
      const sizeInMB = (base64.length * 0.75) / (1024 * 1024);
      if (sizeInMB > 5) {
        Alert.alert('Image too large', 'Image is still too large after compression. Please try a different image.');
        setSelectedImage(null);
        return;
      }

      const base64Image = `data:image/jpeg;base64,${base64}`;

      // Upload to server
      await apiService.updateProfilePicture(base64Image);
      Alert.alert('Success', 'Profile picture updated successfully');
    } catch (error) {
      console.error('Failed to upload image:', error);
      Alert.alert('Error', 'Failed to upload profile picture. Please try again.');
      setSelectedImage(null);
    }
  };

  const pickImage = async () => {
    Alert.alert(
      'Change Profile Picture',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();

            if (status !== 'granted') {
              Alert.alert('Permission needed', 'Sorry, we need camera permissions to take a photo.');
              return;
            }

            const result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.5,
            });

            if (!result.canceled && result.assets[0]) {
              await uploadImage(result.assets[0].uri);
            }
          },
        },
        {
          text: 'Choose from Library',
          onPress: async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
              Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to choose a photo.');
              return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ['images'],
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.5,
            });

            if (!result.canceled && result.assets[0]) {
              await uploadImage(result.assets[0].uri);
            }
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={componentStyles.headerContainer}>
        <TouchableOpacity
          style={componentStyles.headerButton}
          onPress={onBack}
        >
          <Text style={componentStyles.headerButtonIcon}>←</Text>
        </TouchableOpacity>
        <Text style={componentStyles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
            {selectedImage || user?.profilePicture ? (
              <Image
                source={{ uri: selectedImage || user.profilePicture }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Text style={styles.profileInitials}>{getInitials()}</Text>
              </View>
            )}
            <View style={styles.cameraIconContainer}>
              <Ionicons name="camera" size={20} color={colors.text.inverse} />
            </View>
          </TouchableOpacity>
          <Text style={styles.profileName}>{getFullName()}</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Name */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Name</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={22} color={colors.text.secondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Enter name"
                placeholderTextColor={colors.text.secondary}
              />
            </View>
            <View style={styles.divider} />
          </View>

          {/* Last Name */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Last Name</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={22} color={colors.text.secondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={formData.lastName}
                onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                placeholder="Enter last name"
                placeholderTextColor={colors.text.secondary}
              />
            </View>
            <View style={styles.divider} />
          </View>

          {/* Email Address */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Email Address</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={22} color={colors.text.secondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                placeholder="Enter email address"
                placeholderTextColor={colors.text.secondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.divider} />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          activeOpacity={0.7}
        >
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
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
  profileHeader: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.base,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: spacing.base,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  profileImagePlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary[500],
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.background.primary,
  },
  profileInitials: {
    fontSize: 32,
    fontWeight: typography.weights.semiBold,
    color: colors.text.inverse,
  },
  profileName: {
    fontSize: 17,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
    marginBottom: 4,
  },
  formContainer: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  fieldContainer: {
    marginBottom: spacing.xl,
  },
  fieldLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  inputIcon: {
    marginRight: spacing.base,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.text.primary,
    padding: 0,
  },
  divider: {
    height: 1,
    backgroundColor: '#232533',
    marginTop: spacing.sm,
  },
  saveButton: {
    backgroundColor: colors.primary[500],
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xxl,
    paddingVertical: spacing.base,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 14,
    color: colors.text.inverse,
    fontWeight: typography.weights.medium,
  },
});
