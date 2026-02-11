import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AuthDivider } from './AuthDivider';

describe('AuthDivider', () => {
  it('renders the divider text', () => {
    render(<AuthDivider text="Or continue with" />);

    expect(screen.getByText('Or continue with')).toBeTruthy();
  });
});
