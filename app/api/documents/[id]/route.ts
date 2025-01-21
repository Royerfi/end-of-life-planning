import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    if (!(await context.params)?.id) {
      return NextResponse.json({ error: 'Missing document ID' }, { status: 400 });
    }

    const id = (await context.params).id;
    console.log('Params received:', context.params);

    const client = await pool.connect().catch((err) => {
      console.error('Database connection failed:', err);
      throw new Error('Database connection error');
    });

    try {
      const result = await client.query(
        'SELECT file_path FROM documents WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Document not found' }, { status: 404 });
      }

      const filePath = result.rows[0].file_path;

      const isValidUrl = (path: string) => {
        try {
          new URL(path);
          return true;
        } catch {
          return false;
        }
      };

      if (!isValidUrl(filePath)) {
        console.error('Invalid file path:', filePath);
        return NextResponse.json({ error: 'Invalid file path' }, { status: 400 });
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000); // 5-second timeout

      try {
        const response = await fetch(filePath, { signal: controller.signal });
        clearTimeout(timeout);

        if (!response.ok) {
          console.error('Fetch failed with status:', response.status);
          throw new Error(`Failed to fetch document: ${response.statusText}`);
        }

        const buffer = Buffer.from(await response.arrayBuffer());
        return new NextResponse(buffer, {
          headers: {
            'Content-Type': response.headers.get('Content-Type') || 'application/octet-stream',
            'Content-Disposition': `inline; filename="document-${id}"`,
          },
        });
      } catch (err) {
        const error = err as Error;
        if (error.name === 'AbortError') {
          return NextResponse.json({ error: 'Request timed out' }, { status: 408 });
        }
        throw error;
      }
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error fetching document' }, { status: 500 });
  }
}
