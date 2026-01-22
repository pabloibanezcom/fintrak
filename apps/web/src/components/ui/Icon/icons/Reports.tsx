import type { SVGProps } from 'react';

export function ReportsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 22 22" fill="none" {...props}>
      <path
        d="M5 15V11M9 15V9M13 15V7M17 15V5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
