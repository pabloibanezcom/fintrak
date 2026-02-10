'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Icon } from '@/components/primitives';
import { useSession } from '@/context';

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
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-bg-body)',
      }}
    >
      <Icon name="loader" size={48} className="spinner" />
    </div>
  );
}
