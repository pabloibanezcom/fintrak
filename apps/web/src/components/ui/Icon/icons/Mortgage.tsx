import type { SVGProps } from 'react';

export function MortgageIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      {/* House roof */}
      <path
        d="M2 10L12 2L22 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Chimney */}
      <path
        d="M7 6V3H9V4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* House walls */}
      <path
        d="M4 10V21H20V10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Base */}
      <path
        d="M2 21H22"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Percentage symbol - top circle */}
      <circle cx="9" cy="13" r="1.5" fill="currentColor" />
      {/* Percentage symbol - diagonal line */}
      <path
        d="M8 18L16 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Percentage symbol - bottom circle */}
      <circle cx="15" cy="17" r="1.5" fill="currentColor" />
    </svg>
  );
}
