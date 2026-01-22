import { Icon } from '@/components/ui';
import styles from './layout.module.css';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.logo}>
          <Icon name="logo" size={40} />
          <span className={styles.logoText}>Fintrak</span>
        </div>
        {children}
      </div>
    </div>
  );
}
