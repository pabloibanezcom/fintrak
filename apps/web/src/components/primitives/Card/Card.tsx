import type { HTMLAttributes, Ref } from 'react';
import styles from './Card.module.css';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  ref?: Ref<HTMLDivElement>;
}

export function Card({
  variant = 'default',
  padding = 'md',
  className,
  children,
  ref,
  ...props
}: CardProps) {
  const classes = [
    styles.card,
    styles[variant],
    styles[`padding-${padding}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={ref} className={classes} {...props}>
      {children}
    </div>
  );
}
