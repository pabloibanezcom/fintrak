import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { formatCurrency } from '@/utils';
import { BankAccountCard, type BankAccountItem } from './BankAccountCard';

vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => (
    <>
      {/* biome-ignore lint/performance/noImgElement: test mock for next/image */}
      {/* biome-ignore lint/a11y/useAltText: alt is passed by the component under test */}
      <img {...props} />
    </>
  ),
}));

describe('BankAccountCard', () => {
  const accounts: BankAccountItem[] = [
    {
      id: 'acc-1',
      bankName: 'Acme Bank',
      bankLogo: 'https://example.com/acme.png',
      accountName: 'Main account',
      balance: 1200,
      currency: 'EUR',
      iban: 'DE89 3704 0044 0532 0130 00',
    },
    {
      id: 'acc-2',
      bankName: 'Neo Bank',
      accountName: 'Savings',
      balance: -200,
      currency: 'EUR',
    },
  ];

  it('renders empty state when no accounts are provided', () => {
    render(
      <BankAccountCard
        accounts={[]}
        emptyMessage="No linked bank accounts for this workspace"
      />
    );

    expect(
      screen.getByText('No linked bank accounts for this workspace')
    ).toBeTruthy();
  });

  it('renders totals and account details with masked IBAN', () => {
    render(<BankAccountCard accounts={accounts} title="Connected Accounts" />);

    const expectedTotal = formatCurrency(1000, 'EUR');

    expect(screen.getByText('Connected Accounts')).toBeTruthy();
    expect(
      screen.getByText((_, node) => node?.textContent === expectedTotal)
    ).toBeTruthy();
    expect(screen.getByText('Acme Bank')).toBeTruthy();
    expect(screen.getByText('Main account')).toBeTruthy();
    expect(screen.getByText('•••• 3000')).toBeTruthy();
  });

  it('renders bank logo image when logo URL is provided', () => {
    render(<BankAccountCard accounts={accounts} />);

    const logo = screen.getByRole('img', {
      name: 'Acme Bank',
    }) as HTMLImageElement;

    expect(logo.getAttribute('src')).toBe('https://example.com/acme.png');
  });

  it('calls onAccountClick on click and Enter key', () => {
    const onAccountClick = vi.fn();

    render(
      <BankAccountCard accounts={accounts} onAccountClick={onAccountClick} />
    );

    const firstAccountButton = screen
      .getByText('Main account')
      .closest('[role="button"]');

    expect(firstAccountButton).toBeTruthy();

    fireEvent.click(firstAccountButton as HTMLElement);
    fireEvent.keyDown(firstAccountButton as HTMLElement, { key: 'Enter' });

    expect(onAccountClick).toHaveBeenNthCalledWith(1, accounts[0]);
    expect(onAccountClick).toHaveBeenNthCalledWith(2, accounts[0]);
  });
});
