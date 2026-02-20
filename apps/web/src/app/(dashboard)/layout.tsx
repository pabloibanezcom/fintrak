import { ViewTransitions } from 'next-view-transitions';
import { DashboardLayout } from '@/components/layout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransitions>
      <DashboardLayout>{children}</DashboardLayout>
    </ViewTransitions>
  );
}
