'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, AlertTriangle, Loader } from 'lucide-react';

export default function FinishPage() {
  const router = useRouter();

  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'needsEmail'>('loading');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSignInWithEmailLink(auth, window.location.href)) {
      setError('Invalid sign-in link.');
      setStatus('error');
      return;
    }

    const savedEmail = window.localStorage.getItem('emailForSignIn');

    if (savedEmail) {
      completeSignIn(savedEmail);
    } else {
      setStatus('needsEmail');
    }
  }, []);

  const completeSignIn = async (userEmail: string) => {
    try {
      await signInWithEmailLink(auth, userEmail, window.location.href);
      window.localStorage.removeItem('emailForSignIn');
      setStatus('success');
      setTimeout(() => router.push('/'), 2000);
    } catch (err: any) {
      setError(err.message);
      setStatus('error');
    }
  };

  const handleManualEmailSubmit = async () => {
    if (!email) {
      setError('Введите email.');
      return;
    }
    setStatus('loading');
    await completeSignIn(email);
  };

  // LOADING
  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-6">
        <Loader className="w-16 h-16 text-gray-500 animate-spin mb-4" />
        <h1 className="text-2xl font-semibold mb-2">Завершение входа...</h1>
        <p className="text-muted-foreground">
          Пожалуйста, подождите.
        </p>
      </div>
    );
  }

  // NEED EMAIL (новый блок)
  if (status === 'needsEmail') {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-6 max-w-sm mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Подтвердите email</h1>
        <p className="text-muted-foreground mb-6">
          Вы открыли ссылку на другом устройстве. Введите email, который использовали для входа.
        </p>

        <Input
          type="email"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4"
        />

        <Button onClick={handleManualEmailSubmit} className="w-full">
          Продолжить
        </Button>

        {error && (
          <p className="text-red-500 text-sm mt-4">{error}</p>
        )}
      </div>
    );
  }

  // ERROR
  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-6">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-semibold mb-2">Ошибка входа</h1>
        <p className="text-muted-foreground mb-6">
          {error || 'Произошла ошибка при входе.'}
        </p>
        <Button onClick={() => router.push('/')}>
          На главную
        </Button>
      </div>
    );
  }

  // SUCCESS
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-6">
      <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
      <h1 className="text-2xl font-semibold mb-2">
        Вы успешно вошли в аккаунт
      </h1>
      <p className="text-muted-foreground mb-6">
        Перенаправляем...
      </p>
      <Button onClick={() => router.push('/')}>
        Перейти
      </Button>
    </div>
  );
}