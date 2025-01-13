import { NextRequest, NextResponse } from 'next/server';
import { createDocument, getDocumentsByUserId, updateDocument, deleteDocument } from '@/lib/db';
import { verify } from '@/lib/auth';
import { put, del } from '@vercel/blob';
import { nanoid } from 'nanoid';

async function authenticateRequest(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return null;
  }
  try {
    const payload = await verify(token);
    return payload;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

export async function POST(req: NextRequest) {
  const payload = await authenticateRequest(req);
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const type = formData.get('type') as string;
    const tags = JSON.parse(formData.get('tags') as string);
    const file = formData.get('file') as File;

    if (!name || !type || !file) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate a unique filename
    const filename = `${nanoid()}-${file.name}`;

    // Upload file to Vercel Blob Storage
    const { url } = await put(filename, file, { access: 'public' });

    const documentId = await createDocument(payload.userId, name, type, tags, url);
    return NextResponse.json({ id: documentId, message: 'Document created successfully' });
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json({ 
      error: 'Failed to create document', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const payload = await authenticateRequest(req);
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const documentId = url.searchParams.get('id');

    if (documentId) {
      // Fetch the specific document
      const documents = await getDocumentsByUserId(payload.userId);
      const document = documents.find(doc => doc.id === parseInt(documentId));

      if (!document) {
        return NextResponse.json({ error: 'Document not found' }, { status: 404 });
      }

      // Redirect to the file URL
      return NextResponse.redirect(document.file_path);
    } else {
      // Fetch all documents for the user
      const documents = await getDocumentsByUserId(payload.userId);
      return NextResponse.json(documents);
    }
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const payload = await authenticateRequest(req);
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, name, type, tags } = await req.json();
    await updateDocument(id, name, type, tags);
    return NextResponse.json({ message: 'Document updated successfully' });
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json({ error: 'Failed to update document' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const payload = await authenticateRequest(req);
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await req.json();
    
    // Fetch the document first
    const documents = await getDocumentsByUserId(payload.userId);
    const document = documents.find(doc => doc.id === id);
    
    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    if (document.file_path) {
      // Delete the file from Vercel Blob Storage
      await del(document.file_path);
    }
    
    await deleteDocument(id);
    return NextResponse.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }
}

