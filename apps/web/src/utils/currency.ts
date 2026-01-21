const currencySymbols: Record<string, string> = {
  EUR: '\u20AC',
  USD: '$',
  GBP: '\u00A3',
};

const currencyLocales: Record<string, string> = {
  EUR: 'de-DE',
  USD: 'en-US',
  GBP: 'en-GB',
};

export function formatCurrency(
  amount: number,
  currency: string = 'EUR',
  options?: { showSymbol?: boolean; compact?: boolean }
): string {
  const { showSymbol = true, compact = false } = options || {};
  const locale = currencyLocales[currency] || 'en-US';

  const formatter = new Intl.NumberFormat(locale, {
    style: showSymbol ? 'currency' : 'decimal',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    notation: compact ? 'compact' : 'standard',
  });

  return formatter.format(amount);
}

export function getCurrencySymbol(currency: string): string {
  return currencySymbols[currency] || currency;
}

export function formatPercentage(
  value: number,
  options?: { showSign?: boolean }
): string {
  const { showSign = true } = options || {};
  const formatted = Math.abs(value).toFixed(1);
  const sign = showSign && value > 0 ? '+' : value < 0 ? '-' : '';
  return `${sign}${formatted}%`;
}
