'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertTriangle, Loader } from 'lucide-react';

export default function FinishPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const email = window.localStorage.getItem('emailForSignIn');
    if (isSignInWithEmailLink(auth, window.location.href) && email) {
      signInWithEmailLink(auth, email, window.location.href)
        .then(() => {
          setStatus('success');
          window.localStorage.removeItem('emailForSignIn');
          setTimeout(() => router.push('/'), 2000);
        })
        .catch((err) => {
          setError(err.message);
          setStatus('error');
        });
    } else {
        setError('Invalid sign-in link.');
        setStatus('error');
    }
  }, [router]);

  if (status === 'loading') {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center p-6">
            <Loader className="w-16 h-16 text-gray-500 animate-spin mb-4" />
            <h1 className="text-2xl font-semibold mb-2">Завершение входа...</h1>
            <p className="text-muted-foreground mb-6">
                Пожалуйста, подождите, мы проверяем вашу ссылку для входа.
            </p>
        </div>
    )
  }

  if (status === 'error') {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center p-6">
            <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
            <h1 className="text-2xl font-semibold mb-2">Ошибка входа</h1>
            <p className="text-muted-foreground mb-6">
                {error || 'Произошла ошибка при попытке входа. Попробуйте еще раз.'}
            </p>
            <Button
                onClick={() => router.push('/')}
                className="px-6 py-2 text-base"
            >
                На главную
            </Button>
        </div>
    )
  }


  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-6">
      <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
      <h1 className="text-2xl font-semibold mb-2">Вы успешно вошли в аккаунт</h1>
      <p className="text-muted-foreground mb-6">
        Добро пожаловать! Вы будете перенаправлены на главную страницу.
      </p>
      <Button
        onClick={() => router.push('/')}
        className="px-6 py-2 text-base"
      >
        Перейти
      </Button>
    </div>
  );
}
