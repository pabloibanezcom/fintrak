import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import progressStyles from '@/components/primitives/ProgressBar/ProgressBar.module.css';
import { formatCurrency } from '@/utils';
import { SpendingLimitBar } from './SpendingLimitBar';

describe('SpendingLimitBar', () => {
  it('renders title, markers and spent value', () => {
    render(<SpendingLimitBar spent={50} limit={100} currency="EUR" />);

    expect(screen.getByText('Monthly Spending Limit')).toBeTruthy();
    expect(screen.getByText('+ Add new')).toBeTruthy();
    expect(screen.getByText('spent out of')).toBeTruthy();

    const markerValues = [0, 50, 100].map((value) =>
      formatCurrency(value, 'EUR')
    );
    for (const markerValue of markerValues) {
      expect(
        screen.getAllByText((_, node) => node?.textContent === markerValue)
          .length
      ).toBeGreaterThan(0);
    }
  });

  it('uses warning variant when spent percentage is above 70', () => {
    render(<SpendingLimitBar spent={80} limit={100} />);

    expect(screen.getByRole('progressbar').className).toContain(
      progressStyles.warning
    );
  });

  it('uses error variant when spent percentage is above 90', () => {
    render(<SpendingLimitBar spent={95} limit={100} />);

    expect(screen.getByRole('progressbar').className).toContain(
      progressStyles.error
    );
  });
});
