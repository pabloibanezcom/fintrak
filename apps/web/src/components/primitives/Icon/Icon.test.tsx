import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Icon, isValidIconName } from './Icon';

describe('Icon', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('validates known and unknown icon names', () => {
    expect(isValidIconName('logo')).toBe(true);
    expect(isValidIconName('notAnIcon')).toBe(false);
  });

  it('renders svg wrapper for a valid icon', () => {
    const { container } = render(<Icon name="logo" size={32} />);

    const wrapper = container.querySelector('span');
    const svg = container.querySelector('svg');
    expect(wrapper).toBeTruthy();
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute('width')).toBe('32');
  });

  it('applies accessible role when aria-label is provided', () => {
    render(<Icon name="search" aria-label="Search icon" />);

    const wrapper = screen.getByRole('img', { name: 'Search icon' });
    expect(wrapper.getAttribute('aria-hidden')).toBe('false');
  });

  it('returns null and warns for unknown icons', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const { container } = render(<Icon name="unknown-icon" />);
    expect(container.firstChild).toBeNull();
    expect(warn).toHaveBeenCalledTimes(1);
  });
});
