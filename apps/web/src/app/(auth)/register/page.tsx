'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { type FormEvent, useState } from 'react';
import { Button, Card, Input } from '@/components/ui';
import { authService } from '@/services';
import styles from './page.module.css';

export default function RegisterPage() {
  const t = useTranslations('auth.register');
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t('errorPasswordMismatch'));
      return;
    }

    if (password.length < 6) {
      setError(t('errorPasswordLength'));
      return;
    }

    setIsLoading(true);

    try {
      await authService.register({ email, password });
      router.push('/login?registered=true');
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
          autoComplete="new-password"
        />

        <Input
          label={t('confirmPasswordLabel')}
          type="password"
          placeholder={t('confirmPasswordPlaceholder')}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
        />

        <Button type="submit" fullWidth isLoading={isLoading}>
          {t('submitButton')}
        </Button>
      </form>

      <p className={styles.footer}>
        {t('hasAccount')}{' '}
        <Link href="/login" className={styles.link}>
          {t('signInLink')}
        </Link>
      </p>
    </Card>
  );
}
