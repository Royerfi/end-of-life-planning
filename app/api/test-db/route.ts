import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export async function GET() {
  try {
    const client = await getPool().connect();
    try {
      const result = await client.query('SELECT NOW()');
      return NextResponse.json({ message: 'Database connection successful', time: result.rows[0].now });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ 
      error: 'Failed to connect to database', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

