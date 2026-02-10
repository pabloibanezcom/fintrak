import type { SVGProps } from 'react';

export function BankingIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 22 22" fill="none" {...props}>
      <ellipse
        cx="8"
        cy="16"
        rx="5"
        ry="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M3 16v-2c0-1.1 2.24-2 5-2s5 .9 5 2v2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M3 14v-2c0-1.1 2.24-2 5-2s5 .9 5 2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <ellipse
        cx="14"
        cy="8"
        rx="5"
        ry="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M9 8v2c0 1.1 2.24 2 5 2s5-.9 5-2V8"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M9 6c0-1.1 2.24-2 5-2s5 .9 5 2v2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
