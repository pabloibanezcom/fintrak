'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useRef, useState } from 'react';
import {
  ButtonGroup,
  DropdownMenu,
  Icon,
  type ButtonGroupItem,
  type DropdownMenuItem,
} from '@/components/ui';
import { useSession, useTheme, useUser } from '@/context';
import styles from './TopNav.module.css';

const navTabs: ButtonGroupItem[] = [
  { id: 'overview', href: '/overview', label: 'Overview' },
  { id: 'activity', href: '/activity', label: 'Activity' },
  { id: 'manage', href: '/manage/expenses', label: 'Manage' },
  { id: 'accounts', href: '/accounts', label: 'Account' },
  { id: 'reports', href: '/reports', label: 'Reports' },
];

export function TopNav() {
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useSession();
  const { setTheme, resolvedTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const getActiveTabId = () => {
    if (pathname === '/overview') return 'overview';
    if (pathname.startsWith('/manage')) return 'manage';
    if (pathname.startsWith('/activity')) return 'activity';
    if (pathname.startsWith('/accounts')) return 'accounts';
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
      label: 'Settings',
      href: '/settings',
      icon: <Icon name="settings" size={18} />,
    },
    { type: 'divider' },
    {
      type: 'button',
      label: 'Sign out',
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
                  placeholder="Search..."
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
                  title: searchOpen ? 'Close search' : 'Search',
                  onClick: searchOpen ? handleSearchClose : handleSearchClick,
                },
                {
                  id: 'notifications',
                  icon: <Icon name="notifications" size={20} />,
                  title: 'Notifications',
                },
                {
                  id: 'theme',
                  icon: (
                    <Icon
                      name={resolvedTheme === 'dark' ? 'sun' : 'moon'}
                      size={20}
                    />
                  ),
                  title: resolvedTheme === 'dark' ? 'Light mode' : 'Dark mode',
                  onClick: () =>
                    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'),
                },
              ]}
              orientation="horizontal"
              display="icon"
              variant="actions"
              className={styles.actions}
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
