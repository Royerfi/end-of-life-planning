import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import pool from '@/lib/db';
import { verify } from '@/lib/auth';
import { logError } from '@/lib/errorLogging';

export async function GET() {
  try {
    const cookiesStore = await cookies(); // Await the cookies function
    const token = cookiesStore.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let userId: string;
    try {
      const payload = await verify(token);
      userId = payload.userId;
    } catch (error) {
      console.error('Token verification error:', error);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT COUNT(*) FROM family_members WHERE user_id = $1',
        [userId]
      );
      const count = parseInt(result.rows[0].count, 10);
      return NextResponse.json({ count });
    } finally {
      client.release();
    }
  } catch (error) {
    logError(error, 'GET /api/family-members/count');
    return NextResponse.json(
      { error: 'Failed to retrieve family member count' },
      { status: 500 }
    );
  }
}
