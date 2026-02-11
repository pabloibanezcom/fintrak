import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Card } from './Card';

describe('Card', () => {
  it('renders children and forwards ref', () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <Card ref={ref} data-testid="card" aria-label="summary card">
        Total Balance
      </Card>
    );

    expect(screen.getByText('Total Balance')).toBeTruthy();
    expect(ref.current?.tagName).toBe('DIV');
    expect(screen.getByTestId('card').getAttribute('aria-label')).toBe(
      'summary card'
    );
  });

  it('keeps custom className', () => {
    render(<Card className="custom-card">Content</Card>);

    expect(screen.getByText('Content').className).toContain('custom-card');
  });
});
