import { NextResponse } from 'next/server';
import { setSession } from '@/lib/auth';

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (
    username === process.env.APP_USERNAME &&
    password === process.env.APP_PASSWORD
  ) {
    await setSession();
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false, message: 'Invalid credentials' }, { status: 401 });
}
