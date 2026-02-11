import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AuthLayout } from './AuthLayout';

vi.mock('@/components/primitives', async () => {
  const actual = await vi.importActual<
    typeof import('@/components/primitives')
  >('@/components/primitives');

  return {
    ...actual,
    Icon: ({ name }: { name: string }) => (
      <span data-testid="logo-icon">{name}</span>
    ),
  };
});

describe('AuthLayout', () => {
  it('renders logo and children', () => {
    render(
      <AuthLayout>
        <form aria-label="auth-form" />
      </AuthLayout>
    );

    expect(screen.getByText('Fintrak')).toBeTruthy();
    expect(screen.getByTestId('logo-icon').textContent).toBe('logo');
    expect(screen.getByRole('form', { name: 'auth-form' })).toBeTruthy();
  });
});
