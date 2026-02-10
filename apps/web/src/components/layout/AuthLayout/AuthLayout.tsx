import type { ReactNode } from 'react';
import { Icon } from '@/components/primitives';
import styles from './AuthLayout.module.css';

export interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.logo}>
          <Icon name="logo" size={40} />
          <span className={styles.logoText}>Fintrak</span>
        </div>
        {children}
      </div>
    </div>
  );
};
