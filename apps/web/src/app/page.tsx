'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/context';
import styles from './page.module.css';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useSession();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/overview');
      } else {
        router.replace('/login');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className={styles.container}>
      <div className={styles.spinner}>
        <svg viewBox="0 0 24 24" fill="none" className={styles.spinnerIcon}>
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="var(--color-primary-500)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="31.416"
            strokeDashoffset="10"
          />
        </svg>
      </div>
    </div>
  );
}
