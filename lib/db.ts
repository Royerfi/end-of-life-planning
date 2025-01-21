import { Pool } from 'pg';
import { logError, logInfo } from './errorLogging';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.on('error', (err: Error) => {
  logError(err, 'Unexpected error on idle client');
  process.exit(-1);
});

pool.on('connect', () => {
  logInfo('Connected to the database');
});

export default pool;

