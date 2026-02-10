import type { ReactNode } from 'react';
import { Card } from '@/components/primitives';
import styles from './AuthCard.module.css';

export interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export const AuthCard = ({ title, subtitle, children }: AuthCardProps) => {
  return (
    <Card padding="lg" className={styles.card}>
      <h1 className={styles.title}>{title}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      {children}
    </Card>
  );
};
