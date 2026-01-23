'use client';

import type { ComponentType, CSSProperties, SVGProps } from 'react';
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  BankingIcon,
  BudgetIcon,
  ChevronDownIcon,
  CloseIcon,
  InvestmentsIcon,
  LoaderIcon,
  LogoIcon,
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
  arrowDown: ArrowDownIcon,
  arrowLeft: ArrowLeftIcon,
  arrowRight: ArrowRightIcon,
  arrowUp: ArrowUpIcon,
  banking: BankingIcon,
  budget: BudgetIcon,
  chevronDown: ChevronDownIcon,
  close: CloseIcon,
  investments: InvestmentsIcon,
  loader: LoaderIcon,
  logo: LogoIcon,
  moon: MoonIcon,
  notifications: NotificationsIcon,
  overview: OverviewIcon,
  reports: ReportsIcon,
  search: SearchIcon,
  settings: SettingsIcon,
  signOut: SignOutIcon,
  spinner: SpinnerIcon,
  sun: SunIcon,
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
