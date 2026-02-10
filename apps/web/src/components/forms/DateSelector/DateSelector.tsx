'use client';

import { useEffect, useRef, useState } from 'react';
import { Button, Icon } from '@/components/primitives';
import { formatDate } from '@/utils';
import styles from './DateSelector.module.css';

interface DatePreset {
  label: string;
  getValue: () => { start: string; end: string };
}

export interface DateSelectorProps {
  startDate?: string;
  endDate?: string;
  onChange: (start: string, end: string) => void;
  className?: string;
}

const PRESETS: DatePreset[] = [
  {
    label: 'This Month',
    getValue: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0],
      };
    },
  },
  {
    label: 'Last 7 Days',
    getValue: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 7);
      return {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0],
      };
    },
  },
  {
    label: 'Last 30 Days',
    getValue: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 30);
      return {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0],
      };
    },
  },
  {
    label: 'Last 90 Days',
    getValue: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 90);
      return {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0],
      };
    },
  },
  {
    label: 'This Year',
    getValue: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 1);
      const end = new Date(now.getFullYear(), 11, 31);
      return {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0],
      };
    },
  },
];

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function toDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function isSameDay(d1: Date | null, d2: Date | null): boolean {
  if (!d1 || !d2) return false;
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function isInRange(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false;
  const time = date.getTime();
  return time > start.getTime() && time < end.getTime();
}

interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

function getCalendarDays(year: number, month: number): CalendarDay[] {
  const today = new Date();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = firstDay.getDay();
  const days: CalendarDay[] = [];

  // Previous month days
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startOffset - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i;
    const date = new Date(year, month - 1, day);
    days.push({
      date,
      day,
      isCurrentMonth: false,
      isToday: isSameDay(date, today),
    });
  }

  // Current month days
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(year, month, day);
    days.push({
      date,
      day,
      isCurrentMonth: true,
      isToday: isSameDay(date, today),
    });
  }

  // Next month days to fill the grid
  const remaining = 42 - days.length;
  for (let day = 1; day <= remaining; day++) {
    const date = new Date(year, month + 1, day);
    days.push({
      date,
      day,
      isCurrentMonth: false,
      isToday: isSameDay(date, today),
    });
  }

  return days;
}

export function DateSelector({
  startDate,
  endDate,
  onChange,
  className,
}: DateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [tempStart, setTempStart] = useState<string>(startDate || '');
  const [tempEnd, setTempEnd] = useState<string>(endDate || '');
  const [selectingEnd, setSelectingEnd] = useState(false);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [presetLabel, setPresetLabel] = useState<string | null>(null);
  const [tempPresetLabel, setTempPresetLabel] = useState<string | null>(null);

  // View state for calendar
  const now = new Date();
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [viewYear, setViewYear] = useState(now.getFullYear());

  useEffect(() => {
    setTempStart(startDate || '');
    setTempEnd(endDate || '');
    setSelectingEnd(false);

    // Clear preset label if dates are cleared from outside
    if (!startDate && !endDate) {
      setPresetLabel(null);
      setTempPresetLabel(null);
    }

    // Update view to show selected dates
    if (startDate) {
      const d = parseDate(startDate);
      if (d) {
        setViewMonth(d.getMonth());
        setViewYear(d.getFullYear());
      }
    }
  }, [startDate, endDate]);

  const toggleMenu = () => {
    if (!isOpen) {
      // Sync temp state when opening
      setTempPresetLabel(presetLabel);
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleApply = () => {
    onChange(tempStart, tempEnd);
    setPresetLabel(tempPresetLabel);
    setIsOpen(false);
  };

  const handleClear = () => {
    setTempStart('');
    setTempEnd('');
    setTempPresetLabel(null);
    setSelectingEnd(false);
    onChange('', '');
    setPresetLabel(null);
    setIsOpen(false);
  };

  const handlePresetClick = (preset: DatePreset) => {
    const { start, end } = preset.getValue();
    setTempStart(start);
    setTempEnd(end);
    setTempPresetLabel(preset.label);
    setSelectingEnd(false);

    // Apply immediately
    onChange(start, end);
    setPresetLabel(preset.label);
    setIsOpen(false);
  };

  const handleDateClick = (date: Date) => {
    const dateStr = toDateString(date);
    setTempPresetLabel(null); // Clear preset when manually selecting

    if (!selectingEnd || !tempStart) {
      // First click: set start date
      setTempStart(dateStr);
      setTempEnd('');
      setSelectingEnd(true);
    } else {
      // Second click: set end date
      const startD = parseDate(tempStart);
      if (startD && date < startD) {
        // If clicked date is before start, swap them
        setTempStart(dateStr);
        setTempEnd(tempStart);
      } else {
        setTempEnd(dateStr);
      }
      setSelectingEnd(false);
    }
  };

  const goToPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const displayText = presetLabel
    ? presetLabel
    : startDate && endDate
      ? `${formatDate(startDate)} - ${formatDate(endDate)}`
      : 'Select dates';

  const startDateObj = parseDate(tempStart);
  const endDateObj = parseDate(tempEnd);

  const days = getCalendarDays(viewYear, viewMonth);

  // For hover preview during selection
  const previewEnd = selectingEnd && hoverDate ? hoverDate : null;
  const effectiveEnd = endDateObj || previewEnd;

  return (
    <div className={`${styles.wrapper} ${className || ''}`} ref={containerRef}>
      <label className={styles.label}>Date Range</label>
      <button
        type="button"
        className={`${styles.trigger} ${isOpen ? styles.open : ''}`}
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <div className={styles.triggerContent}>
          <Icon name="calendar" className={styles.icon} />
          <span className={styles.value}>{displayText}</span>
        </div>
        <Icon
          name="chevronDown"
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
        />
      </button>

      {isOpen && (
        <div className={styles.popover} role="dialog">
          <div className={styles.presets}>
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                className={styles.presetButton}
                onClick={() => handlePresetClick(preset)}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className={styles.divider} />

          <div className={styles.selectionHint}>
            {!tempStart
              ? 'Select start date'
              : selectingEnd
                ? 'Select end date'
                : tempEnd
                  ? 'Range selected'
                  : 'Select end date'}
          </div>

          <div className={styles.calendar}>
            <div className={styles.calendarHeader}>
              <button
                type="button"
                className={styles.calendarNavButton}
                onClick={goToPrevMonth}
                aria-label="Previous month"
              >
                <Icon name="arrowLeft" className={styles.calendarNavIcon} />
              </button>
              <span className={styles.calendarTitle}>
                {MONTHS[viewMonth]} {viewYear}
              </span>
              <button
                type="button"
                className={styles.calendarNavButton}
                onClick={goToNextMonth}
                aria-label="Next month"
              >
                <Icon name="arrowRight" className={styles.calendarNavIcon} />
              </button>
            </div>

            <div className={styles.weekDays}>
              {WEEKDAYS.map((day) => (
                <span key={day} className={styles.weekDay}>
                  {day}
                </span>
              ))}
            </div>

            <div className={styles.days}>
              {days.map((day, idx) => {
                const isStart = isSameDay(day.date, startDateObj);
                const isEnd = isSameDay(day.date, endDateObj);

                // Calculate range including hover preview
                let inRange = false;
                let isRangeStart = isStart;
                let isRangeEnd = isEnd;

                if (startDateObj && effectiveEnd) {
                  const effectiveStart =
                    startDateObj <= effectiveEnd ? startDateObj : effectiveEnd;
                  const effectiveEndDate =
                    startDateObj <= effectiveEnd ? effectiveEnd : startDateObj;
                  inRange = isInRange(
                    day.date,
                    effectiveStart,
                    effectiveEndDate
                  );
                  isRangeStart = isSameDay(day.date, effectiveStart);
                  isRangeEnd = isSameDay(day.date, effectiveEndDate);
                }

                const isSelected = isStart || isEnd;

                const classNames = [
                  styles.day,
                  !day.isCurrentMonth && styles.dayOutside,
                  day.isToday && !isSelected && styles.dayToday,
                  isSelected && styles.daySelected,
                  inRange && styles.dayInRange,
                  isRangeStart && styles.dayRangeStart,
                  isRangeEnd && styles.dayRangeEnd,
                ]
                  .filter(Boolean)
                  .join(' ');

                return (
                  <button
                    key={idx}
                    type="button"
                    className={classNames}
                    onClick={() => handleDateClick(day.date)}
                    onMouseEnter={() => setHoverDate(day.date)}
                    onMouseLeave={() => setHoverDate(null)}
                  >
                    {day.day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.actions}>
            <Button variant="ghost" size="sm" onClick={handleClear}>
              Clear
            </Button>
            <Button variant="primary" size="sm" onClick={handleApply}>
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
