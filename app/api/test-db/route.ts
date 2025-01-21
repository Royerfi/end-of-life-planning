import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { logError, logInfo } from '@/lib/errorLogging';

export async function GET() {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT NOW()');
      logInfo('Database connection successful', result.rows[0]);
      return NextResponse.json({ message: 'Database connection successful', time: result.rows[0].now });
    } finally {
      client.release();
    }
  } catch (error) {
    logError(error, 'GET /api/test-db');
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }
}

