import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TopNav } from './TopNav';

const refreshSpy = vi.fn();
const setThemeSpy = vi.fn();
const signOutSpy = vi.fn();
const syncTransactionsSpy = vi.fn();

const userState = {
  name: 'Jane',
  lastName: 'Doe',
  email: 'jane@fintrak.app',
  profilePicture: undefined as string | undefined,
};

const pathnameState = {
  value: '/budget/categories',
};

const localeState = {
  value: 'en' as 'en' | 'es',
};

const syncState = {
  isSyncing: false,
};

const themeState = {
  resolvedTheme: 'light' as 'light' | 'dark',
};

type ButtonGroupProps = {
  items: Array<{
    id: string;
    label?: string;
    title?: string;
    onClick?: () => void;
    disabled?: boolean;
  }>;
  activeId?: string;
};

const buttonGroupSpy = vi.fn<(props: ButtonGroupProps) => JSX.Element>();

vi.mock('next/navigation', () => ({
  usePathname: () => pathnameState.value,
  useRouter: () => ({
    refresh: refreshSpy,
  }),
}));

vi.mock('next-intl', () => ({
  useLocale: () => localeState.value,
  useTranslations: () => (key: string) =>
    (
      ({
        overview: 'Overview',
        budget: 'Budget',
        banking: 'Banking',
        investments: 'Investments',
        reports: 'Reports',
        settings: 'Settings',
        signOut: 'Sign out',
        search: 'Search',
        closeSearch: 'Close search',
        sync: 'Sync',
        notifications: 'Notifications',
        darkMode: 'Dark mode',
        lightMode: 'Light mode',
        language: 'Language',
        searchPlaceholder: 'Search transactions...',
      }) as Record<string, string>
    )[key] || key,
}));

vi.mock('@/context', () => ({
  useUser: () => ({ user: userState }),
  useSession: () => ({ signOut: signOutSpy }),
  useSync: () => ({
    isSyncing: syncState.isSyncing,
    syncTransactions: syncTransactionsSpy,
  }),
  useTheme: () => ({
    resolvedTheme: themeState.resolvedTheme,
    setTheme: setThemeSpy,
  }),
}));

vi.mock('@/components/features', () => ({
  ButtonGroup: (props: ButtonGroupProps) => {
    buttonGroupSpy(props);
    return (
      <div>
        {props.items.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-label={item.title || item.label || item.id}
            onClick={item.onClick}
            disabled={item.disabled}
          >
            {item.label || item.title || item.id}
          </button>
        ))}
      </div>
    );
  },
  DropdownMenu: ({
    trigger,
    items,
  }: {
    trigger: React.ReactNode;
    items: Array<{
      type: 'button' | 'link' | 'divider';
      label?: string;
      onClick?: () => void;
      href?: string;
    }>;
  }) => (
    <div>
      <div data-testid="user-trigger">{trigger}</div>
      {items.map((item, idx) =>
        item.type === 'button' ? (
          <button key={idx} type="button" onClick={item.onClick}>
            {item.label}
          </button>
        ) : item.type === 'link' ? (
          <a key={idx} href={item.href}>
            {item.label}
          </a>
        ) : (
          <span key={idx}>divider</span>
        )
      )}
    </div>
  ),
}));

vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => (
    <>
      {/* biome-ignore lint/performance/noImgElement: test mock for next/image */}
      {/* biome-ignore lint/a11y/useAltText: alt is passed by the component under test */}
      <img {...props} />
    </>
  ),
}));

describe('TopNav', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    pathnameState.value = '/budget/categories';
    localeState.value = 'en';
    userState.profilePicture = undefined;
    syncState.isSyncing = false;
    themeState.resolvedTheme = 'light';
  });

  it('renders user information and marks budget as active tab', () => {
    render(<TopNav />);

    expect(screen.getByText('Fintrak')).toBeTruthy();
    expect(screen.getByText('Jane Doe')).toBeTruthy();
    expect(screen.getByText('jane@fintrak.app')).toBeTruthy();

    expect(buttonGroupSpy).toHaveBeenCalled();
    expect(buttonGroupSpy.mock.calls[0][0].activeId).toBe('budget');
  });

  it('triggers sync, theme toggle, locale toggle and sign out actions', async () => {
    render(<TopNav />);

    fireEvent.click(screen.getByRole('button', { name: 'Sync' }));
    fireEvent.click(screen.getByRole('button', { name: 'Dark mode' }));
    fireEvent.click(screen.getByRole('button', { name: 'Language' }));
    fireEvent.click(screen.getByRole('button', { name: 'Sign out' }));

    expect(syncTransactionsSpy).toHaveBeenCalledTimes(1);
    expect(setThemeSpy).toHaveBeenCalledWith('dark');
    expect(document.cookie).toContain('NEXT_LOCALE=es');
    expect(signOutSpy).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(refreshSpy).toHaveBeenCalledTimes(1);
    });
  });

  it('disables sync action while syncing', () => {
    syncState.isSyncing = true;

    render(<TopNav />);

    const syncButton = screen.getByRole('button', { name: 'Sync' });
    expect(syncButton).toHaveProperty('disabled', true);

    fireEvent.click(syncButton);
    expect(syncTransactionsSpy).not.toHaveBeenCalled();
  });

  it('handles search open and close, clearing the query', () => {
    render(<TopNav />);

    const searchInput = screen.getByPlaceholderText('Search transactions...');
    fireEvent.change(searchInput, { target: { value: 'rent' } });
    expect((searchInput as HTMLInputElement).value).toBe('rent');

    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    fireEvent.click(screen.getByRole('button', { name: 'Close search' }));

    expect((searchInput as HTMLInputElement).value).toBe('');
  });

  it('renders profile image when the user has a profile picture', () => {
    userState.profilePicture = 'https://example.com/avatar.png';

    render(<TopNav />);

    expect(screen.getByAltText('Jane Doe')).toBeTruthy();
  });

  it('maps reports path to active reports tab', () => {
    pathnameState.value = '/reports/monthly';
    render(<TopNav />);

    expect(buttonGroupSpy.mock.calls[0][0].activeId).toBe('reports');
  });

  it('uses empty active tab for unknown routes', () => {
    pathnameState.value = '/help';
    render(<TopNav />);

    expect(buttonGroupSpy.mock.calls[0][0].activeId).toBe('');
  });

  it('toggles language from es to en and theme from dark to light', async () => {
    localeState.value = 'es';
    themeState.resolvedTheme = 'dark';

    render(<TopNav />);

    fireEvent.click(screen.getByRole('button', { name: 'Light mode' }));
    fireEvent.click(screen.getByRole('button', { name: 'Language' }));

    expect(setThemeSpy).toHaveBeenCalledWith('light');
    expect(document.cookie).toContain('NEXT_LOCALE=en');

    await waitFor(() => {
      expect(refreshSpy).toHaveBeenCalledTimes(1);
    });
  });
});
