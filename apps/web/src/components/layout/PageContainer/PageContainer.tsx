import type { ReactNode } from 'react';
import styles from './PageContainer.module.css';

export interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export const PageContainer = ({ children, className }: PageContainerProps) => {
  return (
    <div className={`${styles.container} ${className || ''}`}>{children}</div>
  );
};
