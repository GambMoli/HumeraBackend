import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});


pool.connect()
  .then(client => {
    console.log('✅ Successfully connected to NeonDB');
    client.release();
  })
  .catch(err => {
    console.error('❌ Error connecting to NeonDB:', err.message);
  });

export const db = pool;