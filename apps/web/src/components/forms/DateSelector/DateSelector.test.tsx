import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import styles from './DateSelector.module.css';
import { DateSelector } from './DateSelector';

function getCurrentMonthDayButton(day: string): HTMLButtonElement {
  const button = screen
    .getAllByRole('button', { name: day })
    .find((el) => !el.className.includes(styles.dayOutside));

  if (!button) {
    throw new Error(`Could not find current-month day button for day ${day}`);
  }

  return button as HTMLButtonElement;
}

describe('DateSelector', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-11T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('applies preset range immediately', () => {
    const onChange = vi.fn();

    render(<DateSelector onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: /Select dates/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Last 7 Days' }));

    const end = new Date('2026-02-11T12:00:00.000Z');
    const start = new Date('2026-02-11T12:00:00.000Z');
    start.setDate(end.getDate() - 7);

    const expectedStart = start.toISOString().split('T')[0];
    const expectedEnd = end.toISOString().split('T')[0];

    expect(onChange).toHaveBeenCalledWith(expectedStart, expectedEnd);
  });

  it('clears selected range', () => {
    const onChange = vi.fn();

    render(
      <DateSelector
        startDate="2026-02-01"
        endDate="2026-02-11"
        onChange={onChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /2026/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));

    expect(onChange).toHaveBeenCalledWith('', '');
  });

  it('allows manual selection and applies range on Apply', () => {
    const onChange = vi.fn();
    render(<DateSelector onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: /Select dates/i }));
    expect(screen.getByText('Select start date')).toBeTruthy();

    fireEvent.click(getCurrentMonthDayButton('10'));
    expect(screen.getByText('Select end date')).toBeTruthy();

    fireEvent.click(getCurrentMonthDayButton('15'));
    expect(screen.getByText('Range selected')).toBeTruthy();

    expect(onChange).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
    expect(onChange).toHaveBeenCalledWith('2026-02-10', '2026-02-15');
  });

  it('swaps start and end when second date is earlier than first', () => {
    const onChange = vi.fn();
    render(<DateSelector onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: /Select dates/i }));
    fireEvent.click(getCurrentMonthDayButton('20'));
    fireEvent.click(getCurrentMonthDayButton('5'));
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));

    expect(onChange).toHaveBeenCalledWith('2026-02-05', '2026-02-20');
  });

  it('closes popover on outside click and Escape key', () => {
    const onChange = vi.fn();
    render(<DateSelector onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: /Select dates/i }));
    expect(screen.getByRole('dialog')).toBeTruthy();

    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole('dialog')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: /Select dates/i }));
    expect(screen.getByRole('dialog')).toBeTruthy();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('navigates calendar months across year boundaries', () => {
    const onChange = vi.fn();
    render(<DateSelector onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: /Select dates/i }));

    expect(screen.getByText('February 2026')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Previous month' }));
    expect(screen.getByText('January 2026')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Previous month' }));
    expect(screen.getByText('December 2025')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Next month' }));
    expect(screen.getByText('January 2026')).toBeTruthy();
  });

  it('shows preset label and then replaces it after manual apply', () => {
    const onChange = vi.fn();
    render(<DateSelector onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: /Select dates/i }));
    fireEvent.click(screen.getByRole('button', { name: 'This Month' }));
    expect(screen.getByRole('button', { name: /This Month/i })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /This Month/i }));
    fireEvent.click(getCurrentMonthDayButton('10'));
    fireEvent.click(getCurrentMonthDayButton('12'));
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));

    expect(screen.queryByRole('button', { name: /This Month/i })).toBeNull();
    expect(screen.getByRole('button', { name: /Select dates/i })).toBeTruthy();
    expect(onChange).toHaveBeenLastCalledWith('2026-02-10', '2026-02-12');
  });

  it('renders hover preview and today style classes in calendar grid', () => {
    const onChange = vi.fn();
    render(<DateSelector onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: /Select dates/i }));

    const todayButton = getCurrentMonthDayButton('11');
    expect(todayButton.className).toContain(styles.dayToday);

    fireEvent.click(getCurrentMonthDayButton('10'));
    const hoverTarget = getCurrentMonthDayButton('13');
    fireEvent.mouseEnter(hoverTarget);

    const inRangeButton = getCurrentMonthDayButton('12');
    const startButton = getCurrentMonthDayButton('10');
    const endPreviewButton = getCurrentMonthDayButton('13');

    expect(inRangeButton.className).toContain(styles.dayInRange);
    expect(startButton.className).toContain(styles.dayRangeStart);
    expect(endPreviewButton.className).toContain(styles.dayRangeEnd);

    fireEvent.mouseLeave(hoverTarget);
  });

  it('updates displayed range from controlled props', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <DateSelector
        startDate="2026-02-01"
        endDate="2026-02-28"
        onChange={onChange}
      />
    );

    expect(screen.getByRole('button', { name: /Feb .* - Feb .*, 2026/i })).toBeTruthy();

    rerender(<DateSelector onChange={onChange} />);
    expect(screen.getByRole('button', { name: /Select dates/i })).toBeTruthy();
  });
});
