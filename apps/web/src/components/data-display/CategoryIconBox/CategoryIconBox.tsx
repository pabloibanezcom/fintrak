'use client';

import type { CSSProperties } from 'react';
import { Icon, isValidIconName } from '@/components/primitives';
import type { Category } from '@/services';
import styles from './CategoryIconBox.module.css';

export interface CategoryIconBoxProps {
  category: Pick<Category, 'name' | 'color' | 'icon'>;
  locale: 'en' | 'es';
  size?: number;
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
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

export function CategoryIconBox({
  category,
  locale,
  size = 40,
  className,
}: CategoryIconBoxProps) {
  const displayName = category.name[locale] || category.name.en || '';
  const iconSize = Math.round(size * 0.5);
  const initialsSize = Math.round(size * 0.38);
  const borderRadius = Math.round(size * 0.2);
  const style = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: `${borderRadius}px`,
    backgroundColor: category.color ? withOpacity(category.color, 0.8) : undefined,
  } as CSSProperties;

  const classes = [styles.iconBox, className].filter(Boolean).join(' ');

  return (
    <div className={classes} style={style}>
      {category.icon && isValidIconName(category.icon) ? (
        <Icon name={category.icon} size={iconSize} />
      ) : (
        <span style={{ fontSize: `${initialsSize}px` }}>
          {getInitials(displayName)}
        </span>
      )}
    </div>
  );
}
