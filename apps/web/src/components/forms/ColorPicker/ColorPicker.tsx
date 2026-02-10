'use client';

import { useState } from 'react';
import styles from './ColorPicker.module.css';

export interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  colors?: string[];
  label?: string;
  disabled?: boolean;
  allowCustom?: boolean;
}

const DEFAULT_COLORS = [
  '#EF4444', // red
  '#F97316', // orange
  '#F59E0B', // amber
  '#84CC16', // lime
  '#10B981', // emerald
  '#06B6D4', // cyan
  '#3B82F6', // blue
  '#6366F1', // indigo
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#64748B', // slate
  '#1F2937', // gray
];

export function ColorPicker({
  value,
  onChange,
  colors = DEFAULT_COLORS,
  label,
  disabled = false,
  allowCustom = false,
}: ColorPickerProps) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customColor, setCustomColor] = useState(value);

  const handleColorClick = (color: string) => {
    if (disabled) return;
    onChange(color);
    setShowCustomInput(false);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCustomColor(newColor);
    onChange(newColor);
  };

  const isColorInPresets = colors.includes(value);

  return (
    <div className={styles.container}>
      {label && <span className={styles.label}>{label}</span>}

      <div className={styles.colorGrid}>
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            className={`${styles.colorOption} ${
              value === color ? styles.selected : ''
            } ${disabled ? styles.disabled : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => handleColorClick(color)}
            disabled={disabled}
            aria-label={`Select color ${color}`}
          />
        ))}

        {allowCustom && (
          <>
            {!isColorInPresets && !showCustomInput && (
              <button
                type="button"
                className={`${styles.colorOption} ${styles.selected} ${
                  disabled ? styles.disabled : ''
                }`}
                style={{ backgroundColor: value }}
                onClick={() => setShowCustomInput(true)}
                disabled={disabled}
                aria-label="Custom color"
              />
            )}

            <button
              type="button"
              className={`${styles.customButton} ${
                disabled ? styles.disabled : ''
              }`}
              onClick={() => setShowCustomInput(!showCustomInput)}
              disabled={disabled}
              aria-label="Add custom color"
            >
              +
            </button>
          </>
        )}
      </div>

      {allowCustom && showCustomInput && (
        <div className={styles.customInputContainer}>
          <input
            type="color"
            value={customColor}
            onChange={handleCustomColorChange}
            className={styles.colorInput}
            disabled={disabled}
          />
          <input
            type="text"
            value={customColor}
            onChange={(e) => {
              const newColor = e.target.value;
              setCustomColor(newColor);
              if (/^#[0-9A-F]{6}$/i.test(newColor)) {
                onChange(newColor);
              }
            }}
            className={styles.textInput}
            placeholder="#000000"
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );
}
