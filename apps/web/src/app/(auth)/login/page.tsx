'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { type FormEvent, useState } from 'react';
import { AuthCard } from '@/components/layout';
import {
  AuthDivider,
  Button,
  ErrorMessage,
  Icon,
  Input,
} from '@/components/primitives';
import { useSession } from '@/context';
import { authService } from '@/services';

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
          autoComplete="current-password"
        />

        <Button type="submit" fullWidth isLoading={isLoading}>
          {t('submitButton')}
        </Button>
      </form>

      <AuthDivider text={t('divider')} />

      <Button variant="outline" fullWidth>
        <Icon name="google" size={20} />
        {t('googleButton')}
      </Button>

      <p className="text-center text-secondary" style={{ marginTop: '1.5rem' }}>
        {t('noAccount')}{' '}
        <Link href="/register" className="link-primary">
          {t('signUpLink')}
        </Link>
      </p>
    </AuthCard>
  );
}
