import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { colors, spacing, typography } from '../styles';
import { componentStyles } from '../styles';

interface ProfileScreenProps {
  onLogout: () => void;
  onBack: () => void;
}

interface MenuItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  badge?: string;
}

export default function ProfileScreen({ onLogout, onBack }: ProfileScreenProps) {
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

  const getFullName = () => {
    if (user?.name && user?.lastName) {
      return `${user.name} ${user.lastName}`;
    }
    if (user?.name) {
      return user.name;
    }
    return 'User';
  };

  const menuItems: MenuItem[] = [
    {
      id: 'personal',
      title: 'Personal Information',
      icon: 'person-outline',
      onPress: () => console.log('Personal Information'),
    },
    {
      id: 'payment',
      title: 'Payment Preferences',
      icon: 'card-outline',
      onPress: () => console.log('Payment Preferences'),
    },
    {
      id: 'banks',
      title: 'Banks and Cards',
      icon: 'wallet-outline',
      onPress: () => console.log('Banks and Cards'),
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: 'notifications-outline',
      onPress: () => console.log('Notifications'),
    },
    {
      id: 'messages',
      title: 'Message Center',
      icon: 'chatbubble-outline',
      onPress: () => console.log('Message Center'),
    },
    {
      id: 'address',
      title: 'Address',
      icon: 'location-outline',
      onPress: () => console.log('Address'),
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: 'settings-outline',
      onPress: () => console.log('Settings'),
    },
  ];

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
        <Text style={componentStyles.headerTitle}>Profile</Text>
        <TouchableOpacity
          style={componentStyles.headerButton}
          onPress={() => console.log('Edit profile')}
        >
          <Ionicons name="create-outline" size={20} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          {user?.profilePicture ? (
            <Image
              source={{ uri: user.profilePicture }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Text style={styles.profileInitials}>{getInitials()}</Text>
            </View>
          )}
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{getFullName()}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <View key={item.id}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemLeft}>
                  <View style={styles.iconContainer}>
                    <Ionicons name={item.icon} size={22} color={colors.text.secondary} />
                  </View>
                  <Text style={styles.menuItemText}>{item.title}</Text>
                </View>
                <View style={styles.menuItemRight}>
                  {item.badge && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{item.badge}</Text>
                    </View>
                  )}
                  <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
                </View>
              </TouchableOpacity>
              {index < menuItems.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={onLogout}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={22} color="#EB0A24" />
          <Text style={styles.logoutText}>Sign Out</Text>
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
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: spacing.base,
  },
  profileImagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  profileInitials: {
    fontSize: 24,
    fontWeight: typography.weights.semiBold,
    color: colors.text.inverse,
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 17,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  menuContainer: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.base,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.base,
  },
  menuItemText: {
    fontSize: 14,
    color: colors.text.primary,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#EB0A24',
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 11,
    color: colors.text.inverse,
    fontWeight: typography.weights.regular,
  },
  divider: {
    height: 1,
    backgroundColor: '#232533',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xxl,
    paddingVertical: spacing.base,
    borderRadius: 8,
    backgroundColor: colors.background.secondary,
  },
  logoutText: {
    fontSize: 14,
    color: '#EB0A24',
    marginLeft: spacing.sm,
    fontWeight: typography.weights.medium,
  },
});
