'use client';

import type { CSSProperties } from 'react';
import Link from 'next/link';
import { Card, Icon, isValidIconName } from '@/components/primitives';
import type { Category, Counterparty } from '@/services';
import { CounterpartyAvatarBox } from '../CounterpartyAvatarBox';
import styles from './CounterpartyCard.module.css';

export interface CounterpartyCardProps {
  counterparty: Counterparty;
  href?: string;
  locale?: 'en' | 'es';
  defaultCategory?: Category;
}

function withAlpha(color: string, alpha: number): string {
  const hex = color.replace('#', '');

  if (/^[0-9a-fA-F]{6}$/.test(hex)) {
    const r = Number.parseInt(hex.slice(0, 2), 16);
    const g = Number.parseInt(hex.slice(2, 4), 16);
    const b = Number.parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  if (/^[0-9a-fA-F]{3}$/.test(hex)) {
    const r = Number.parseInt(hex[0] + hex[0], 16);
    const g = Number.parseInt(hex[1] + hex[1], 16);
    const b = Number.parseInt(hex[2] + hex[2], 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  return color;
}

export function CounterpartyCard({
  counterparty,
  href = `/budget/counterparties/${counterparty.key}`,
  locale = 'en',
  defaultCategory,
}: CounterpartyCardProps) {
  const category = defaultCategory || counterparty.defaultCategory;
  const secondaryText = category
    ? category.name[locale] || category.key
    : counterparty.type;
  const cardStyle = {
    '--counterparty-hover-bg': category?.color
      ? withAlpha(category.color, 0.12)
      : 'var(--color-bg-secondary)',
    '--counterparty-active-bg': category?.color
      ? withAlpha(category.color, 0.18)
      : 'var(--color-bg-tertiary)',
    '--counterparty-hover-grad-start': category?.color
      ? withAlpha(category.color, 0.24)
      : 'transparent',
    '--counterparty-hover-grad-end': category?.color
      ? withAlpha(category.color, 0.04)
      : 'transparent',
  } as CSSProperties;
  const counterpartyWithCategory = {
    ...counterparty,
    defaultCategory: category,
  };

  return (
    <Card className={styles.card} padding="sm" style={cardStyle}>
      <Link href={href} className={styles.link}>
        <CounterpartyAvatarBox counterparty={counterpartyWithCategory} size="md" />
        <div className={styles.info}>
          <span className={styles.name}>{counterparty.name}</span>
          {secondaryText && (
            <span className={styles.secondary}>
              {category?.icon && isValidIconName(category.icon) && (
                <Icon
                  name={category.icon}
                  size={14}
                  className={styles.categoryIcon}
                  style={category.color ? { color: category.color } : undefined}
                />
              )}
              {secondaryText}
            </span>
          )}
        </div>
      </Link>
    </Card>
  );
}
