'use client';

import type { CSSProperties } from 'react';
import Link from 'next/link';
import { Card } from '@/components/primitives';
import type { Category } from '@/services';
import { CategoryIconBox } from '../CategoryIconBox';
import styles from './CategoryCard.module.css';

export interface CategoryCardProps {
  category: Category;
  locale: 'en' | 'es';
  href?: string;
}

function withOpacity(color: string, opacity = 0.8): string {
  const hex = color.replace('#', '');

  if (/^[0-9a-fA-F]{6}$/.test(hex)) {
    const r = Number.parseInt(hex.slice(0, 2), 16);
    const g = Number.parseInt(hex.slice(2, 4), 16);
    const b = Number.parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  if (/^[0-9a-fA-F]{3}$/.test(hex)) {
    const r = Number.parseInt(hex[0] + hex[0], 16);
    const g = Number.parseInt(hex[1] + hex[1], 16);
    const b = Number.parseInt(hex[2] + hex[2], 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  return color;
}

export function CategoryCard({
  category,
  locale,
  href = `/budget/categories/${category.key}`,
}: CategoryCardProps) {
  const displayName = category.name[locale] || category.name.en || category.key;
  const cardStyle = {
    '--category-hover-bg': category.color
      ? withOpacity(category.color, 0.12)
      : 'var(--color-bg-secondary)',
    '--category-active-bg': category.color
      ? withOpacity(category.color, 0.18)
      : 'var(--color-bg-tertiary)',
    '--category-hover-grad-start': category.color
      ? withOpacity(category.color, 0.24)
      : 'transparent',
    '--category-hover-grad-end': category.color
      ? withOpacity(category.color, 0.04)
      : 'transparent',
  } as CSSProperties;

  return (
    <Card className={styles.card} padding="sm" style={cardStyle}>
      <Link href={href} className={styles.link}>
        <CategoryIconBox category={category} locale={locale} size={40} />
        <div className={styles.nameWrap}>
          <span className={styles.name}>{displayName}</span>
        </div>
      </Link>
    </Card>
  );
}
