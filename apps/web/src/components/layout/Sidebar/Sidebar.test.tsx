import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Sidebar } from './Sidebar';

type ButtonGroupProps = {
  activeId?: string;
  items: Array<{ id: string; label?: string }>;
  orientation?: string;
  display?: string;
};

const buttonGroupSpy = vi.fn<(props: ButtonGroupProps) => JSX.Element>();
const pathnameState = {
  value: '/banking/transactions',
};

vi.mock('next/navigation', () => ({
  usePathname: () => pathnameState.value,
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@/components/primitives', async () => {
  const actual = await vi.importActual<
    typeof import('@/components/primitives')
  >('@/components/primitives');

  return {
    ...actual,
    Icon: ({ name }: { name: string }) => <span data-testid={`icon-${name}`} />,
  };
});

vi.mock('@/components/features', () => ({
  ButtonGroup: (props: ButtonGroupProps) => {
    buttonGroupSpy(props);
    return <div data-testid="sidebar-button-group" />;
  },
}));

describe('Sidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    pathnameState.value = '/banking/transactions';
  });

  it('passes expected navigation props to ButtonGroup', () => {
    render(<Sidebar />);

    expect(screen.getByTestId('sidebar-button-group')).toBeTruthy();
    expect(buttonGroupSpy).toHaveBeenCalledTimes(1);

    const props = buttonGroupSpy.mock.calls[0][0];
    expect(props.activeId).toBe('banking');
    expect(props.orientation).toBe('vertical');
    expect(props.display).toBe('icon');
    expect(props.items).toHaveLength(5);
  });

  it('marks overview active when pathname is /overview', () => {
    pathnameState.value = '/overview';
    render(<Sidebar />);

    const props = buttonGroupSpy.mock.calls[0][0];
    expect(props.activeId).toBe('overview');
  });

  it('marks reports active for nested reports route', () => {
    pathnameState.value = '/reports/monthly';
    render(<Sidebar />);

    const props = buttonGroupSpy.mock.calls[0][0];
    expect(props.activeId).toBe('reports');
  });

  it('returns empty active id when route does not match known nav items', () => {
    pathnameState.value = '/settings/profile';
    render(<Sidebar />);

    const props = buttonGroupSpy.mock.calls[0][0];
    expect(props.activeId).toBe('');
  });
});
