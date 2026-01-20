import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import CounterpartyDetailScreen from '../../screens/CounterpartyDetailScreen';
import type { Counterparty } from '@fintrak/types';

export default function CounterpartyDetailRoute() {
  const router = useRouter();
  const { key, counterpartyData, transactionData } = useLocalSearchParams<{
    key: string;
    counterpartyData?: string;
    transactionData?: string;
  }>();

  const [counterparty, setCounterparty] = useState<Counterparty | null>(null);

  useEffect(() => {
    if (counterpartyData) {
      try {
        const parsed = JSON.parse(counterpartyData);
        setCounterparty(parsed);
      } catch (error) {
        console.error('Failed to parse counterparty data:', error);
      }
    }
  }, [counterpartyData]);

  const handleBack = () => {
    router.back();
  };

  const navigateToProfile = () => {
    router.push('/profile');
  };

  const handleUpdate = (updatedCounterparty: Counterparty) => {
    setCounterparty(updatedCounterparty);
  };

  if (!counterparty) {
    return null;
  }

  return (
    <CounterpartyDetailScreen
      counterparty={counterparty}
      onBack={handleBack}
      onNavigateToProfile={navigateToProfile}
      onUpdate={handleUpdate}
    />
  );
}
