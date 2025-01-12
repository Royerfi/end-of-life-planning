require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

async function updateDocumentsTable() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  console.log('Attempting to connect to database at:', process.env.DATABASE_URL.split('@')[1]);

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Check if upload_date column exists
    const checkUploadDateColumn = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='documents' AND column_name='upload_date'
    `);

    if (checkUploadDateColumn.rows.length === 0) {
      // Add upload_date column if it doesn't exist
      await client.query(`
        ALTER TABLE documents
        ADD COLUMN upload_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      `);
      console.log('upload_date column added');
    } else {
      // Ensure upload_date is of type TIMESTAMP WITH TIME ZONE
      await client.query(`
        ALTER TABLE documents
        ALTER COLUMN upload_date TYPE TIMESTAMP WITH TIME ZONE
      `);
      console.log('upload_date column updated to TIMESTAMP WITH TIME ZONE');
    }

    // Add uploader_id column if it doesn't exist
    const addUploaderIdColumn = await client.query(`
      ALTER TABLE documents
      ADD COLUMN IF NOT EXISTS uploader_id INTEGER REFERENCES users(id)
    `);
    console.log('uploader_id column added or already exists');

    await client.query('COMMIT');
    console.log('Documents table updated successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating documents table:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

updateDocumentsTable();

