'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { type FormEvent, useState } from 'react';
import { Button, Card, Icon, Input } from '@/components/ui';
import { useSession } from '@/context';
import { authService } from '@/services';
import styles from './page.module.css';

export default function LoginPage() {
  const t = useTranslations('auth.login');
  const router = useRouter();
  const { signIn } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authService.login({ email, password });
      await signIn(response.token);
      router.push('/overview');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errorDefault'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card padding="lg" className={styles.card}>
      <h1 className={styles.title}>{t('title')}</h1>
      <p className={styles.subtitle}>{t('subtitle')}</p>

      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.error}>{error}</div>}

        <Input
          label={t('emailLabel')}
          type="email"
          placeholder={t('emailPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <Input
          label={t('passwordLabel')}
          type="password"
          placeholder={t('passwordPlaceholder')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        <Button type="submit" fullWidth isLoading={isLoading}>
          {t('submitButton')}
        </Button>
      </form>

      <div className={styles.divider}>
        <span>{t('divider')}</span>
      </div>

      <Button variant="outline" fullWidth>
        <Icon name="google" size={20} />
        {t('googleButton')}
      </Button>

      <p className={styles.footer}>
        {t('noAccount')}{' '}
        <Link href="/register" className={styles.link}>
          {t('signUpLink')}
        </Link>
      </p>
    </Card>
  );
}
