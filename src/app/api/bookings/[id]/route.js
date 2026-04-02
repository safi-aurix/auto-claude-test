import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { cancelBooking } from '@/lib/bookings';

export function DELETE(request, { params }) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorised.' }, { status: 401 });
  }

  const result = cancelBooking(params.id, session.id);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
