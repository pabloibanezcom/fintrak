'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button, Card, CreateCounterpartyModal, Icon, Avatar } from '@/components/ui';
import { type Counterparty, counterpartiesService } from '@/services';
import { toast } from '@/utils';
import styles from './page.module.css';

export default function CounterpartiesPage() {
  const [counterparties, setCounterparties] = useState<Counterparty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCounterparty, setSelectedCounterparty] =
    useState<Counterparty | null>(null);

  const fetchCounterparties = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch all for now as we don't have server side pagination in UI yet
      const response = await counterpartiesService.search({ limit: 100 });
      setCounterparties(response.counterparties);
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
    setSelectedCounterparty(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (counterparty: Counterparty) => {
    setSelectedCounterparty(counterparty);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (counterparty: Counterparty) => {
    if (
      !confirm(
        `Are you sure you want to delete ${counterparty.name}? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await counterpartiesService.delete(counterparty.key);
      toast.success('Counterparty deleted successfully');
      fetchCounterparties();
    } catch (error) {
      console.error('Failed to delete counterparty:', error);
      toast.error('Failed to delete counterparty');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCounterparty(null);
  };

  const handleSuccess = () => {
    fetchCounterparties();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Counterparties</h1>
        <p className={styles.subtitle}>
          Manage people and companies you transact with
        </p>
      </div>

      <div className={styles.actions}>
        <Button onClick={handleCreateClick} variant="primary">
          <Icon name="Plus" size={16} />
          <span>Add Counterparty</span>
        </Button>
      </div>

      {isLoading ? (
        <div className={styles.loader}>Loading...</div>
      ) : counterparties.length === 0 ? (
        <div className={styles.empty}>No counterparties found.</div>
      ) : (
        <div className={styles.grid}>
          {counterparties.map((cp) => (
            <Card key={cp.key} className={styles.card} padding="sm">
              <Avatar
                src={cp.logo}
                alt={cp.name}
                fallback={getInitials(cp.name)}
                size="md"
              />
              <div className={styles.cardInfo}>
                <span className={styles.cardName} title={cp.name}>
                  {cp.name}
                </span>
                <span className={styles.cardType}>{cp.type}</span>
              </div>
              <div className={styles.cardActions}>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEditClick(cp)}
                  title="Edit"
                >
                  <Icon name="Pen" size={14} />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className={styles.deleteBtn}
                  onClick={() => handleDeleteClick(cp)}
                  title="Delete"
                >
                  <Icon name="Trash" size={14} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <CreateCounterpartyModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        counterparty={selectedCounterparty}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
