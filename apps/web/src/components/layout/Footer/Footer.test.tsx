import { render, screen } from '@testing-library/react';
import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Footer } from './Footer';

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    children?: ReactNode;
  }) => (
    <a href={String(href)} {...props}>
      {children}
    </a>
  ),
}));

describe('Footer', () => {
  it('renders design system and author links with current year', () => {
    const currentYear = new Date().getFullYear();

    render(<Footer />);

    expect(screen.getByRole('link', { name: 'Design System' })).toBeTruthy();
    expect(
      screen.getByRole('link', { name: 'Pablo Ibanez' }).getAttribute('href')
    ).toBe('https://www.pabloibanez.com');
    expect(screen.getByText(new RegExp(String(currentYear)))).toBeTruthy();
  });
});
