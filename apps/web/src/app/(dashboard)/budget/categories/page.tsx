'use client';

import { useLocale } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';
import { CategoryCard } from '@/components/data-display';
import { PageContainer, PageHeader } from '@/components/layout';
import { CreateCategoryModal } from '@/components/modals';
import { Button, Icon } from '@/components/primitives';
import { type Category, categoriesService } from '@/services';
import { toast } from '@/utils';

export default function CategoriesPage() {
  const locale = useLocale() as 'en' | 'es';
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSuccess = () => {
    fetchCategories();
  };

  return (
    <PageContainer>
      <PageHeader
        title="Categories"
        subtitle="Manage transaction categories for your budget"
        actions={
          <Button onClick={handleCreateClick} variant="ghost" size="sm">
            <Icon name="Plus" size={16} />
            <span>Add Category</span>
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
      ) : categories.length === 0 ? (
        <div
          className="flex-col"
          style={{ alignItems: 'center', padding: '2rem' }}
        >
          No categories found.
        </div>
      ) : (
        <div className="grid-auto">
          {categories.map((category) => (
            <CategoryCard
              key={category.key}
              category={category}
              locale={locale}
            />
          ))}
        </div>
      )}

      <CreateCategoryModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        category={null}
        onSuccess={handleSuccess}
      />
    </PageContainer>
  );
}
