'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import styles from './DropdownMenu.module.css';

export interface DropdownMenuItem {
  type: 'link' | 'button' | 'divider';
  label?: string;
  href?: string;
  icon?: ReactNode;
  onClick?: () => void;
}

export interface DropdownMenuProps {
  trigger: ReactNode;
  items: DropdownMenuItem[];
  align?: 'left' | 'right';
  className?: string;
  menuClassName?: string;
}

export function DropdownMenu({
  trigger,
  items,
  align = 'right',
  className,
  menuClassName,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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

  const renderItem = (item: DropdownMenuItem, index: number) => {
    if (item.type === 'divider') {
      return <div key={index} className={styles.divider} />;
    }

    const content = (
      <>
        {item.icon}
        {item.label}
      </>
    );

    if (item.type === 'link' && item.href) {
      return (
        <Link
          key={index}
          href={item.href}
          className={styles.menuItem}
          onClick={closeMenu}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        key={index}
        type="button"
        className={styles.menuItem}
        onClick={() => {
          closeMenu();
          item.onClick?.();
        }}
      >
        {content}
      </button>
    );
  };

  return (
    <div className={`${styles.container} ${className || ''}`} ref={menuRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {trigger}
      </button>

      {isOpen && (
        <div
          className={`${styles.menu} ${align === 'left' ? styles.alignLeft : styles.alignRight} ${menuClassName || ''}`}
          role="menu"
        >
          {items.map((item, index) => renderItem(item, index))}
        </div>
      )}
    </div>
  );
}
