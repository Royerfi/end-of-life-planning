import { NextResponse } from 'next/server'
import { del } from '@vercel/blob'
import pool from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await pool.connect()
    const result = await client.query(
      'SELECT * FROM documents WHERE id = $1',
      [params.id]
    )
    client.release()

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error fetching document:', error)
    return NextResponse.json(
      { error: 'Failed to fetch document' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get document URL from database
    const client = await pool.connect()
    const result = await client.query(
      'SELECT url FROM documents WHERE id = $1',
      [params.id]
    )

    if (result.rows.length === 0) {
      client.release()
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    // Delete from Vercel Blob
    await del(result.rows[0].url)

    // Delete from database
    await client.query(
      'DELETE FROM documents WHERE id = $1',
      [params.id]
    )
    client.release()

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting document:', error)
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, type, tags } = body

    const client = await pool.connect()
    const result = await client.query(
      `UPDATE documents 
       SET name = $1, type = $2, tags = $3, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $4 
       RETURNING *`,
      [name, type, JSON.stringify(tags), params.id]
    )
    client.release()

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating document:', error)
    return NextResponse.json(
      { error: 'Failed to update document' },
      { status: 500 }
    )
  }
}

