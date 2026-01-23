'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useTransition } from 'react';

import { type Locale, localeNames } from '@/i18n/config';

import enFlag from './flags/en.png';
import esFlag from './flags/es.png';
import styles from './LanguageSwitcher.module.css';

const LOCALE_COOKIE = 'NEXT_LOCALE';

const flags: Record<Locale, typeof enFlag> = {
  en: enFlag,
  es: esFlag,
};

export function LanguageSwitcher() {
  const t = useTranslations('nav');
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const toggleLocale = () => {
    const newLocale: Locale = locale === 'en' ? 'es' : 'en';
    document.cookie = `${LOCALE_COOKIE}=${newLocale};path=/;max-age=${60 * 60 * 24 * 365}`;
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <button
      type="button"
      className={styles.trigger}
      title={t('language')}
      onClick={toggleLocale}
      disabled={isPending}
    >
      <Image
        src={flags[locale]}
        alt={localeNames[locale]}
        width={20}
        height={20}
        className={styles.flag}
      />
    </button>
  );
}
