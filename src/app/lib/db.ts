// app/lib/db.ts
import mysql, { Pool } from 'mysql2/promise';

const dbConfig = {
  host: "72.61.117.188",
  user: "portfolio_user",
  password: "StrongPass123!",
  database: "portfolio_handler_db",
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
