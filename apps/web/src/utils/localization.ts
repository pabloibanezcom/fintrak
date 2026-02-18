type SupportedLocale = 'en' | 'es';

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

export function getLocalizedText(
  value: unknown,
  preferredLocale?: SupportedLocale
): string {
  if (isNonEmptyString(value)) {
    return value;
  }

  if (!value || typeof value !== 'object') {
    return '';
  }

  const localized = value as { en?: unknown; es?: unknown };

  if (preferredLocale && isNonEmptyString(localized[preferredLocale])) {
    return localized[preferredLocale];
  }

  if (isNonEmptyString(localized.en)) {
    return localized.en;
  }

  if (isNonEmptyString(localized.es)) {
    return localized.es;
  }

  return '';
}
