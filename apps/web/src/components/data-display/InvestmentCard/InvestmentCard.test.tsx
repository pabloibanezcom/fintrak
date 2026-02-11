import type { CryptoAsset, InvestmentSummary } from '@fintrak/types';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { InvestmentCard } from './InvestmentCard';

const STORAGE_KEY = 'fintrak-investment-card-visible';

const fund: InvestmentSummary = {
  isin: 'IE00FUND1234',
  investmentName: 'Global Growth Fund',
  initialInvestment: 1000,
  marketValue: 1200,
  profit: 200,
  totalReturn: 200,
  averageCost: 100,
  liquidationValue: 1200,
};

const cryptoAsset: CryptoAsset = {
  _id: 'crypto-1',
  userId: 'user-1',
  name: 'Bitcoin',
  code: 'BTC',
  amount: 0.01,
  value: {
    EUR: 300,
  },
};

describe('InvestmentCard', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders empty state when there are no investments', () => {
    render(<InvestmentCard funds={[]} etcs={[]} cryptoAssets={[]} />);

    expect(screen.getByText('No investments found')).toBeTruthy();
  });

  it('respects defaultVisible=false and toggles content visibility', async () => {
    render(<InvestmentCard funds={[fund]} defaultVisible={false} />);

    expect(screen.getByText('€ ******')).toBeTruthy();
    expect(
      screen.getByRole('button', { name: 'Show investment details' })
    ).toBeTruthy();

    fireEvent.click(
      screen.getByRole('button', { name: 'Show investment details' })
    );

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Hide investment details' })
      ).toBeTruthy();
    });

    expect(screen.queryByText('€ ******')).toBeNull();
    expect(localStorage.getItem(STORAGE_KEY)).toBe('true');
  });

  it('uses persisted localStorage visibility state over defaultVisible', () => {
    localStorage.setItem(STORAGE_KEY, 'false');

    render(<InvestmentCard funds={[fund]} defaultVisible />);

    expect(screen.getByText('€ ******')).toBeTruthy();
    expect(
      screen.getByRole('button', { name: 'Show investment details' })
    ).toBeTruthy();
  });

  it('calls onItemClick with mapped investment item', async () => {
    const onItemClick = vi.fn();

    render(
      <InvestmentCard
        funds={[fund]}
        cryptoAssets={[cryptoAsset]}
        onItemClick={onItemClick}
      />
    );

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /Global Growth Fund/i })
      ).toBeTruthy();
    });

    fireEvent.click(
      screen.getByRole('button', { name: /Global Growth Fund/i })
    );

    expect(onItemClick).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'IE00FUND1234',
        name: 'Global Growth Fund',
        type: 'fund',
        marketValue: 1200,
        profit: 200,
        profitPercentage: 20,
        currency: 'EUR',
      })
    );
  });
});
