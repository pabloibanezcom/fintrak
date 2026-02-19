import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { CategoryCard } from './CategoryCard';

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...props
  }: { href: string; children: ReactNode } & Record<string, unknown>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('CategoryCard', () => {
  const baseCategory = {
    key: 'food',
    name: { en: 'Food & Dining', es: 'Comida' },
    color: '#f59e0b',
    icon: 'grocery',
  };

  it('renders category name and link', () => {
    render(<CategoryCard category={baseCategory as any} locale="en" />);

    expect(screen.getByText('Food & Dining')).toBeTruthy();
    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/budget/categories/food');
  });

  it('uses initials when icon is invalid', () => {
    render(
      <CategoryCard
        category={{ ...baseCategory, icon: 'not-an-icon' } as any}
        locale="en"
      />
    );

    expect(screen.getByText('F&')).toBeTruthy();
  });
});
