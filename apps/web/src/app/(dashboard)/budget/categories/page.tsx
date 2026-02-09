'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CreateCategoryModal,
  Icon,
  isValidIconName,
} from '@/components/ui';
import { type Category, categoriesService } from '@/services';
import { toast } from '@/utils';
import styles from './page.module.css';

export default function CategoriesPage() {
  const locale = useLocale() as 'en' | 'es';
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await categoriesService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCreateClick = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const handleSuccess = () => {
    fetchCategories();
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
        <div className={styles.headerContent}>
          <div className={styles.headerText}>
            <h1 className={styles.title}>Categories</h1>
            <p className={styles.subtitle}>
              Manage transaction categories for your budget
            </p>
          </div>
          <Button onClick={handleCreateClick} variant="primary">
            <Icon name="Plus" size={16} />
            <span>Add Category</span>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className={styles.loader}>Loading...</div>
      ) : categories.length === 0 ? (
        <div className={styles.empty}>No categories found.</div>
      ) : (
        <div className={styles.grid}>
          {categories.map((category) => (
            <Card key={category.key} className={styles.card} padding="sm">
              <Link
                href={`/budget/categories/${category.key}`}
                className={styles.cardLink}
              >
                <div
                  className={styles.cardIcon}
                  style={{
                    backgroundColor: category.color
                      ? `${category.color}15`
                      : undefined,
                    color: category.color || undefined,
                  }}
                >
                  {category.icon && isValidIconName(category.icon) ? (
                    <Icon name={category.icon} size={20} />
                  ) : (
                    getInitials(category.name[locale])
                  )}
                </div>
                <div className={styles.cardInfo}>
                  <span className={styles.cardName} title={category.name[locale]}>
                    {category.name[locale]}
                  </span>
                </div>
              </Link>
              <div className={styles.cardActions}>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.preventDefault();
                    handleEditClick(category);
                  }}
                  title="Edit"
                >
                  <Icon name="Pen" size={14} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <CreateCategoryModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        category={selectedCategory}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
