'use client';

import type { CSSProperties } from 'react';

export type IconName =
  | 'logo'
  | 'search'
  | 'close'
  | 'notifications'
  | 'sun'
  | 'moon'
  | 'chevronDown'
  | 'settings'
  | 'signOut'
  | 'overview'
  | 'activity'
  | 'manage'
  | 'account'
  | 'reports'
  | 'arrowUp'
  | 'arrowDown'
  | 'arrowRight'
  | 'arrowLeft'
  | 'spinner';

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  style?: CSSProperties;
  'aria-label'?: string;
  'aria-hidden'?: boolean;
}

const icons: Record<IconName, (size: number) => React.ReactElement> = {
  logo: (size) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="40" height="40" rx="12" fill="#FF6B35" />
      <path
        d="M12 14h16M12 20h12M12 26h8"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  ),

  search: (size) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M13.5 13.5L17 17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),

  close: (size) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path
        d="M5 5l10 10M15 5L5 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),

  notifications: (size) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path
        d="M10 2a6 6 0 00-6 6v3l-1.5 3h15L16 11V8a6 6 0 00-6-6zM10 18a2 2 0 01-2-2h4a2 2 0 01-2 2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  sun: (size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),

  moon: (size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  chevronDown: (size) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  settings: (size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 15a3 3 0 100-6 3 3 0 000 6z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  signOut: (size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  overview: (size) => (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <rect
        x="3"
        y="3"
        width="7"
        height="7"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="12"
        y="3"
        width="7"
        height="7"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="3"
        y="12"
        width="7"
        height="7"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="12"
        y="12"
        width="7"
        height="7"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  ),

  activity: (size) => (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <path
        d="M3 11h4l2-6 4 12 2-6h4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  manage: (size) => (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <path
        d="M11 3v16M7 7l4-4 4 4M7 15l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  account: (size) => (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <rect
        x="3"
        y="5"
        width="16"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M3 9h16" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),

  reports: (size) => (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <path
        d="M5 15V11M9 15V9M13 15V7M17 15V5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),

  arrowUp: (size) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path
        d="M8 3v10M4 7l4-4 4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  arrowDown: (size) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path
        d="M8 13V3M4 9l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  arrowRight: (size) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path
        d="M2 8h12M10 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  arrowLeft: (size) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path
        d="M14 8H2M6 4L2 8l4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  spinner: (size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="31.4 31.4"
        strokeDashoffset="0"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 12 12"
          to="360 12 12"
          dur="1s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  ),
};

export function Icon({
  name,
  size = 20,
  className,
  style,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden = !ariaLabel,
}: IconProps) {
  const icon = icons[name](size);

  return (
    <span
      className={className}
      style={{ display: 'inline-flex', ...style }}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      role={ariaLabel ? 'img' : undefined}
    >
      {icon}
    </span>
  );
}
