'use client';

import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';
import { ButtonGroup, Icon, type ButtonGroupItem } from '@/components/ui';

const navItems: (ButtonGroupItem & { iconName: string })[] = [
  {
    id: 'overview',
    href: '/overview',
    label: 'Overview',
    iconName: 'overview',
  },
  {
    id: 'activity',
    href: '/activity',
    label: 'Activity',
    iconName: 'activity',
  },
  {
    id: 'manage',
    href: '/manage/expenses',
    label: 'Manage',
    iconName: 'manage',
  },
  { id: 'accounts', href: '/accounts', label: 'Account', iconName: 'account' },
  { id: 'reports', href: '/reports', label: 'Reports', iconName: 'reports' },
];

export function Sidebar() {
  const pathname = usePathname();

  const getActiveId = () => {
    if (pathname === '/overview') return 'overview';
    if (pathname.startsWith('/activity')) return 'activity';
    if (pathname.startsWith('/manage')) return 'manage';
    if (pathname.startsWith('/accounts')) return 'accounts';
    if (pathname.startsWith('/reports')) return 'reports';
    return '';
  };

  const buttonGroupItems: ButtonGroupItem[] = navItems.map((item) => ({
    id: item.id,
    href: item.href,
    label: item.label,
    title: item.label,
    icon: <Icon name={item.iconName} size={22} />,
  }));

  return (
    <aside className={styles.sidebar}>
      <ButtonGroup
        items={buttonGroupItems}
        orientation="vertical"
        display="icon"
        variant="nav"
        activeId={getActiveId()}
        className={styles.nav}
        showTooltip
        animated
      />
    </aside>
  );
}
