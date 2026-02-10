import type { SVGProps } from 'react';

export function LogoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>FinTrak Logo</title>
      <rect width="40" height="40" rx="12" fill="var(--color-primary-500)" />
      <path
        d="M12 14h16M12 20h12M12 26h8"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
