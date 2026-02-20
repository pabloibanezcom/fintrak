import type { ImgHTMLAttributes, Ref } from 'react';
import styles from './Avatar.module.css';

export interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  size?: 'sm' | 'md' | 'lg';
  fallback?: string;
  ref?: Ref<HTMLDivElement>;
}

export function Avatar({
  src,
  alt,
  size = 'md',
  fallback,
  className,
  ref,
  ...props
}: AvatarProps) {
  const initials = fallback || alt?.[0]?.toUpperCase() || '?';

  return (
    <div
      ref={ref}
      className={`${styles.avatar} ${styles[size]} ${className || ''}`}
    >
      {src ? (
        <img
          src={src}
          alt={alt || 'Avatar'}
          className={styles.image}
          {...props}
        />
      ) : (
        <span className={styles.fallback}>{initials}</span>
      )}
    </div>
  );
}
