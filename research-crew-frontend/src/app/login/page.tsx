'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user, password: pass }),
    });

    if (res.ok) {
      router.replace('/');       // go to main app
    } else {
      setError('Wrong username / password');
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-slate-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-6 rounded-2xl bg-white/75 backdrop-blur border border-slate-200 shadow-xl p-8"
      >
        <h1 className="text-center text-2xl font-semibold mb-2">Paismo login</h1>

        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            className="w-full rounded-lg border border-slate-300 px-4 py-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            autoComplete="username"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            className="w-full rounded-lg border border-slate-300 px-4 py-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-lg bg-primary py-2 text-black font-medium hover:bg-primary/90 transition"
        >
          Sign in
        </button>
      </form>
    </main>
  );
}
