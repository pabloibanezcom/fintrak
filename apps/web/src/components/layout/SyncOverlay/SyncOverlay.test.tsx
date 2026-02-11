import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SyncOverlay } from './SyncOverlay';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) =>
    key === 'syncing' ? 'Syncing...' : key,
}));

vi.mock('@/components/primitives', async () => {
  const actual = await vi.importActual<
    typeof import('@/components/primitives')
  >('@/components/primitives');

  return {
    ...actual,
    Icon: ({ name }: { name: string }) => (
      <span data-testid="sync-icon">{name}</span>
    ),
  };
});

describe('SyncOverlay', () => {
  it('renders syncing message and loader icon', () => {
    render(<SyncOverlay />);

    expect(screen.getByText('Syncing...')).toBeTruthy();
    expect(screen.getByTestId('sync-icon').textContent).toBe('loader');
  });
});
