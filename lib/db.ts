import { Pool } from 'pg';
import { hash, compare } from 'bcrypt';

let pool: Pool;

export function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL is not set in environment variables');
    }
    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false
      }
    });
  }
  return pool;
}

async function ensureTablesExist() {
  const client = await getPool().connect();
  try {
    // Check if auth_users table exists
    const authUsersExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'auth_users'
      );
    `);

    if (!authUsersExists.rows[0].exists) {
      await client.query(`
        CREATE TABLE auth_users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL
        );
      `);
    }

    // Check if users table exists
    const usersExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `);

    if (!usersExists.rows[0].exists) {
      await client.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL
        );
      `);
    }

    // Check if auth_user_id column exists in users table
    const authUserIdExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'auth_user_id'
      );
    `);

    if (!authUserIdExists.rows[0].exists) {
      await client.query(`
        ALTER TABLE users
        ADD COLUMN auth_user_id INTEGER REFERENCES auth_users(id);
      `);
    }

    // Check if documents table exists
    const documentsExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'documents'
      );
    `);

    if (!documentsExists.rows[0].exists) {
      await client.query(`
        CREATE TABLE documents (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id),
          name VARCHAR(255) NOT NULL,
          type VARCHAR(255) NOT NULL,
          tags TEXT[],
          upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          file_path VARCHAR(255) NOT NULL,
          uploader_id INTEGER REFERENCES users(id)
        );
      `);
    }
  } finally {
    client.release();
  }
}

export async function createUser(name: string, email: string, password: string) {
  await ensureTablesExist();
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    
    const hashedPassword = await hash(password, 10);
    const authResult = await client.query(
      'INSERT INTO auth_users (email, password) VALUES ($1, $2) RETURNING id',
      [email, hashedPassword]
    );
    const authUserId = authResult.rows[0].id;

    const userResult = await client.query(
      'INSERT INTO users (name, email, auth_user_id) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, authUserId]
    );

    await client.query('COMMIT');
    return userResult.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error in createUser:', error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getUserByEmail(email: string) {
  await ensureTablesExist();
  const client = await getPool().connect();
  try {
    const result = await client.query(`
      SELECT u.*, au.password 
      FROM users u 
      JOIN auth_users au ON u.auth_user_id = au.id 
      WHERE u.email = $1
    `, [email]);
    return result.rows[0];
  } catch (error) {
    console.error('Error in getUserByEmail:', error);
    throw error;
  } finally {
    client.release();
  }
}

export async function validateUser(email: string, password: string) {
  await ensureTablesExist();
  const client = await getPool().connect();
  try {
    console.log('Validating user:', email);
    const result = await client.query('SELECT * FROM auth_users WHERE email = $1', [email]);
    console.log('Query result:', result.rows.length > 0 ? 'User found' : 'User not found');
    if (result.rows.length === 0) {
      return null;
    }
    const user = result.rows[0];
    const isValid = await compare(password, user.password);
    console.log('Password validation:', isValid ? 'Valid' : 'Invalid');
    return isValid ? user : null;
  } catch (error) {
    console.error('Error validating user:', error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getUserById(id: string) {
  const client = await getPool().connect();
  try {
    const result = await client.query('SELECT id, name, email FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  } finally {
    client.release();
  }
}

export async function createDocument(userId: number, name: string, type: string, tags: string[], filePath: string) {
  await ensureTablesExist();
  const client = await getPool().connect();
  try {
    const result = await client.query(
      'INSERT INTO documents (user_id, name, type, tags, file_path, uploader_id, upload_date) VALUES ($1, $2, $3, $4, $5, $1, CURRENT_TIMESTAMP) RETURNING id',
      [userId, name, type, tags, filePath]
    );
    return result.rows[0].id;
  } catch (error) {
    console.error('Error in createDocument:', error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getDocumentsByUserId(userId: number) {
  await ensureTablesExist();
  const client = await getPool().connect();
  try {
    const result = await client.query(`
      SELECT d.*, u.name as uploader_name 
      FROM documents d 
      LEFT JOIN users u ON d.uploader_id = u.id 
      WHERE d.user_id = $1
    `, [userId]);
    return result.rows;
  } finally {
    client.release();
  }
}

export async function updateDocument(id: number, name: string, type: string, tags: string[]) {
  await ensureTablesExist();
  const client = await getPool().connect();
  try {
    await client.query(
      'UPDATE documents SET name = $1, type = $2, tags = $3 WHERE id = $4',
      [name, type, tags, id]
    );
  } finally {
    client.release();
  }
}

export async function deleteDocument(id: number) {
  await ensureTablesExist();
  const client = await getPool().connect();
  try {
    await client.query('DELETE FROM documents WHERE id = $1', [id]);
  } finally {
    client.release();
  }
}

