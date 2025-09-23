import { getCurrencySymbol, formatExpenseAmount, formatCurrency, shouldShowSymbolAfter } from '../currency';

describe('Currency Utils', () => {
  describe('getCurrencySymbol', () => {
    it('should return correct symbols for supported currencies', () => {
      expect(getCurrencySymbol('USD')).toBe('$');
      expect(getCurrencySymbol('EUR')).toBe('€');
      expect(getCurrencySymbol('GBP')).toBe('£');
    });

    it('should handle lowercase currency codes', () => {
      expect(getCurrencySymbol('usd')).toBe('$');
      expect(getCurrencySymbol('eur')).toBe('€');
      expect(getCurrencySymbol('gbp')).toBe('£');
    });

    it('should return the original code for unsupported currencies', () => {
      expect(getCurrencySymbol('XYZ')).toBe('XYZ');
    });
  });

  describe('shouldShowSymbolAfter', () => {
    it('should return true for EUR', () => {
      expect(shouldShowSymbolAfter('EUR')).toBe(true);
      expect(shouldShowSymbolAfter('eur')).toBe(true);
    });

    it('should return false for other currencies', () => {
      expect(shouldShowSymbolAfter('USD')).toBe(false);
      expect(shouldShowSymbolAfter('GBP')).toBe(false);
    });
  });

  describe('formatExpenseAmount', () => {
    it('should format expense amounts without minus sign (implied negative)', () => {
      expect(formatExpenseAmount(100, 'USD')).toBe('$100.00');
      expect(formatExpenseAmount(25.99, 'EUR')).toBe('25.99 €');
      expect(formatExpenseAmount(50, 'GBP')).toBe('£50.00');
    });

    it('should handle negative amounts by converting to positive', () => {
      expect(formatExpenseAmount(-100, 'USD')).toBe('$100.00');
      expect(formatExpenseAmount(-25.99, 'EUR')).toBe('25.99 €');
    });

    it('should handle decimal places correctly', () => {
      expect(formatExpenseAmount(99.1, 'USD')).toBe('$99.10');
      expect(formatExpenseAmount(99.999, 'EUR')).toBe('100.00 €');
    });
  });

  describe('formatCurrency', () => {
    it('should format positive amounts without minus sign', () => {
      expect(formatCurrency(100, 'USD')).toBe('$100.00');
      expect(formatCurrency(25.99, 'EUR')).toBe('25.99 €');
    });

    it('should format negative amounts with minus sign before amount', () => {
      expect(formatCurrency(-100, 'USD')).toBe('-$100.00');
      expect(formatCurrency(-25.99, 'EUR')).toBe('-25.99 €');
    });
  });
});