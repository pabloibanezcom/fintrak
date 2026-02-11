import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ErrorMessage } from './ErrorMessage';

describe('ErrorMessage', () => {
  it('renders null for an empty message', () => {
    const { container } = render(<ErrorMessage message="" />);

    expect(container.firstChild).toBeNull();
  });

  it('renders provided error text', () => {
    render(<ErrorMessage message="Invalid credentials" />);

    expect(screen.getByText('Invalid credentials')).toBeTruthy();
  });
});
