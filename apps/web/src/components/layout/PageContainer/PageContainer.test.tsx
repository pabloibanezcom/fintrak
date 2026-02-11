import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PageContainer } from './PageContainer';

describe('PageContainer', () => {
  it('renders children and custom className', () => {
    render(<PageContainer className="custom-container">Content</PageContainer>);

    const element = screen.getByText('Content');
    expect(element).toBeTruthy();
    expect(element.className).toContain('custom-container');
  });
});
