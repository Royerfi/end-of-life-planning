import { put } from '@vercel/blob';
import { sql } from '@vercel/postgres';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

export async function getDocument(id: string) {
  try {
    if (!id) {
      throw new Error('Document ID is required');
    }

    const result = await sql`
      SELECT * FROM documents WHERE id = ${id}
    `;

    if (result.rows.length === 0) {
      return null;
    }

    const document = result.rows[0];
    return {
      id: document.id,
      name: document.name,
      fileType: document.file_type,
      fileUrl: document.file_url,
    };
  } catch (error) {
    console.error('Error fetching document with ID:', id, error);
    throw new Error('Failed to fetch document');
  }
}

export async function uploadDocument(file: File, name: string, type: string) {
  try {
    if (!name || !type) {
      throw new Error('Name and type are required');
    }
    if (!(file instanceof File)) {
      throw new Error('Invalid file format');
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size exceeds the maximum limit');
    }
    if (!ALLOWED_TYPES.includes(type)) {
      throw new Error('Unsupported file type');
    }

    const { url } = await put(name, file, { access: 'public' });

    const result = await sql`
      INSERT INTO documents (name, file_type, file_url)
      VALUES (${name}, ${type}, ${url})
      RETURNING id
    `;

    return result.rows[0].id;
  } catch (error) {
    console.error('Error uploading document:', { fileName: name, fileType: type }, error);
    throw new Error('Failed to upload document');
  }
}
