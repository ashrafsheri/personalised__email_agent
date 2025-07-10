import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const COOKIE_NAME = 'paismo_auth';

export async function setSession() {
  const secret = new TextEncoder().encode(process.env.APP_COOKIE_SECRET);
  const jwt = await new SignJWT({ loggedIn: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret);

  (await cookies()).set({
    name: COOKIE_NAME,
    value: jwt,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });
}

export async function isAuthed(): Promise<boolean> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return false;
  try {
    const secret = new TextEncoder().encode(process.env.APP_COOKIE_SECRET);
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function clearSession() {
  (await cookies()).delete(COOKIE_NAME);
}
