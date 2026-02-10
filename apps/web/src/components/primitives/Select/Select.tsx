'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Icon } from '../Icon';
import styles from './Select.module.css';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  label,
  disabled = false,
  className,
  id,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const generatedId = useId();
  const selectId = id || generatedId;

  const selectedOption = options.find((opt) => opt.value === value);
  const displayText = selectedOption?.label || placeholder;

  const toggleMenu = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close menu on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <div className={`${styles.wrapper} ${className || ''}`} ref={containerRef}>
      {label && (
        <label htmlFor={selectId} className={styles.label}>
          {label}
        </label>
      )}
      <button
        type="button"
        id={selectId}
        className={`${styles.trigger} ${isOpen ? styles.open : ''} ${disabled ? styles.disabled : ''}`}
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        disabled={disabled}
      >
        <span className={selectedOption ? styles.value : styles.placeholder}>
          {displayText}
        </span>
        <Icon
          name="ChevronDown"
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
        />
      </button>

      {isOpen && (
        <div className={styles.menu} role="listbox">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`${styles.option} ${option.value === value ? styles.selected : ''}`}
              onClick={() => handleSelect(option.value)}
              role="option"
              aria-selected={option.value === value}
            >
              {option.label}
              {option.value === value && (
                <Icon name="Check" className={styles.checkIcon} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
