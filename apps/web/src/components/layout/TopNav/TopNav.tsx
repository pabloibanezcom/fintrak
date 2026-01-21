'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useUser } from '@/context';
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

  const isActive = (href: string) => {
    if (href === '/overview') return pathname === '/overview';
    if (href === '/manage/expenses')
      return pathname.startsWith('/manage');
    return pathname.startsWith(href);
  };

  const userName = user?.name || user?.email?.split('@')[0] || 'User';

  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <svg
              width="36"
              height="36"
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

        <div className={styles.right}>
          <div className={styles.userSection}>
            <span className={styles.userName}>{userName}</span>
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
          </div>
          
          <button className={styles.iconBtn} title="Notifications" type="button">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-label="Notifications">
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

          <button className={styles.iconBtn} title="Bookmark" type="button">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-label="Bookmark">
              <title>Bookmark</title>
              <path
                d="M5 3h10a1 1 0 011 1v14l-6-3-6 3V4a1 1 0 011-1z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

    </header>
  );
}
