import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookiesStore = await cookies(); // Await the cookies function
  
  cookiesStore.set('token', '', {
    expires: new Date(0),
    path: '/',
  });

  return NextResponse.json({ message: 'Logged out successfully' });
}
