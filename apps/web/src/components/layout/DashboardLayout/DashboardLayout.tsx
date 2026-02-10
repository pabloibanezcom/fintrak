'use client';

import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { Footer, Sidebar, SyncOverlay, TopNav } from '@/components/layout';
import { Icon } from '@/components/primitives';
import { useSession, useSync } from '@/context';
import styles from './DashboardLayout.module.css';

export interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
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
        <Icon name="loader" size={48} className="spinner" />
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
};
