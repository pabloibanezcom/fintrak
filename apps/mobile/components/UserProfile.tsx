import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { useUser } from '../context/UserContext';
import { colors, typography } from '../styles';

interface UserProfileProps {
  onPress: () => void;
}

export default function UserProfile({ onPress }: UserProfileProps) {
  const { user } = useUser();

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

  return (
    <TouchableOpacity
      style={styles.profileButton}
      onPress={onPress}
      testID="user-profile-button"
    >
      {user?.profilePicture ? (
        <Image
          source={{ uri: user.profilePicture }}
          style={styles.profileImage}
          testID="profile-image"
        />
      ) : (
        <View style={styles.initialsContainer} testID="profile-initials">
          <Text style={styles.initialsText}>{getInitials()}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  profileButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    overflow: 'hidden',
  },
  profileImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  initialsContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semiBold,
    color: colors.text.inverse,
  },
});
