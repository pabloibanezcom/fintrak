'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/context';
import { Icon } from '@/components/ui';
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
      <Icon name="loader" size={48} />
    </div>
  );
}

