import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Toaster } from './Toaster';

const sonnerToasterSpy = vi.fn();

vi.mock('sonner', () => ({
  Toaster: (props: Record<string, unknown>) => {
    sonnerToasterSpy(props);
    return <div data-testid="sonner-toaster" />;
  },
}));

describe('Toaster', () => {
  it('renders sonner toaster with expected defaults', () => {
    render(<Toaster />);

    expect(screen.getByTestId('sonner-toaster')).toBeTruthy();
    expect(sonnerToasterSpy).toHaveBeenCalledTimes(1);

    const props = sonnerToasterSpy.mock.calls[0][0];
    expect(props.position).toBe('bottom-right');
    expect(props.richColors).toBe(true);
    expect(props.closeButton).toBe(true);
    expect((props.toastOptions as { duration: number }).duration).toBe(4000);
  });
});
