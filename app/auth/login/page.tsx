'use client';

import { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';

export default function AuthLoginPage() {
  const { status } = useSession();

  useEffect(() => {
    // Get the callbackUrl from query params (where to go after auth)
    const params = new URLSearchParams(window.location.search);
    const callbackUrl = params.get('callbackUrl') || 'https://book.onlymatt.ca';

    if (status === 'unauthenticated') {
      // Auto-trigger Twitter OAuth — this happens on me.onlymatt.ca
      signIn('twitter', { callbackUrl });
    } else if (status === 'authenticated') {
      // Already logged in, redirect back
      window.location.href = callbackUrl;
    }
  }, [status]);

  return (
    <main className="min-h-screen bg-black flex items-center justify-center">
      <p className="text-slate-400 text-sm tracking-wider uppercase">Redirecting to X…</p>
    </main>
  );
}
