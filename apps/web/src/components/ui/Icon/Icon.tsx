'use client';

import type { ComponentType, CSSProperties, SVGProps } from 'react';
import {
  AccountIcon,
  ActivityIcon,
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ChevronDownIcon,
  CloseIcon,
  LoaderIcon,
  LogoIcon,
  ManageIcon,
  MoonIcon,
  NotificationsIcon,
  OverviewIcon,
  ReportsIcon,
  SearchIcon,
  SettingsIcon,
  SignOutIcon,
  SpinnerIcon,
  SunIcon,
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
