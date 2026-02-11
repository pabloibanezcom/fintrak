import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SectionHeader } from './SectionHeader';

describe('SectionHeader', () => {
  it('renders title and optional action', () => {
    render(
      <SectionHeader
        title="Recent Transactions"
        action={<button type="button">View all</button>}
      />
    );

    expect(
      screen.getByRole('heading', { level: 2, name: 'Recent Transactions' })
    ).toBeTruthy();
    expect(screen.getByRole('button', { name: 'View all' })).toBeTruthy();
  });
});
