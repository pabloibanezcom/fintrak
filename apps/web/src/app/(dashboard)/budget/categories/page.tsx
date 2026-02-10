'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';
import { PageContainer, PageHeader } from '@/components/layout';
import { CreateCategoryModal } from '@/components/modals';
import { Button, Card, Icon, isValidIconName } from '@/components/primitives';
import { type Category, categoriesService } from '@/services';
import { toast } from '@/utils';

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
    <PageContainer>
      <PageHeader
        title="Categories"
        subtitle="Manage transaction categories for your budget"
        actions={
          <Button onClick={handleCreateClick} variant="primary">
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
            <Card key={category.key} className="card-container" padding="sm">
              <Link
                href={`/budget/categories/${category.key}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)',
                  flex: 1,
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-md)',
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
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span
                    style={{
                      display: 'block',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                    title={category.name[locale]}
                  >
                    {category.name[locale]}
                  </span>
                </div>
              </Link>
              <div>
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
    </PageContainer>
  );
}
