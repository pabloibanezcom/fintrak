import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  it('links label to input and supports typing', () => {
    render(<Input label="Email" hint="Use your work email" />);

    const input = screen.getByLabelText('Email') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'user@fintrak.app' } });

    expect(input.value).toBe('user@fintrak.app');
    expect(screen.getByText('Use your work email')).toBeTruthy();
  });

  it('shows an error message and sets aria attributes', () => {
    render(<Input id="email" label="Email" error="Email is required" />);

    const input = screen.getByLabelText('Email');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe('email-error');
    expect(screen.getByText('Email is required')).toBeTruthy();
  });
});
