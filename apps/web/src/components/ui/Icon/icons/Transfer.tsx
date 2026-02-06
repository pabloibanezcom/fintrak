import type { SVGProps } from 'react';

export function TransferIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M20 7H4C3.44772 7 3 7.44772 3 8C3 8.55228 3.44772 9 4 9H20C20.5523 9 21 8.55228 21 8C21 7.44772 20.5523 7 20 7Z"
        fill="currentColor"
      />
      <path
        d="M17 4L21 8L17 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 15H20C20.5523 15 21 15.4477 21 16C21 16.5523 20.5523 17 20 17H4C3.44772 17 3 16.5523 3 16C3 15.4477 3.44772 15 4 15Z"
        fill="currentColor"
      />
      <path
        d="M7 12L3 16L7 20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
