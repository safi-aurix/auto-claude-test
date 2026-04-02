import { cookies } from 'next/headers';

const SESSION_COOKIE = 'wl_session';

/**
 * Creates a session cookie for the authenticated user.
 * NOTE: Uses base64 encoding for simplicity in this demo.
 * In production, use a proper signed/encrypted session (e.g., iron-session or JWTs).
 * @param {{ id: number, email: string, name: string, role: string }} user
 */
export function createSession(user) {
  const payload = Buffer.from(JSON.stringify(user)).toString('base64');
  cookies().set(SESSION_COOKIE, payload, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
}

/**
 * Reads and parses the current session from cookies.
 * @returns {{ id: number, email: string, name: string, role: string } | null}
 */
export function getSession() {
  const cookie = cookies().get(SESSION_COOKIE);
  if (!cookie) return null;
  try {
    return JSON.parse(Buffer.from(cookie.value, 'base64').toString('utf8'));
  } catch {
    return null;
  }
}

/**
 * Removes the session cookie, effectively logging the user out.
 */
export function clearSession() {
  cookies().delete(SESSION_COOKIE);
}
