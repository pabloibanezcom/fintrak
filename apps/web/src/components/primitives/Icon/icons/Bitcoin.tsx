import type { SVGProps } from 'react';

export function BitcoinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path
        d="M9.5 9.5c.5-1 1.5-1.5 2.5-1.5 1.5 0 2.5 1 2.5 2.5 0 1.5-1.5 2-2.5 2.5V15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="18" r="0.5" fill="currentColor" />
    </svg>
  );
}
