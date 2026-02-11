import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders content and forwards ref', () => {
    const ref = createRef<HTMLSpanElement>();

    render(
      <Badge ref={ref} data-testid="badge" title="Account status">
        Active
      </Badge>
    );

    expect(screen.getByText('Active')).toBeTruthy();
    expect(ref.current?.tagName).toBe('SPAN');
    expect(screen.getByTestId('badge').getAttribute('title')).toBe(
      'Account status'
    );
  });

  it('keeps custom className', () => {
    render(<Badge className="custom-badge">VIP</Badge>);

    expect(screen.getByText('VIP').className).toContain('custom-badge');
  });
});
