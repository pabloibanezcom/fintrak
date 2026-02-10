'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';
import { PageContainer, PageHeader } from '@/components/layout';
import { CreateCounterpartyModal } from '@/components/modals';
import { Avatar, Button, Card, Icon } from '@/components/primitives';
import {
  type Category,
  type Counterparty,
  categoriesService,
  counterpartiesService,
} from '@/services';
import { toast } from '@/utils';

export default function CounterpartiesPage() {
  const locale = useLocale() as 'en' | 'es';
  const [counterparties, setCounterparties] = useState<Counterparty[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCounterparty, setSelectedCounterparty] =
    useState<Counterparty | null>(null);

  const fetchCounterparties = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch all for now as we don't have server side pagination in UI yet
      const [counterpartiesResponse, categoriesData] = await Promise.all([
        counterpartiesService.search({ limit: 100 }),
        categoriesService.getCategories(),
      ]);
      setCounterparties(counterpartiesResponse.counterparties);
      setCategories(categoriesData);
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

  // Create a map for quick category lookup
  const categoryMap = new Map(categories.map((cat) => [cat.key, cat]));

  return (
    <PageContainer>
      <PageHeader
        title="Counterparties"
        subtitle="Manage people and companies you transact with"
        actions={
          <Button onClick={handleCreateClick} variant="primary">
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
            <Card key={cp.key} className="card-container" padding="sm">
              <Link
                href={`/budget/counterparties/${cp.key}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)',
                  flex: 1,
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <Avatar
                  src={cp.logo}
                  alt={cp.name}
                  fallback={getInitials(cp.name)}
                  size="md"
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span
                    style={{
                      display: 'block',
                      fontWeight: '500',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                    title={cp.name}
                  >
                    {cp.name}
                  </span>
                  {cp.defaultCategory && categoryMap.get(cp.defaultCategory) ? (
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: '0.875rem',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: categoryMap.get(cp.defaultCategory)
                            ?.color,
                        }}
                      />
                      {categoryMap.get(cp.defaultCategory)?.name[locale]}
                    </span>
                  ) : (
                    cp.type && (
                      <span
                        style={{
                          fontSize: '0.875rem',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        {cp.type}
                      </span>
                    )
                  )}
                </div>
              </Link>
              <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.preventDefault();
                    handleEditClick(cp);
                  }}
                  title="Edit"
                >
                  <Icon name="Pen" size={14} />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDeleteClick(cp);
                  }}
                  title="Delete"
                  style={{ color: 'var(--color-error)' }}
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
    </PageContainer>
  );
}
