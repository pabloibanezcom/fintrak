'use client';

import type { CSSProperties, ComponentType, SVGProps } from 'react';
import {
  LogoIcon,
  SearchIcon,
  CloseIcon,
  NotificationsIcon,
  SunIcon,
  MoonIcon,
  ChevronDownIcon,
  SettingsIcon,
  SignOutIcon,
  OverviewIcon,
  ActivityIcon,
  ManageIcon,
  AccountIcon,
  ReportsIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  SpinnerIcon,
  LoaderIcon,
} from './icons';

const iconMap: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  logo: LogoIcon,
  search: SearchIcon,
  close: CloseIcon,
  notifications: NotificationsIcon,
  sun: SunIcon,
  moon: MoonIcon,
  chevronDown: ChevronDownIcon,
  settings: SettingsIcon,
  signOut: SignOutIcon,
  overview: OverviewIcon,
  activity: ActivityIcon,
  manage: ManageIcon,
  account: AccountIcon,
  reports: ReportsIcon,
  arrowUp: ArrowUpIcon,
  arrowDown: ArrowDownIcon,
  arrowRight: ArrowRightIcon,
  arrowLeft: ArrowLeftIcon,
  spinner: SpinnerIcon,
  loader: LoaderIcon,
};

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  style?: CSSProperties;
  'aria-label'?: string;
  'aria-hidden'?: boolean;
}

export function Icon({
  name,
  size = 20,
  className,
  style,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden = !ariaLabel,
}: IconProps) {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <span
      className={className}
      style={{ display: 'inline-flex', ...style }}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      role={ariaLabel ? 'img' : undefined}
    >
      <IconComponent width={size} height={size} />
    </span>
  );
}
