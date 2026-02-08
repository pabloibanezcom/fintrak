'use client';

import type { ComponentType, CSSProperties, SVGProps } from 'react';
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  BankingIcon,
  BudgetIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  CloseIcon,
  InvestmentsIcon,
  LinkExternalIcon,
  LoaderIcon,
  LogoIcon,
  MoonIcon,
  NotificationsIcon,
  OverviewIcon,
  ReportsIcon,
  SearchIcon,
  BitcoinIcon,
  ChartLineIcon,
  EyeIcon,
  EyeOffIcon,
  GoogleIcon,
  LayersIcon,
  SettingsIcon,
  SignOutIcon,
  SpinnerIcon,
  SunIcon,
  SyncIcon,
  TransferIcon,
  ShoppingIcon,
  EntertainmentIcon,
  MortgageIcon,
  TaxIcon,
  PayrollIcon,
  OtherIcon,
  HealthIcon,
  InsuranceIcon,
  UtilitiesIcon,
  GroceryIcon,
  TransportIcon,
} from './icons';

const iconMap: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  arrowDown: ArrowDownIcon,
  arrowLeft: ArrowLeftIcon,
  arrowRight: ArrowRightIcon,
  arrowUp: ArrowUpIcon,
  banking: BankingIcon,
  bitcoin: BitcoinIcon,
  budget: BudgetIcon,
  calendar: CalendarIcon,
  chartLine: ChartLineIcon,
  check: CheckIcon,
  chevronDown: ChevronDownIcon,
  close: CloseIcon,
  eye: EyeIcon,
  eyeOff: EyeOffIcon,
  google: GoogleIcon,
  investments: InvestmentsIcon,
  layers: LayersIcon,
  linkExternal: LinkExternalIcon,
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
  sync: SyncIcon,
  transfer: TransferIcon,
  shopping: ShoppingIcon,
  entertainment: EntertainmentIcon,
  mortgage: MortgageIcon,
  tax: TaxIcon,
  payroll: PayrollIcon,
  other: OtherIcon,
  health: HealthIcon,
  insurance: InsuranceIcon,
  utilities: UtilitiesIcon,
  grocery: GroceryIcon,
  transport: TransportIcon,
};

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  style?: CSSProperties;
  'aria-label'?: string;
  'aria-hidden'?: boolean;
}

export function isValidIconName(name: string): boolean {
  return name in iconMap;
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
