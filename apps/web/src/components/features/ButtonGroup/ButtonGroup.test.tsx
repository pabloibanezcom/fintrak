import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ButtonGroup } from './ButtonGroup';

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    children?: ReactNode;
  }) => (
    <a href={String(href)} {...props}>
      {children}
    </a>
  ),
}));

describe('ButtonGroup', () => {
  it('renders link and button items and handles click callbacks', () => {
    const onClick = vi.fn();

    render(
      <ButtonGroup
        items={[
          { id: 'overview', label: 'Overview', href: '/overview' },
          { id: 'refresh', label: 'Refresh', onClick },
        ]}
      />
    );

    expect(screen.getByRole('link', { name: 'Overview' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Refresh' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('respects disabled item state', () => {
    const onClick = vi.fn();

    render(
      <ButtonGroup
        items={[{ id: 'sync', label: 'Sync', onClick, disabled: true }]}
      />
    );

    const button = screen.getByRole('button', { name: 'Sync' });
    expect(button).toHaveProperty('disabled', true);
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders icon and text when display is both', () => {
    render(
      <ButtonGroup
        display="both"
        items={[
          {
            id: 'reports',
            label: 'Reports',
            icon: <span data-testid="reports-icon">R</span>,
          },
        ]}
      />
    );

    expect(screen.getByTestId('reports-icon')).toBeTruthy();
    expect(screen.getByText('Reports')).toBeTruthy();
  });

  it('renders icon-only display mode', () => {
    render(
      <ButtonGroup
        display="icon"
        items={[
          {
            id: 'search',
            label: 'Search',
            icon: <span data-testid="search-icon">S</span>,
          },
        ]}
      />
    );

    expect(screen.getByTestId('search-icon')).toBeTruthy();
    expect(screen.queryByText('Search')).toBeNull();
  });

  it('applies tooltip title from item label when showTooltip is enabled', () => {
    render(
      <ButtonGroup
        showTooltip
        items={[{ id: 'settings', label: 'Settings', onClick: vi.fn() }]}
      />
    );

    expect(
      screen.getByRole('button', { name: 'Settings' }).getAttribute('title')
    ).toBe('Settings');
  });

  it('uses explicit active flag over activeId', () => {
    render(
      <ButtonGroup
        activeId="overview"
        items={[
          { id: 'overview', label: 'Overview', active: false },
          { id: 'reports', label: 'Reports', active: true },
        ]}
      />
    );

    const [overview, reports] = screen.getAllByRole('button');
    expect(overview.className).not.toContain('active');
    expect(reports.className).toContain('active');
  });

  it('renders and positions indicator for horizontal animated mode', async () => {
    render(
      <ButtonGroup
        animated
        activeId="overview"
        orientation="horizontal"
        items={[{ id: 'overview', label: 'Overview' }]}
      />
    );

    await waitFor(() => {
      const indicator = document.querySelector('[style*="translateX"]');
      expect(indicator).toBeTruthy();
    });
  });

  it('renders and positions indicator for vertical animated mode', async () => {
    render(
      <ButtonGroup
        animated
        activeId="reports"
        orientation="vertical"
        items={[{ id: 'reports', label: 'Reports' }]}
      />
    );

    await waitFor(() => {
      const indicator = document.querySelector('[style*="translateY"]');
      expect(indicator).toBeTruthy();
    });
  });
});
