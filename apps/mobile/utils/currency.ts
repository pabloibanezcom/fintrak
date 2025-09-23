export const getCurrencySymbol = (currencyCode: string): string => {
  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CNY: '¥',
    CAD: 'C$',
    AUD: 'A$',
    CHF: 'CHF',
    SEK: 'kr',
    NOK: 'kr',
    DKK: 'kr',
    PLN: 'zł',
    CZK: 'Kč',
    HUF: 'Ft',
    RON: 'lei',
    BGN: 'лв',
    HRK: 'kn',
    RUB: '₽',
    TRY: '₺',
    INR: '₹',
    KRW: '₩',
    THB: '฿',
    SGD: 'S$',
    MYR: 'RM',
    IDR: 'Rp',
    PHP: '₱',
    VND: '₫',
    BRL: 'R$',
    MXN: '$',
    ARS: '$',
    CLP: '$',
    COP: '$',
    PEN: 'S/',
    UYU: '$U',
    ZAR: 'R',
    EGP: 'E£',
    MAD: 'DH',
    NGN: '₦',
    KES: 'KSh',
    GHS: 'GH₵',
    XOF: 'CFA',
    XAF: 'FCFA',
  };

  return currencySymbols[currencyCode.toUpperCase()] || currencyCode;
};

// Currencies that should have symbols after the amount
const CURRENCIES_WITH_SUFFIX_SYMBOL = ['EUR'];

export const shouldShowSymbolAfter = (currencyCode: string): boolean => {
  return CURRENCIES_WITH_SUFFIX_SYMBOL.includes(currencyCode.toUpperCase());
};

export const formatCurrency = (amount: number, currencyCode: string): string => {
  const symbol = getCurrencySymbol(currencyCode);
  const showSymbolAfter = shouldShowSymbolAfter(currencyCode);

  // Format with proper decimal places
  const formattedAmount = amount.toFixed(2);

  // For negative amounts (expenses), add the minus sign before the symbol
  if (amount < 0) {
    const absAmount = Math.abs(amount).toFixed(2);
    return showSymbolAfter
      ? `-${absAmount} ${symbol}`
      : `-${symbol}${absAmount}`;
  }

  return showSymbolAfter
    ? `${formattedAmount} ${symbol}`
    : `${symbol}${formattedAmount}`;
};

export const formatExpenseAmount = (amount: number, currencyCode: string): string => {
  const symbol = getCurrencySymbol(currencyCode);
  const showSymbolAfter = shouldShowSymbolAfter(currencyCode);
  const absAmount = Math.abs(amount).toFixed(2);

  // For expenses list, we don't show the minus sign since it's implied
  return showSymbolAfter
    ? `${absAmount} ${symbol}`
    : `${symbol}${absAmount}`;
};