import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ColorPicker } from './ColorPicker';

describe('ColorPicker', () => {
  it('renders label and calls onChange for preset color', () => {
    const onChange = vi.fn();

    render(
      <ColorPicker
        label="Category color"
        value="#EF4444"
        onChange={onChange}
        colors={['#EF4444', '#10B981']}
      />
    );

    expect(screen.getByText('Category color')).toBeTruthy();
    fireEvent.click(screen.getByLabelText('Select color #10B981'));
    expect(onChange).toHaveBeenCalledWith('#10B981');
  });

  it('supports custom color input and only emits valid hex from text field', () => {
    const onChange = vi.fn();

    render(
      <ColorPicker
        value="#EF4444"
        onChange={onChange}
        allowCustom
        colors={[]}
      />
    );

    fireEvent.click(screen.getByLabelText('Add custom color'));

    const textInput = screen.getByPlaceholderText('#000000');
    fireEvent.change(textInput, { target: { value: '#123ABC' } });
    fireEvent.change(textInput, { target: { value: 'not-a-color' } });

    expect(onChange).toHaveBeenCalledWith('#123ABC');
    expect(onChange).not.toHaveBeenCalledWith('not-a-color');
  });

  it('does not allow interaction when disabled', () => {
    const onChange = vi.fn();

    render(
      <ColorPicker
        value="#EF4444"
        onChange={onChange}
        disabled
        colors={['#EF4444', '#10B981']}
      />
    );

    const button = screen.getByLabelText('Select color #10B981');
    expect(button).toHaveProperty('disabled', true);
    fireEvent.click(button);
    expect(onChange).not.toHaveBeenCalled();
  });
});
