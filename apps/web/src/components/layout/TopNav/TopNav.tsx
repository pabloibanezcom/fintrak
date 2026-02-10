'use client';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useRef, useState, useTransition } from 'react';
import {
  ButtonGroup,
  type ButtonGroupItem,
  DropdownMenu,
  type DropdownMenuItem,
} from '@/components/features';
import { Icon } from '@/components/primitives';
import { useSession, useSync, useTheme, useUser } from '@/context';
import type { Locale } from '@/i18n/config';
import enFlag from '../LanguageSwitcher/flags/en.png';
import esFlag from '../LanguageSwitcher/flags/es.png';
import styles from './TopNav.module.css';

const LOCALE_COOKIE = 'NEXT_LOCALE';

export function TopNav() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale() as Locale;
  const [, startLocaleTransition] = useTransition();
  const { user } = useUser();
  const { signOut } = useSession();
  const { isSyncing, syncTransactions } = useSync();
  const { setTheme, resolvedTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const toggleLocale = () => {
    const newLocale: Locale = locale === 'en' ? 'es' : 'en';
    document.cookie = `${LOCALE_COOKIE}=${newLocale};path=/;max-age=${60 * 60 * 24 * 365}`;
    startLocaleTransition(() => {
      router.refresh();
    });
  };

  const navTabs: ButtonGroupItem[] = [
    { id: 'overview', href: '/overview', label: t('overview') },
    { id: 'budget', href: '/budget', label: t('budget') },
    { id: 'banking', href: '/banking', label: t('banking') },
    { id: 'investments', href: '/investments', label: t('investments') },
    { id: 'reports', href: '/reports', label: t('reports') },
  ];

  const getActiveTabId = () => {
    if (pathname === '/overview') return 'overview';
    if (pathname.startsWith('/budget')) return 'budget';
    if (pathname.startsWith('/banking')) return 'banking';
    if (pathname.startsWith('/investments')) return 'investments';
    if (pathname.startsWith('/reports')) return 'reports';
    return '';
  };

  const handleSearchClick = () => {
    setSearchOpen(true);
    setTimeout(() => searchInputRef.current?.focus(), 100);
  };

  const handleSearchClose = () => {
    setSearchOpen(false);
    setSearchQuery('');
  };

  const userName = `${user?.name} ${user?.lastName}` || 'User';
  const userEmail = user?.email || '';

  const userMenuItems: DropdownMenuItem[] = [
    {
      type: 'link',
      label: t('settings'),
      href: '/settings',
      icon: <Icon name="settings" size={18} />,
    },
    { type: 'divider' },
    {
      type: 'button',
      label: t('signOut'),
      icon: <Icon name="signOut" size={18} />,
      onClick: signOut,
    },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <Icon name="logo" size={28} aria-label="Fintrak Logo" />
          </div>
          <span className={styles.brandName}>Fintrak</span>
        </div>

        <ButtonGroup
          items={navTabs}
          orientation="horizontal"
          display="text"
          variant="nav"
          activeId={getActiveTabId()}
          className={styles.tabs}
          animated
        />

        <div className={styles.rightSection}>
          <div className={styles.actionsWrapper}>
            <div
              className={`${styles.searchExpandable} ${searchOpen ? styles.open : ''}`}
            >
              <div className={styles.searchBox}>
                <Icon name="search" size={20} />
                <input
                  ref={searchInputRef}
                  type="text"
                  className={styles.searchInput}
                  placeholder={t('searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <ButtonGroup
              items={[
                {
                  id: 'search',
                  icon: (
                    <Icon name={searchOpen ? 'close' : 'search'} size={20} />
                  ),
                  title: searchOpen ? t('closeSearch') : t('search'),
                  onClick: searchOpen ? handleSearchClose : handleSearchClick,
                },
                {
                  id: 'sync',
                  icon: <Icon name={isSyncing ? 'loader' : 'sync'} size={20} />,
                  title: t('sync'),
                  onClick: isSyncing ? undefined : syncTransactions,
                  disabled: isSyncing,
                },
                {
                  id: 'notifications',
                  icon: <Icon name="notifications" size={20} />,
                  title: t('notifications'),
                },
                {
                  id: 'theme',
                  icon: (
                    <Icon
                      name={resolvedTheme === 'dark' ? 'sun' : 'moon'}
                      size={20}
                    />
                  ),
                  title:
                    resolvedTheme === 'dark' ? t('lightMode') : t('darkMode'),
                  onClick: () =>
                    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'),
                },
                {
                  id: 'language',
                  icon: (
                    <Image
                      src={locale === 'en' ? enFlag : esFlag}
                      alt=""
                      width={20}
                      height={20}
                      className={styles.flagIcon}
                    />
                  ),
                  title: t('language'),
                  onClick: toggleLocale,
                },
              ]}
              orientation="horizontal"
              display="icon"
              variant="actions"
              className={styles.actionsGroup}
            />
          </div>

          <DropdownMenu
            items={userMenuItems}
            className={styles.userSection}
            trigger={
              <div className={styles.userButton}>
                <div className={styles.userAvatar}>
                  {user?.profilePicture ? (
                    <Image
                      src={user.profilePicture}
                      alt={userName}
                      className={styles.avatarImg}
                      width={40}
                      height={40}
                    />
                  ) : (
                    <span>{userName[0]}</span>
                  )}
                </div>
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{userName}</span>
                  <span className={styles.userEmail}>{userEmail}</span>
                </div>
                <Icon name="chevronDown" size={16} className={styles.chevron} />
              </div>
            }
          />
        </div>
      </div>
    </header>
  );
}
