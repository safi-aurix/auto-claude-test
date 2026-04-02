import { NextResponse } from 'next/server';
import { validateCredentials } from '@/lib/users';
import { createSession } from '@/lib/session';

export async function POST(request) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required.' },
      { status: 400 },
    );
  }

  const user = validateCredentials(email, password);
  if (!user) {
    return NextResponse.json(
      { error: 'Invalid email or password.' },
      { status: 401 },
    );
  }

  createSession(user);

  return NextResponse.json({ ok: true, user });
}
