'use client';

import type { CSSProperties } from 'react';
import { Avatar } from '@/components/primitives';
import type { Counterparty } from '@/services';
import styles from './CounterpartyAvatarBox.module.css';

export interface CounterpartyAvatarBoxProps {
  counterparty: Pick<Counterparty, 'name' | 'logo' | 'defaultCategory'>;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  viewTransitionName?: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
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

export function CounterpartyAvatarBox({
  counterparty,
  size = 'md',
  className,
  viewTransitionName,
}: CounterpartyAvatarBoxProps) {
  const color = counterparty.defaultCategory?.color;
  const frameStyle: CSSProperties | undefined =
    color || viewTransitionName
      ? ({
          ...(color
            ? {
                borderColor: withAlpha(color, 0.35),
                boxShadow: `0 2px 10px ${withAlpha(color, 0.22)}`,
                ...(counterparty.logo
                  ? {}
                  : {
                      '--avatar-bg-color': color,
                      '--avatar-fg-color': '#ffffff',
                    }),
              }
            : {}),
          ...(viewTransitionName ? { viewTransitionName } : {}),
        } as CSSProperties)
      : undefined;

  return (
    <div
      className={[styles.frame, className].filter(Boolean).join(' ')}
      style={frameStyle}
    >
      <Avatar
        src={counterparty.logo}
        alt={counterparty.name}
        fallback={getInitials(counterparty.name)}
        size={size}
        className={styles.avatar}
      />
    </div>
  );
}
