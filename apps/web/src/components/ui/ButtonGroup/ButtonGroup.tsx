'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import styles from './ButtonGroup.module.css';

export interface ButtonGroupItem {
  id: string;
  label?: string;
  icon?: ReactNode;
  href?: string;
  onClick?: () => void;
  title?: string;
  active?: boolean;
}

export interface ButtonGroupProps {
  items: ButtonGroupItem[];
  orientation?: 'horizontal' | 'vertical';
  display?: 'icon' | 'text' | 'both';
  variant?: 'nav' | 'actions';
  activeId?: string;
  showTooltip?: boolean;
  animated?: boolean;
  className?: string;
  itemClassName?: string;
}

export function ButtonGroup({
  items,
  orientation = 'horizontal',
  display = 'text',
  variant = 'nav',
  activeId,
  showTooltip = false,
  animated = false,
  className,
  itemClassName,
}: ButtonGroupProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});

  // Update indicator position when activeId changes
  useEffect(() => {
    if (!animated || !containerRef.current || !activeId) return;

    const container = containerRef.current;
    const activeElement = container.querySelector(
      `[data-item-id="${activeId}"]`
    ) as HTMLElement;

    if (activeElement) {
      const containerRect = container.getBoundingClientRect();
      const activeRect = activeElement.getBoundingClientRect();

      if (orientation === 'horizontal') {
        setIndicatorStyle({
          width: activeRect.width,
          height: activeRect.height,
          transform: `translateX(${activeRect.left - containerRect.left - 4}px)`,
        });
      } else {
        setIndicatorStyle({
          width: activeRect.width,
          height: activeRect.height,
          transform: `translateY(${activeRect.top - containerRect.top - 12}px)`,
        });
      }
    }
  }, [activeId, animated, orientation, items]);

  const containerClasses = [
    styles.container,
    styles[orientation],
    styles[variant],
    animated && styles.animated,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const getItemClasses = (item: ButtonGroupItem) => {
    const isActive = item.active ?? item.id === activeId;
    return [
      styles.item,
      styles[`display-${display}`],
      isActive && styles.active,
      showTooltip && styles.withTooltip,
      animated && styles.animatedItem,
      itemClassName,
    ]
      .filter(Boolean)
      .join(' ');
  };

  const renderContent = (item: ButtonGroupItem) => {
    if (display === 'icon') {
      return item.icon;
    }
    if (display === 'text') {
      return item.label;
    }
    return (
      <>
        {item.icon}
        {item.label}
      </>
    );
  };

  const renderItem = (item: ButtonGroupItem) => {
    const content = renderContent(item);
    const itemClasses = getItemClasses(item);
    const tooltipTitle = showTooltip ? item.title || item.label : undefined;

    if (item.href) {
      return (
        <Link
          key={item.id}
          href={item.href}
          className={itemClasses}
          title={tooltipTitle}
          onClick={item.onClick}
          data-item-id={item.id}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        key={item.id}
        type="button"
        className={itemClasses}
        title={tooltipTitle}
        onClick={item.onClick}
        data-item-id={item.id}
      >
        {content}
      </button>
    );
  };

  return (
    <div className={containerClasses} ref={containerRef}>
      {animated && activeId && (
        <div className={styles.indicator} style={indicatorStyle} />
      )}
      {items.map(renderItem)}
    </div>
  );
}
