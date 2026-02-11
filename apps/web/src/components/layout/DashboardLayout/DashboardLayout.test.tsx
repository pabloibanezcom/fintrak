import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DashboardLayout } from './DashboardLayout';

const replaceSpy = vi.fn();

const sessionState = {
  isAuthenticated: true,
  isLoading: false,
};

const syncState = {
  isSyncing: false,
};

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: replaceSpy,
  }),
}));

vi.mock('@/context', () => ({
  useSession: () => sessionState,
  useSync: () => syncState,
}));

vi.mock('@/components/primitives', async () => {
  const actual = await vi.importActual<
    typeof import('@/components/primitives')
  >('@/components/primitives');

  return {
    ...actual,
    Icon: ({ name }: { name: string }) => (
      <span data-testid="dashboard-layout-icon">{name}</span>
    ),
  };
});

vi.mock('@/components/layout', () => ({
  Footer: () => <footer data-testid="layout-footer" />,
  Sidebar: () => <aside data-testid="layout-sidebar" />,
  SyncOverlay: () => <div data-testid="layout-sync-overlay" />,
  TopNav: () => <header data-testid="layout-topnav" />,
}));

describe('DashboardLayout', () => {
  it('renders loading state when session is loading', () => {
    sessionState.isLoading = true;
    sessionState.isAuthenticated = false;

    render(<DashboardLayout>Content</DashboardLayout>);

    expect(screen.getByTestId('dashboard-layout-icon').textContent).toBe(
      'loader'
    );
  });

  it('redirects to login when unauthenticated', async () => {
    sessionState.isLoading = false;
    sessionState.isAuthenticated = false;

    const { container } = render(<DashboardLayout>Content</DashboardLayout>);

    expect(container.firstChild).toBeNull();
    await waitFor(() => {
      expect(replaceSpy).toHaveBeenCalledWith('/login');
    });
  });

  it('renders full layout when authenticated and syncing', () => {
    sessionState.isLoading = false;
    sessionState.isAuthenticated = true;
    syncState.isSyncing = true;

    render(<DashboardLayout>Dashboard content</DashboardLayout>);

    expect(screen.getByTestId('layout-topnav')).toBeTruthy();
    expect(screen.getByTestId('layout-sidebar')).toBeTruthy();
    expect(screen.getByTestId('layout-footer')).toBeTruthy();
    expect(screen.getByTestId('layout-sync-overlay')).toBeTruthy();
    expect(screen.getByText('Dashboard content')).toBeTruthy();
  });
});
