import type { SVGProps } from 'react';

export function GroceryIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="21" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="19" cy="21" r="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
