import type { HTMLAttributes, Ref } from 'react';
import styles from './ProgressBar.module.css';

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'error';
  ref?: Ref<HTMLDivElement>;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = false,
  variant = 'default',
  className,
  ref,
  ...props
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      ref={ref}
      className={`${styles.wrapper} ${className || ''}`}
      {...props}
    >
      {(label || showValue) && (
        <div className={styles.header}>
          {label && <span className={styles.label}>{label}</span>}
          {showValue && (
            <span className={styles.value}>
              {value.toLocaleString()} / {max.toLocaleString()}
            </span>
          )}
        </div>
      )}
      <div className={styles.track}>
        <div
          className={`${styles.fill} ${styles[variant]}`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}
