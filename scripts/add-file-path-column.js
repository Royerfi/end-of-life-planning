require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

async function addFilePathColumn() {
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

    // Check if the file_path column already exists
    const checkColumnExists = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='documents' AND column_name='file_path'
    `);

    if (checkColumnExists.rows.length === 0) {
      // Add the file_path column if it doesn't exist
      await client.query(`
        ALTER TABLE documents 
        ADD COLUMN file_path VARCHAR(255) NOT NULL
      `);
      console.log('file_path column added successfully');
    } else {
      console.log('file_path column already exists');
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error adding file_path column:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

addFilePathColumn();

