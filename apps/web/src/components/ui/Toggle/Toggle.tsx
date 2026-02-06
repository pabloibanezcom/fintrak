import { forwardRef, type InputHTMLAttributes, useId } from 'react';
import styles from './Toggle.module.css';

export interface ToggleProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ label, size = 'md', className, id, disabled, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    const trackClasses = [styles.track, styles[size], className]
      .filter(Boolean)
      .join(' ');

    return (
      <label
        htmlFor={inputId}
        className={`${styles.toggle} ${disabled ? styles.disabled : ''}`}
      >
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          role="switch"
          className={styles.input}
          disabled={disabled}
          {...props}
        />
        <span className={trackClasses}>
          <span className={styles.thumb} />
        </span>
        {label && <span className={styles.label}>{label}</span>}
      </label>
    );
  }
);

Toggle.displayName = 'Toggle';
