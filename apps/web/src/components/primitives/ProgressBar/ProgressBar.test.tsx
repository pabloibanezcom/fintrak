import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
  it('clamps width to 100% when value exceeds max', () => {
    render(<ProgressBar value={150} max={100} />);

    const bar = screen.getByRole('progressbar') as HTMLDivElement;
    expect(bar.style.width).toBe('100%');
    expect(bar.getAttribute('aria-valuenow')).toBe('150');
  });

  it('clamps width to 0% for negative values', () => {
    render(<ProgressBar value={-20} max={100} />);

    const bar = screen.getByRole('progressbar') as HTMLDivElement;
    expect(bar.style.width).toBe('0%');
    expect(bar.getAttribute('aria-valuenow')).toBe('-20');
  });

  it('renders label without value when only label is provided', () => {
    render(<ProgressBar value={40} max={100} label="Usage" />);

    expect(screen.getByText('Usage')).toBeTruthy();
    expect(screen.queryByText('40 / 100')).toBeNull();
  });

  it('renders formatted values when showValue is enabled', () => {
    render(<ProgressBar value={2500} max={10000} showValue variant="success" />);

    expect(screen.getByText('2,500 / 10,000')).toBeTruthy();
    const bar = screen.getByRole('progressbar') as HTMLDivElement;
    expect(bar.className).toContain('success');
  });
});
