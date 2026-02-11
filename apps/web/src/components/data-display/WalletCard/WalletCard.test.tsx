import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WalletCard } from './WalletCard';

describe('WalletCard', () => {
  it('renders known currency flag, label, balance and active badge', () => {
    render(
      <WalletCard
        currency="USD"
        balance={1234.56}
        label="Primary wallet"
        isActive
      />
    );

    expect(screen.getByText('🇺🇸')).toBeTruthy();
    expect(screen.getByText('USD')).toBeTruthy();
    expect(screen.getByText('$1,234.56')).toBeTruthy();
    expect(screen.getByText('Primary wallet')).toBeTruthy();
    expect(screen.getByText('Active')).toBeTruthy();
  });

  it('falls back to currency code when there is no flag mapping', () => {
    render(<WalletCard currency="JPY" balance={50} />);

    const matches = screen.getAllByText('JPY');
    expect(matches.length).toBeGreaterThan(0);
  });
});
