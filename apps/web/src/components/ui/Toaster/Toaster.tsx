'use client';

import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        duration: 4000,
        style: {
          fontFamily: 'var(--font-family-base)',
          fontSize: 'var(--font-size-sm)',
          borderRadius: 'var(--radius-lg)',
        },
      }}
      richColors
      closeButton
    />
  );
}
