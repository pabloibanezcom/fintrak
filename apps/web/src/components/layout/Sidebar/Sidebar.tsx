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
      id: 'budget',
      href: '/budget',
      label: t('budget'),
      iconName: 'budget',
    },
    {
      id: 'banking',
      href: '/banking',
      label: t('banking'),
      iconName: 'banking',
    },
    {
      id: 'investments',
      href: '/investments',
      label: t('investments'),
      iconName: 'investments',
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
    if (pathname.startsWith('/budget')) return 'budget';
    if (pathname.startsWith('/banking')) return 'banking';
    if (pathname.startsWith('/investments')) return 'investments';
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
