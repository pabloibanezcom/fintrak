'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

const navItems = [
  {
    href: '/overview',
    label: 'Overview',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect
          x="3"
          y="3"
          width="7"
          height="7"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <rect
          x="12"
          y="3"
          width="7"
          height="7"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <rect
          x="3"
          y="12"
          width="7"
          height="7"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <rect
          x="12"
          y="12"
          width="7"
          height="7"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
  {
    href: '/activity',
    label: 'Activity',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path
          d="M3 11h4l2-6 4 12 2-6h4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: '/manage/expenses',
    label: 'Manage',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path
          d="M11 3v16M7 7l4-4 4 4M7 15l4 4 4-4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: '/accounts',
    label: 'Account',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect
          x="3"
          y="5"
          width="16"
          height="12"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M3 9h16" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    href: '/reports',
    label: 'Reports',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path
          d="M5 15V11M9 15V9M13 15V7M17 15V5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/overview') return pathname === '/overview';
    return pathname.startsWith(href);
  };

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${isActive(item.href) ? styles.active : ''}`}
            title={item.label}
          >
            {item.icon}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
