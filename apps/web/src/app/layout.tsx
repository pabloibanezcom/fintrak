import type { Metadata } from 'next';
import { ThemeProvider, UserProvider, SessionProvider } from '@/context';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fintrak - Financial Dashboard',
  description: 'Track your finances, expenses, and investments in one place',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" style={{ backgroundColor: '#f6f6f6' }}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ backgroundColor: '#f6f6f6' }}>
        <ThemeProvider>
          <UserProvider>
            <SessionProvider>{children}</SessionProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
