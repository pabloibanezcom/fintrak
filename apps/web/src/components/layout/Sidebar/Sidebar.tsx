'use client';

import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ButtonGroup, type ButtonGroupItem, Icon } from '@/components/ui';
import styles from './Sidebar.module.css';

export function Sidebar() {
  const t = useTranslations('nav');
  const pathname = usePathname();

  const navItems: (ButtonGroupItem & { iconName: string })[] = [
    {
      id: 'overview',
      href: '/overview',
      label: t('overview'),
      iconName: 'overview',
    },
    {
      id: 'activity',
      href: '/activity',
      label: t('activity'),
      iconName: 'activity',
    },
    {
      id: 'manage',
      href: '/manage/expenses',
      label: t('manage'),
      iconName: 'manage',
    },
    {
      id: 'accounts',
      href: '/accounts',
      label: t('account'),
      iconName: 'account',
    },
    {
      id: 'reports',
      href: '/reports',
      label: t('reports'),
      iconName: 'reports',
    },
  ];

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
