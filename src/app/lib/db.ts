// app/lib/db.ts
import mysql, { Pool } from 'mysql2/promise';

const dbConfig = {
  host:process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  ssl: {
    rejectUnauthorized: false,
  },
};

let pool: Pool | null = null;

/**
 * Returns a MySQL connection pool.
 */
export function getConnection(): Pool {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}
