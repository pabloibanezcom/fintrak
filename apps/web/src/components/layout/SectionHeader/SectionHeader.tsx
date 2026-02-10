import type { ReactNode } from 'react';
import styles from './SectionHeader.module.css';

export interface SectionHeaderProps {
  title: string;
  action?: ReactNode;
  className?: string;
}

export const SectionHeader = ({
  title,
  action,
  className,
}: SectionHeaderProps) => {
  return (
    <div className={`${styles.header} ${className || ''}`}>
      <h2 className={styles.title}>{title}</h2>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
};
