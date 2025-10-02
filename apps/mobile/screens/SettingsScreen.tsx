import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import UserProfile from '../components/UserProfile';
import { componentStyles } from '../styles';
import { useTheme } from '../context/ThemeContext';

interface SettingsScreenProps {
  onLogout: () => void;
  onNavigateToProfile: () => void;
}

export default function SettingsScreen({ onLogout, onNavigateToProfile }: SettingsScreenProps) {
  const { theme } = useTheme();

  return (
    <View style={componentStyles.homeContainer}>
      {/* Header with User Profile */}
      <View style={componentStyles.headerContainer}>
        <View style={{ width: 42 }} />
        <Text style={componentStyles.headerTitle}>Settings</Text>
        <UserProfile onPress={onNavigateToProfile} />
      </View>

      <ScrollView
        style={componentStyles.homeScrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={componentStyles.homeContent}>

          {/* Account Section */}
          <View style={componentStyles.homeSection}>
            <Text style={componentStyles.homeSectionTitle}>Account</Text>
            <View style={componentStyles.homeCard}>
              <Text style={componentStyles.homeCardTitle}>Profile Settings</Text>
              <Text style={componentStyles.homeCardSubtext}>Manage your personal information</Text>
            </View>
            <View style={componentStyles.homeCard}>
              <Text style={componentStyles.homeCardTitle}>Security</Text>
              <Text style={componentStyles.homeCardSubtext}>Password and authentication</Text>
            </View>
          </View>

          {/* App Settings Section */}
          <View style={componentStyles.homeSection}>
            <Text style={componentStyles.homeSectionTitle}>App Settings</Text>
            <View style={componentStyles.homeCard}>
              <Text style={componentStyles.homeCardTitle}>Notifications</Text>
              <Text style={componentStyles.homeCardSubtext}>Manage notification preferences</Text>
            </View>
            <View style={componentStyles.homeCard}>
              <Text style={componentStyles.homeCardTitle}>Currency</Text>
              <Text style={componentStyles.homeCardSubtext}>Default: Euro (€)</Text>
            </View>
          </View>

          {/* Logout Section */}
          <View style={componentStyles.homeSection}>
            <TouchableOpacity
              style={componentStyles.homeCard}
              onPress={onLogout}
              activeOpacity={0.7}
            >
              <View style={componentStyles.transactionItem}>
                <View style={componentStyles.transactionIconContainer}>
                  <Ionicons
                    name="log-out-outline"
                    style={componentStyles.transactionIcon}
                    color={theme.colors.text.primary}
                  />
                </View>
                <View style={componentStyles.transactionContent}>
                  <Text style={componentStyles.homeCardTitle}>Sign Out</Text>
                  <Text style={componentStyles.homeCardSubtext}>Log out of your account</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}