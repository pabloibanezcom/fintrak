import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import {
  SessionProvider,
  SyncProvider,
  ThemeProvider,
  UserProvider,
} from '@/context';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fintrak - Financial Dashboard',
  description: 'Track your finances, expenses, and investments in one place',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} style={{ backgroundColor: '#f6f6f6' }}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ backgroundColor: '#f6f6f6' }}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <UserProvider>
              <SessionProvider>
                <SyncProvider>{children}</SyncProvider>
              </SessionProvider>
            </UserProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
