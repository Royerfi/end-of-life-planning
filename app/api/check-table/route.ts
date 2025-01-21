import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { logError, logInfo } from '@/lib/errorLogging';

export async function GET() {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns
        WHERE table_name = 'family_members'
      `);
      logInfo('Family members table structure:', result.rows);
      return NextResponse.json({ tableStructure: result.rows });
    } finally {
      client.release();
    }
  } catch (error) {
    logError(error, 'GET /api/check-table');
    return NextResponse.json({ error: 'Failed to check table structure' }, { status: 500 });
  }
}

