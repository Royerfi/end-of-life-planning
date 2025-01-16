import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { nanoid } from 'nanoid';
import pool from '@/lib/db';
import { verify } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Verify JWT token
    const token = request.cookies.get('token')?.value;
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

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const name = formData.get('name') as string;
    const type = formData.get('type') as string;
    const tagsString = formData.get('tags') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Parse tags
    let tags: string[] = [];
    try {
      tags = JSON.parse(tagsString || '[]');
    } catch (e) {
      console.error('Error parsing tags:', e);
    }

    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: 'public',
      addRandomSuffix: true,
    });

    // Save to database
    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO documents (
          id, user_id, name, type, file_path, size, mime_type, tags
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING *`,
        [
          nanoid(),
          userId,
          name,
          type,
          blob.url,
          file.size,
          file.type,
          JSON.stringify(tags),
        ]
      );

      return NextResponse.json(result.rows[0]);
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save document metadata' },
        { status: 500 }
      );
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    );
  }
}

// Explicitly type the configuration object
export const segmentConfig: Record<string, any> = {
  api: {
    bodyParser: false,
  },
};
