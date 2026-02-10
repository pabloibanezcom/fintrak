import type { SVGProps } from 'react';

export function BudgetIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 22 22" fill="none" {...props}>
      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M11 3v8l5.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
