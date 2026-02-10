import type { SVGProps } from 'react';

export function LoaderIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="var(--color-primary-500)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="31.416"
        strokeDashoffset="10"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 12 12"
          to="360 12 12"
          dur="1s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}
