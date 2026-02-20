import type { HTMLAttributes, Ref } from 'react';
import styles from './Badge.module.css';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'primary';
  size?: 'sm' | 'md';
  ref?: Ref<HTMLSpanElement>;
}

export function Badge({
  variant = 'default',
  size = 'sm',
  className,
  children,
  ref,
  ...props
}: BadgeProps) {
  const classes = [styles.badge, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(' ');

  return (
    <span ref={ref} className={classes} {...props}>
      {children}
    </span>
  );
}
