import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  it('uses the alt initial when there is no image', () => {
    render(<Avatar alt="pablo" />);

    expect(screen.getByText('P')).toBeTruthy();
  });

  it('uses fallback text when provided', () => {
    render(<Avatar alt="pablo" fallback="PI" />);

    expect(screen.getByText('PI')).toBeTruthy();
  });

  it('renders an image when src is provided', () => {
    render(<Avatar src="/avatar.png" alt="Pablo" />);

    const img = screen.getByRole('img', { name: 'Pablo' }) as HTMLImageElement;
    expect(img.getAttribute('src')).toContain('/avatar.png');
  });
});
