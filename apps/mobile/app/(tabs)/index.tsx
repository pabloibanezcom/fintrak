import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import UserProfile from '../../components/UserProfile';
import { componentStyles, colors } from '../../styles';
import { useUser } from '../../context/UserContext';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useUser();
  const displayName = user?.name && user?.lastName
    ? `${user.name} ${user.lastName}`
    : user?.name || user?.email || 'User';

  const navigateToProfile = () => {
    router.push('/profile');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }} edges={['top']}>
      <View style={componentStyles.homeContainer}>
      {/* Header with User Profile */}
      <View style={componentStyles.headerContainer}>
        <View style={componentStyles.welcomeSection}>
          <Text style={componentStyles.welcomeSubtext}>Welcome back,</Text>
          <Text style={componentStyles.welcomeName}>{displayName}</Text>
        </View>
        <UserProfile onPress={navigateToProfile} />
      </View>

      <ScrollView
        style={componentStyles.homeScrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={componentStyles.homeContent}>

          {/* Balance Section */}
          <View style={componentStyles.homeSection}>
            <Text style={componentStyles.homeSectionTitle}>Total Balance</Text>
            <View style={componentStyles.homeCard}>
              <Text style={componentStyles.homeCardTitle}>Current Balance</Text>
              <Text style={componentStyles.homeCardAmount}>€2,847.50</Text>
              <Text style={componentStyles.homeCardSubtext}>+€127.30 this month</Text>
            </View>
          </View>

          {/* Quick Stats Section */}
          <View style={componentStyles.homeSection}>
            <Text style={componentStyles.homeSectionTitle}>This Month</Text>
            <View style={componentStyles.homeCard}>
              <Text style={componentStyles.homeCardTitle}>Income</Text>
              <Text style={componentStyles.homeCardAmount}>€3,200.00</Text>
            </View>
            <View style={componentStyles.homeCard}>
              <Text style={componentStyles.homeCardTitle}>Expenses</Text>
              <Text style={componentStyles.homeCardAmount}>€1,480.50</Text>
            </View>
          </View>

        </View>
      </ScrollView>
      </View>
    </SafeAreaView>
  );
}
