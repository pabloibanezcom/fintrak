'use client';

import { useEffect, useState } from 'react';
import { ColorPicker } from '@/components/forms';
import { Modal } from '@/components/modals';
import { Button, Input, isValidIconName } from '@/components/primitives';
import { type Category, categoriesService } from '@/services';
import { toast } from '@/utils';
import styles from './CreateCategoryModal.module.css';

export interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null;
  onSuccess?: () => void;
}

const PRESET_COLORS = [
  '#EF4444', // red
  '#F97316', // orange
  '#F59E0B', // amber
  '#84CC16', // lime
  '#10B981', // emerald
  '#06B6D4', // cyan
  '#3B82F6', // blue
  '#6366F1', // indigo
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#64748B', // slate
];

export function CreateCategoryModal({
  isOpen,
  onClose,
  category,
  onSuccess,
}: CreateCategoryModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: {
      en: '',
      es: '',
    },
    icon: '',
    color: PRESET_COLORS[0],
  });

  useEffect(() => {
    if (isOpen) {
      if (category) {
        setFormData({
          name: category.name,
          icon: category.icon || '',
          color: category.color || PRESET_COLORS[0],
        });
      } else {
        setFormData({
          name: {
            en: '',
            es: '',
          },
          icon: '',
          color: PRESET_COLORS[0],
        });
      }
      setError(null);
    }
  }, [isOpen, category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.en || !formData.name.es) {
      setError('Please enter names in both English and Spanish');
      return;
    }

    if (formData.icon && !isValidIconName(formData.icon)) {
      setError('Invalid icon name');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (category) {
        await categoriesService.update(category.key, {
          name: formData.name,
          icon: formData.icon || undefined,
          color: formData.color,
        });
        toast.success('Category updated successfully');
      } else {
        // Generate key from English name (lowercase, hyphenated)
        const key = formData.name.en
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '');

        await categoriesService.create({
          key,
          name: formData.name,
          icon: formData.icon || undefined,
          color: formData.color,
        });
        toast.success('Category created successfully');
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to save category';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={category ? 'Edit Category' : 'Create Category'}
      size="md"
    >
      <div className={styles.container}>
        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Name (English) *"
            value={formData.name.en}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                name: { ...prev.name, en: e.target.value },
              }))
            }
            placeholder="Category name in English..."
            disabled={isSubmitting}
          />

          <Input
            label="Name (Spanish) *"
            value={formData.name.es}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                name: { ...prev.name, es: e.target.value },
              }))
            }
            placeholder="Nombre de la categoría en español..."
            disabled={isSubmitting}
          />

          <Input
            label="Icon"
            value={formData.icon}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, icon: e.target.value }))
            }
            placeholder="Icon identifier (e.g., 'home')"
            disabled={isSubmitting}
          />

          <ColorPicker
            label="Color"
            value={formData.color}
            onChange={(color) => setFormData((prev) => ({ ...prev, color }))}
            colors={PRESET_COLORS}
            disabled={isSubmitting}
            allowCustom
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
              disabled={!formData.name.en || !formData.name.es}
            >
              {category ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
