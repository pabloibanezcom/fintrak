import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LanguageSwitcher } from './LanguageSwitcher';

const refreshSpy = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: refreshSpy,
  }),
}));

vi.mock('next-intl', () => ({
  useLocale: () => 'en',
  useTranslations: () => (key: string) =>
    key === 'language' ? 'Language' : key,
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

describe('LanguageSwitcher', () => {
  it('toggles locale cookie and refreshes router', () => {
    render(<LanguageSwitcher />);

    const button = screen.getByRole('button', { name: 'English' });
    fireEvent.click(button);

    expect(document.cookie).toContain('NEXT_LOCALE=es');
    expect(refreshSpy).toHaveBeenCalledTimes(1);
  });
});
