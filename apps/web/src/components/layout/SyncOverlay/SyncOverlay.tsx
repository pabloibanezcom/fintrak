'use client';

import { useTranslations } from 'next-intl';
import { Icon } from '@/components/primitives';
import styles from './SyncOverlay.module.css';

export function SyncOverlay() {
  const t = useTranslations('nav');

  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <Icon name="loader" size={48} />
        <p className={styles.message}>{t('syncing')}</p>
      </div>
    </div>
  );
}
