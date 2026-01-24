'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Footer, Sidebar, SyncOverlay, TopNav } from '@/components/layout';
import { Icon } from '@/components/ui';
import { useSession, useSync } from '@/context';
import styles from './layout.module.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useSession();
  const { isSyncing } = useSync();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Icon name="loader" size={48} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={styles.layout}>
      {isSyncing && <SyncOverlay />}
      <TopNav />
      <div className={styles.workspace}>
        <Sidebar />
        <main className={styles.main}>
          <div className={styles.content}>
            {children}
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}
