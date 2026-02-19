import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { CounterpartyCard } from './CounterpartyCard';

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

describe('CounterpartyCard', () => {
  const counterparty = {
    key: 'coffee-shop',
    name: 'Coffee Shop Ltd',
    type: 'company',
  };
  const defaultCategory = {
    key: 'food',
    name: { en: 'Food & Dining', es: 'Comida' },
    color: '#22c55e',
    icon: 'grocery',
  };

  it('renders name, link, and secondary text', () => {
    render(
      <CounterpartyCard
        counterparty={{ ...counterparty, defaultCategory } as any}
        locale="en"
      />
    );

    expect(screen.getByText('Coffee Shop Ltd')).toBeTruthy();
    expect(screen.getByText('Food & Dining')).toBeTruthy();
    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/budget/counterparties/coffee-shop');
  });

  it('shows counterparty type when default category is missing', () => {
    render(<CounterpartyCard counterparty={counterparty as any} />);

    expect(screen.getByText('company')).toBeTruthy();
  });
});
