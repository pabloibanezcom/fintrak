import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import InvestmentsScreen from '../../screens/InvestmentsScreen';
import { useSession } from '../../context/SessionContext';
import { colors } from '../../styles';

export default function InvestmentsTab() {
  const router = useRouter();
  const { signOut } = useSession();

  const navigateToProfile = () => {
    router.push('/profile');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }} edges={['top']}>
      <InvestmentsScreen
        onLogout={signOut}
        onNavigateToProfile={navigateToProfile}
      />
    </SafeAreaView>
  );
}
