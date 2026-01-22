'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useSession, useTheme, useUser } from '@/context';
import styles from './TopNav.module.css';

const navTabs = [
  { href: '/overview', label: 'Overview' },
  { href: '/activity', label: 'Activity' },
  { href: '/manage/expenses', label: 'Manage' },
  { href: '/accounts', label: 'Account' },
  { href: '/reports', label: 'Reports' },
];

export function TopNav() {
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useSession();
  const { setTheme, resolvedTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) => {
    if (href === '/overview') return pathname === '/overview';
    if (href === '/manage/expenses') return pathname.startsWith('/manage');
    return pathname.startsWith(href);
  };

  const handleSearchClick = () => {
    setSearchOpen(true);
    setTimeout(() => searchInputRef.current?.focus(), 100);
  };

  const handleSearchClose = () => {
    setSearchOpen(false);
    setSearchQuery('');
  };

  const handleSearchBlur = () => {
    if (!searchQuery) {
      setSearchOpen(false);
    }
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  const userName = `${user?.name} ${user?.lastName}` || 'User';
  const userEmail = user?.email || '';

  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <svg
              width="28"
              height="28"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Fintrak Logo"
            >
              <title>Fintrak Logo</title>
              <rect width="40" height="40" rx="12" fill="#FF6B35" />
              <path
                d="M12 14h16M12 20h12M12 26h8"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className={styles.brandName}>Fintrak</span>
        </div>

        <nav className={styles.tabs}>
          {navTabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`${styles.tab} ${isActive(tab.href) ? styles.active : ''}`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>

        <div className={styles.rightSection}>
        <div className={styles.actionsWrapper}>
          <div
            className={`${styles.searchExpandable} ${searchOpen ? styles.open : ''}`}
          >
            <div className={styles.searchBox}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="9"
                  cy="9"
                  r="6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M13.5 13.5L17 17"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                className={styles.searchInput}
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={handleSearchBlur}
              />
            </div>
            <button
              className={styles.actionBtn}
              title="Close search"
              type="button"
              onClick={handleSearchClose}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                aria-label="Close"
              >
                <title>Close</title>
                <path
                  d="M5 5l10 10M15 5L5 15"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div className={styles.actions}>
            <button
              className={styles.actionBtn}
              title="Search"
              type="button"
              onClick={handleSearchClick}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                aria-label="Search"
              >
                <title>Search</title>
                <circle
                  cx="9"
                  cy="9"
                  r="6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M13.5 13.5L17 17"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <button
              className={styles.actionBtn}
              title="Notifications"
              type="button"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                aria-label="Notifications"
              >
                <title>Notifications</title>
                <path
                  d="M10 2a6 6 0 00-6 6v3l-1.5 3h15L16 11V8a6 6 0 00-6-6zM10 18a2 2 0 01-2-2h4a2 2 0 01-2 2z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              className={styles.actionBtn}
              title={resolvedTheme === 'dark' ? 'Light mode' : 'Dark mode'}
              type="button"
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            >
              {resolvedTheme === 'dark' ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-label="Light mode"
                >
                  <title>Light mode</title>
                  <circle
                    cx="12"
                    cy="12"
                    r="5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-label="Dark mode"
                >
                  <title>Dark mode</title>
                  <path
                    d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className={styles.userSection} ref={userMenuRef}>
          <button
            type="button"
            className={styles.userButton}
            onClick={toggleUserMenu}
            aria-expanded={userMenuOpen}
            aria-haspopup="true"
          >
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
            <svg
              className={`${styles.chevron} ${userMenuOpen ? styles.open : ''}`}
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4 6l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {userMenuOpen && (
            <div className={styles.userMenu}>
              <Link
                href="/settings"
                className={styles.userMenuItem}
                onClick={() => setUserMenuOpen(false)}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M12 15a3 3 0 100-6 3 3 0 000 6z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Settings
              </Link>
              <div className={styles.userMenuDivider} />
              <button
                type="button"
                className={styles.userMenuItem}
                onClick={() => {
                  setUserMenuOpen(false);
                  signOut();
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Sign out
              </button>
            </div>
          )}
        </div>
        </div>
      </div>
    </header>
  );
}
