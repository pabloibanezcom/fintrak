'use client';

import { useLocale } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';
import { CounterpartyCard } from '@/components/data-display';
import { PageContainer, PageHeader } from '@/components/layout';
import { CreateCounterpartyModal } from '@/components/modals';
import { Button, Icon } from '@/components/primitives';
import {
  type Counterparty,
  counterpartiesService,
} from '@/services';
import { toast } from '@/utils';

export default function CounterpartiesPage() {
  const locale = useLocale() as 'en' | 'es';
  const [counterparties, setCounterparties] = useState<Counterparty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCounterparties = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch all for now as we don't have server side pagination in UI yet
      const counterpartiesResponse = await counterpartiesService.search({
        limit: 100,
      });
      setCounterparties(counterpartiesResponse.counterparties);
    } catch (error) {
      console.error('Failed to fetch counterparties:', error);
      toast.error('Failed to load counterparties');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCounterparties();
  }, [fetchCounterparties]);

  const handleCreateClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSuccess = () => {
    fetchCounterparties();
  };

  return (
    <PageContainer>
      <PageHeader
        title="Counterparties"
        subtitle="Manage people and companies you transact with"
        actions={
          <Button onClick={handleCreateClick} variant="ghost" size="sm">
            <Icon name="Plus" size={16} />
            <span>Add Counterparty</span>
          </Button>
        }
      />

      {isLoading ? (
        <div
          className="flex-col"
          style={{ alignItems: 'center', padding: '2rem' }}
        >
          Loading...
        </div>
      ) : counterparties.length === 0 ? (
        <div
          className="flex-col"
          style={{ alignItems: 'center', padding: '2rem' }}
        >
          No counterparties found.
        </div>
      ) : (
        <div className="grid-auto">
          {counterparties.map((cp) => (
            <CounterpartyCard key={cp.key} counterparty={cp} locale={locale} />
          ))}
        </div>
      )}

      <CreateCounterpartyModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        counterparty={null}
        onSuccess={handleSuccess}
      />
    </PageContainer>
  );
}
