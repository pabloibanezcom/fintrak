import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import StatisticsScreen from '../../screens/StatisticsScreen';
import { useSession } from '../../context/SessionContext';
import { colors } from '../../styles';

export default function StatisticsTab() {
  const router = useRouter();
  const { signOut } = useSession();

  const navigateToProfile = () => {
    router.push('/profile');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }} edges={['top']}>
      <StatisticsScreen
        onLogout={signOut}
        onNavigateToProfile={navigateToProfile}
      />
    </SafeAreaView>
  );
}
