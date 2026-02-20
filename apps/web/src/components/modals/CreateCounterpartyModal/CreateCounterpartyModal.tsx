'use client';

import { useEffect, useState } from 'react';
import { Modal } from '@/components/modals';
import { Button, Input, Select } from '@/components/primitives';
import {
  type Category,
  type Counterparty,
  type CounterpartyType,
  categoriesService,
  counterpartiesService,
} from '@/services';
import { getLocalizedText, toast } from '@/utils';
import { LogoPicker } from './LogoPicker';
import styles from './CreateCounterpartyModal.module.css';

export interface CreateCounterpartyModalProps {
  isOpen: boolean;
  onClose: () => void;
  counterparty?: Counterparty | null;
  onSuccess?: () => void;
}

export function CreateCounterpartyModal({
  isOpen,
  onClose,
  counterparty,
  onSuccess,
}: CreateCounterpartyModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    type: 'company' as CounterpartyType,
    logo: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
    defaultCategory: '',
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesService.getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (counterparty) {
        setFormData({
          name: counterparty.name,
          type: counterparty.type || 'company',
          logo: counterparty.logo || '',
          email: counterparty.email || '',
          phone: counterparty.phone || '',
          address: counterparty.address || '',
          notes: counterparty.notes || '',
          defaultCategory: counterparty.defaultCategory?.key || '',
        });
      } else {
        setFormData({
          name: '',
          type: 'company',
          logo: '',
          email: '',
          phone: '',
          address: '',
          notes: '',
          defaultCategory: '',
        });
      }
      setError(null);
    }
  }, [isOpen, counterparty]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      setError('Please enter a name');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (counterparty) {
        await counterpartiesService.update(counterparty.key, {
          ...formData,
          logo: formData.logo || undefined,
          email: formData.email || undefined,
          phone: formData.phone || undefined,
          address: formData.address || undefined,
          notes: formData.notes || undefined,
          defaultCategory: formData.defaultCategory || undefined,
        });
        toast.success('Counterparty updated successfully');
      } else {
        await counterpartiesService.create({
          ...formData,
          logo: formData.logo || undefined,
          email: formData.email || undefined,
          phone: formData.phone || undefined,
          address: formData.address || undefined,
          notes: formData.notes || undefined,
          defaultCategory: formData.defaultCategory || undefined,
        });
        toast.success('Counterparty created successfully');
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to save counterparty';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const typeOptions = [
    { value: 'company', label: 'Company' },
    { value: 'person', label: 'Person' },
    { value: 'institution', label: 'Institution' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={counterparty ? 'Edit Counterparty' : 'Create Counterparty'}
      size="md"
    >
      <div className={styles.container}>
        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <LogoPicker
            currentLogo={formData.logo}
            counterpartyName={formData.name}
            onSelect={(url) =>
              setFormData((prev) => ({ ...prev, logo: url }))
            }
            onRemove={() => setFormData((prev) => ({ ...prev, logo: '' }))}
          />

          <Input
            label="Name *"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Counterparty name..."
            disabled={isSubmitting}
          />

          <Select
            label="Type"
            options={typeOptions}
            value={formData.type}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                type: value as CounterpartyType,
              }))
            }
            disabled={isSubmitting}
          />

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="Email address..."
            disabled={isSubmitting}
          />

          <Input
            label="Phone"
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phone: e.target.value }))
            }
            placeholder="Phone number..."
            disabled={isSubmitting}
          />

          <Input
            label="Address"
            value={formData.address}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, address: e.target.value }))
            }
            placeholder="Address..."
            disabled={isSubmitting}
          />

          <Select
            label="Default Category"
            options={[
              { value: '', label: 'None' },
              ...categories.map((c) => ({
                value: c.key,
                label: getLocalizedText(c.name) || c.key,
              })),
            ]}
            value={formData.defaultCategory}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, defaultCategory: value }))
            }
            placeholder="Select a default category..."
            disabled={isSubmitting}
          />

          <Input
            label="Notes"
            value={formData.notes}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, notes: e.target.value }))
            }
            placeholder="Additional notes..."
            disabled={isSubmitting}
          />

          <div className={styles.actions}>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              disabled={!formData.name}
            >
              {counterparty ? 'Save Changes' : 'Create Counterparty'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
