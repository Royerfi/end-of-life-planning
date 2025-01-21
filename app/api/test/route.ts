import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { logError, logInfo } from '@/lib/errorLogging';

export async function GET() {
  try {
    logInfo('GET /api/test: Received request');
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT NOW()');
      logInfo('Database query successful', result.rows[0]);
      return NextResponse.json({ message: 'API and database connection successful', time: result.rows[0].now });
    } finally {
      client.release();
    }
  } catch (error) {
    logError(error, 'GET /api/test');
    return NextResponse.json({ error: 'API or database connection failed' }, { status: 500 });
  }
}

