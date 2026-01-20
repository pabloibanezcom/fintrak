import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import MonthlySummaryScreen from '../../screens/MonthlySummaryScreen';
import { useSession } from '../../context/SessionContext';
import { colors } from '../../styles';
import type { Expense } from '@fintrak/types';

export default function ExpensesTab() {
  const router = useRouter();
  const { signOut } = useSession();

  const navigateToProfile = () => {
    router.push('/profile');
  };

  const navigateHome = () => {
    router.push('/(tabs)');
  };

  const navigateToTransactionDetail = (transaction: Expense, selectedDate?: Date) => {
    router.push({
      pathname: '/transaction/[id]',
      params: {
        id: transaction.id,
        transactionData: JSON.stringify(transaction),
        selectedDate: selectedDate?.toISOString(),
      },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }} edges={['top']}>
      <MonthlySummaryScreen
        onLogout={signOut}
        onNavigateHome={navigateHome}
        onNavigateToProfile={navigateToProfile}
        onNavigateToTransactionDetail={navigateToTransactionDetail}
      />
    </SafeAreaView>
  );
}
