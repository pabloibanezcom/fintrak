import { render } from '@testing-library/react';
import type { ComponentType, SVGProps } from 'react';
import { describe, expect, it } from 'vitest';
import * as iconComponents from './index';

describe('icon components', () => {
  it('renders every exported icon as an svg', () => {
    const entries = Object.entries(iconComponents) as Array<
      [string, ComponentType<SVGProps<SVGSVGElement>>]
    >;

    for (const [name, IconComponent] of entries) {
      const { container, unmount } = render(
        <IconComponent width={24} height={24} aria-label={name} />
      );

      const svg = container.querySelector('svg');
      expect(svg, `${name} should render an svg`).toBeTruthy();
      expect(svg?.getAttribute('width')).toBe('24');
      expect(svg?.getAttribute('height')).toBe('24');

      unmount();
    }
  });
});
