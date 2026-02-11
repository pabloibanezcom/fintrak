import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DropdownMenu } from './DropdownMenu';

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: Record<string, unknown>) => (
    <a href={String(href)} {...props}>
      {children}
    </a>
  ),
}));

describe('DropdownMenu', () => {
  it('opens and renders link/button items', () => {
    const onButtonClick = vi.fn();

    render(
      <DropdownMenu
        trigger={<span>Menu</span>}
        items={[
          { type: 'link', label: 'Profile', href: '/profile' },
          { type: 'divider' },
          { type: 'button', label: 'Log out', onClick: onButtonClick },
        ]}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Menu' }));

    expect(screen.getByRole('menu')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Profile' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Log out' }));
    expect(onButtonClick).toHaveBeenCalledTimes(1);
  });

  it('closes on Escape', () => {
    render(
      <DropdownMenu
        trigger={<span>Menu</span>}
        items={[{ type: 'button', label: 'Settings' }]}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Menu' }));
    expect(screen.getByRole('menu')).toBeTruthy();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('menu')).toBeNull();
  });
});
