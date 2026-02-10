import type { SVGProps } from 'react';

export function SyncIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M21 12C21 16.9706 16.9706 21 12 21C9.69494 21 7.59227 20.1334 6 18.7083L3 21V15H9L6.4 17.6C7.6 18.8 9.3 19.5 11.1 19.5C15.6 19.5 19.5 15.6 19.5 12H21Z"
        fill="currentColor"
      />
      <path
        d="M3 12C3 7.02944 7.02944 3 12 3C14.3051 3 16.4077 3.86656 18 5.29168L21 3V9H15L17.6 6.4C16.4 5.2 14.7 4.5 12.9 4.5C8.4 4.5 4.5 8.4 4.5 12H3Z"
        fill="currentColor"
      />
    </svg>
  );
}
