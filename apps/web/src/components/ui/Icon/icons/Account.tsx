import type { SVGProps } from 'react';

export function AccountIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 22 22" fill="none" {...props}>
      <rect x="3" y="5" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 9h16" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
