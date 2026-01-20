import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import TransactionDetailScreen from '../../screens/TransactionDetailScreen';
import type { Expense, Counterparty } from '@fintrak/types';

export default function TransactionDetailRoute() {
  const router = useRouter();
  const { id, transactionData, selectedDate } = useLocalSearchParams<{
    id: string;
    transactionData?: string;
    selectedDate?: string;
  }>();

  const [transaction, setTransaction] = useState<Expense | null>(null);

  useEffect(() => {
    if (transactionData) {
      try {
        const parsed = JSON.parse(transactionData);
        setTransaction(parsed);
      } catch (error) {
        console.error('Failed to parse transaction data:', error);
      }
    }
  }, [transactionData]);

  const handleBack = () => {
    router.back();
  };

  const navigateToProfile = () => {
    router.push('/profile');
  };

  const navigateToCounterpartyDetail = (counterparty: Counterparty) => {
    router.push({
      pathname: '/counterparty/[key]',
      params: {
        key: counterparty.key,
        counterpartyData: JSON.stringify(counterparty),
        transactionData: transactionData,
      },
    });
  };

  if (!transaction) {
    return null;
  }

  return (
    <TransactionDetailScreen
      transaction={transaction}
      onBack={handleBack}
      onNavigateToProfile={navigateToProfile}
      onNavigateToCounterpartyDetail={navigateToCounterpartyDetail}
    />
  );
}
