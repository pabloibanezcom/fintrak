import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { formatCurrency, formatPercentage } from '@/utils';
import { StatCard } from './StatCard';

vi.mock('@/components/primitives', async () => {
  const actual = await vi.importActual<
    typeof import('@/components/primitives')
  >('@/components/primitives');

  return {
    ...actual,
    Icon: ({ name }: { name: string }) => (
      <span data-testid="trend-icon">{name}</span>
    ),
  };
});

describe('StatCard', () => {
  it('renders label, value and positive change', () => {
    render(
      <StatCard label="Net Worth" value={5000} currency="EUR" change={12.3} />
    );

    const expectedValue = formatCurrency(5000, 'EUR');
    const expectedChange = formatPercentage(Math.abs(12.3));

    expect(screen.getByText('Net Worth')).toBeTruthy();
    expect(
      screen.getByText((_, node) => node?.textContent === expectedValue)
    ).toBeTruthy();
    expect(screen.getByText(expectedChange)).toBeTruthy();
    expect(screen.getByTestId('trend-icon').textContent).toBe('arrowUp');
    expect(screen.getByText('This month')).toBeTruthy();
  });

  it('uses down trend icon for negative change', () => {
    render(
      <StatCard label="Cash Flow" value={800} currency="EUR" change={-5} />
    );

    expect(screen.getByTestId('trend-icon').textContent).toBe('arrowDown');
    expect(screen.getByText(formatPercentage(Math.abs(-5)))).toBeTruthy();
  });

  it('does not render change row when change is undefined', () => {
    render(<StatCard label="Savings" value={1200} currency="EUR" />);

    expect(screen.queryByText('This month')).toBeNull();
  });
});
