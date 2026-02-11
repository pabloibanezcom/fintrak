import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Select } from './Select';

vi.mock('../Icon', () => ({
  Icon: () => null,
}));

const options = [
  { value: 'usd', label: 'USD' },
  { value: 'eur', label: 'EUR' },
];

describe('Select', () => {
  it('opens the menu and calls onChange when an option is selected', () => {
    const onChange = vi.fn();

    render(
      <Select
        label="Currency"
        value=""
        onChange={onChange}
        options={options}
        placeholder="Select currency"
      />
    );

    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('listbox')).toBeTruthy();

    fireEvent.click(screen.getByRole('option', { name: 'USD' }));

    expect(onChange).toHaveBeenCalledWith('usd');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('closes the menu when Escape is pressed', () => {
    render(<Select value="" onChange={vi.fn()} options={options} />);

    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('listbox')).toBeTruthy();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('does not open when disabled', () => {
    render(<Select value="" onChange={vi.fn()} options={options} disabled />);

    fireEvent.click(screen.getByRole('button'));
    expect(screen.queryByRole('listbox')).toBeNull();
  });
});
