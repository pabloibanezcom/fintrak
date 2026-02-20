import type { ButtonHTMLAttributes, Ref } from 'react';
import { Icon } from '../Icon';
import styles from './Button.module.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  ref?: Ref<HTMLButtonElement>;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  disabled,
  className,
  children,
  ref,
  ...props
}: ButtonProps) {
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    isLoading && styles.loading,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      ref={ref}
      className={classes}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className={styles.spinner}>
          <Icon name="spinner" className={styles.spinnerIcon} />
        </span>
      )}
      <span className={isLoading ? styles.hiddenText : styles.content}>
        {children}
      </span>
    </button>
  );
}
