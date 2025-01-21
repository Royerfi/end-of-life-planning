import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verify } from '@/lib/auth';
import { logError } from '@/lib/errorLogging';

export async function GET(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = new Map<string, string>(
      cookieHeader
        .split(';')
        .map((cookie) => {
          const [key, ...value] = cookie.trim().split('=');
          return key && value.length ? [key, value.join('=')] : null;
        })
        .filter((pair): pair is [string, string] => pair !== null) // Filter out invalid entries
    );

    const token = cookies.get('token');
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
        `SELECT id, name, type, file_path, size, mime_type, tags, created_at, updated_at 
         FROM documents 
         WHERE user_id = $1 
         ORDER BY created_at DESC`,
        [userId]
      );
      return NextResponse.json(result.rows);
    } finally {
      client.release();
    }
  } catch (error) {
    logError(error, 'retrieving documents');
    return NextResponse.json(
      { error: 'Failed to retrieve documents' },
      { status: 500 }
    );
  }
}
