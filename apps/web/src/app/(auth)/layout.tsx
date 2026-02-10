import { AuthLayout } from '@/components/layout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}
