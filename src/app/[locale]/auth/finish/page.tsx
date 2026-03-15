'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isSignInWithEmailLink, onAuthStateChanged, signInWithEmailLink } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { completeLinkWithEmailLink, LINKING_EMAIL_KEY } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, AlertTriangle, Loader } from 'lucide-react';

export default function FinishPage() {
  const router = useRouter();

  const [status, setStatus] = useState<'loading' | 'link-success' | 'success' | 'error' | 'needsEmail'>('loading');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSignInWithEmailLink(auth, window.location.href)) {
      setError('Invalid sign-in link.');
      setStatus('error');
      return;
    }

    // ?flow=link is embedded in the URL by sendEmailLinkForLinking so this
    // signal survives cross-device opens (unlike localStorage).
    const isLinkingFlow = new URLSearchParams(window.location.search).get('flow') === 'link';

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();

      // ── Same device: user is signed in and localStorage has the email ──
      const linkingEmail = window.localStorage.getItem(LINKING_EMAIL_KEY);
      if (user && linkingEmail) {
        completeLinkEmail(linkingEmail);
        return;
      }

      // ── Cross-device linking: URL says it's a link flow but no localStorage ──
      // Ask the user to type their email; completeLinkEmail / completeSignIn
      // will be called from handleManualEmailSubmit with the correct branch.
      if (isLinkingFlow && !linkingEmail) {
        setStatus('needsEmail');
        return;
      }

      // ── Normal sign-in ──
      const signInEmail = window.localStorage.getItem('emailForSignIn');
      if (signInEmail) {
        completeSignIn(signInEmail);
      } else {
        setStatus('needsEmail');
      }
    });
  }, []);

  const completeSignIn = async (userEmail: string) => {
    try {
      const credential = await signInWithEmailLink(auth, userEmail, window.location.href);
      window.localStorage.removeItem('emailForSignIn');

      const idToken = await credential.user.getIdToken();
      const createUserUrl = process.env.NEXT_PUBLIC_CREATEUSER_URL!;
      await fetch(createUserUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      setStatus('success');
      const isLinkingFlow = new URLSearchParams(window.location.search).get('flow') === 'link';
      setTimeout(() => router.push(isLinkingFlow ? '/account/security' : '/'), 2000);
    } catch (err: any) {
      setError(err.message);
      setStatus('error');
    }
  };

  const completeLinkEmail = async (userEmail: string) => {
    const { success, error } = await completeLinkWithEmailLink(userEmail);
    if (success) {
      setStatus('link-success');
      setTimeout(() => router.push('/account/security'), 2000);
    } else {
      setError(error ?? 'An error occurred while linking.');
      setStatus('error');
    }
  };

  const handleManualEmailSubmit = async () => {
    if (!email) {
      setError('Введите email.');
      return;
    }
    setStatus('loading');
    const isLinkingFlow = new URLSearchParams(window.location.search).get('flow') === 'link';
    if (isLinkingFlow && auth.currentUser) {
      // Same-device edge case: localStorage was cleared but user is still signed in
      await completeLinkEmail(email);
    } else {
      // Cross-device or normal sign-in:
      //   completeSignIn will redirect to /account/security when isLinkingFlow is true
      //   so the user lands on security settings where they can add email again.
      await completeSignIn(email);
    }
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

  // LINK SUCCESS — email was linked to an existing account (Google-first user)
  if (status === 'link-success') {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-6">
        <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
        <h1 className="text-2xl font-semibold mb-2">Email успешно добавлен</h1>
        <p className="text-muted-foreground mb-6">
          Перенаправляем в настройки безопасности...
        </p>
        <Button onClick={() => router.push('/account/security')}>
          Перейти
        </Button>
      </div>
    );
  }

  // SUCCESS — normal sign-in
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