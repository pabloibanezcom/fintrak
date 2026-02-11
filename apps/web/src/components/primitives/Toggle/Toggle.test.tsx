import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Toggle } from './Toggle';

describe('Toggle', () => {
  it('renders as a switch and toggles state', () => {
    const onChange = vi.fn();

    render(
      <Toggle label="Auto sync" defaultChecked={false} onChange={onChange} />
    );

    const toggle = screen.getByRole('switch', { name: 'Auto sync' });
    expect((toggle as HTMLInputElement).checked).toBe(false);

    fireEvent.click(toggle);

    expect((toggle as HTMLInputElement).checked).toBe(true);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('marks the switch as disabled', () => {
    render(
      <Toggle
        label="Auto sync"
        defaultChecked={false}
        onChange={vi.fn()}
        disabled
      />
    );

    const toggle = screen.getByRole('switch', { name: 'Auto sync' });
    expect(toggle).toHaveProperty('disabled', true);
  });
});
