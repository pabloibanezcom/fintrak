'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { type FormEvent, useState } from 'react';
import { AuthCard } from '@/components/layout';
import { Button, ErrorMessage, Input } from '@/components/primitives';
import { authService } from '@/services';

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
    <AuthCard title={t('title')} subtitle={t('subtitle')}>
      <form onSubmit={handleSubmit} className="flex-col gap-4">
        <ErrorMessage message={error} />

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

      <p className="text-center text-secondary" style={{ marginTop: '1.5rem' }}>
        {t('hasAccount')}{' '}
        <Link href="/login" className="link-primary">
          {t('signInLink')}
        </Link>
      </p>
    </AuthCard>
  );
}
