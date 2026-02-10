import type { ReactNode } from 'react';
import styles from './PageHeader.module.css';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
}

export const PageHeader = ({
  title,
  subtitle,
  actions,
  className,
}: PageHeaderProps) => {
  return (
    <div className={`${styles.header} ${className || ''}`}>
      <div className={styles.content}>
        <div className={styles.text}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </div>
  );
};
