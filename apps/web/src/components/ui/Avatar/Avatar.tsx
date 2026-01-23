import { forwardRef, type ImgHTMLAttributes } from 'react';
import styles from './Avatar.module.css';

export interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  size?: 'sm' | 'md' | 'lg';
  fallback?: string;
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt, size = 'md', fallback, className, ...props }, ref) => {
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
);

Avatar.displayName = 'Avatar';
