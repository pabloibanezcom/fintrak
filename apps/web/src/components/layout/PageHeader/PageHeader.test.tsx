import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PageHeader } from './PageHeader';

describe('PageHeader', () => {
  it('renders title, subtitle and actions', () => {
    render(
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your finances"
        actions={<button type="button">Export</button>}
      />
    );

    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeTruthy();
    expect(screen.getByText('Overview of your finances')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Export' })).toBeTruthy();
  });

  it('renders without optional props', () => {
    render(<PageHeader title="Budget" />);

    expect(screen.getByRole('heading', { name: 'Budget' })).toBeTruthy();
    expect(screen.queryByRole('button')).toBeNull();
  });
});
