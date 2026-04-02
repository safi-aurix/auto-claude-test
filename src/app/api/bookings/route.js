import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { createBooking, getBookingsByUser } from '@/lib/bookings';

export function GET() {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorised.' }, { status: 401 });
  }
  return NextResponse.json({ bookings: getBookingsByUser(session.id) });
}

export async function POST(request) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorised.' }, { status: 401 });
  }

  const body = await request.json();
  const result = createBooking({ ...body, userId: session.id });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ booking: result.booking }, { status: 201 });
}
