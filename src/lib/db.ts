/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/db.ts
import mysql from 'mysql2/promise';

// ✅ Global pool to prevent recreation on hot reload (Next.js dev mode fix)
declare global {
  var _pool: mysql.Pool | undefined;
}

function getPool() {
  // Check if pool exists in global (prevents recreation on hot reload)
  if (!global._pool) {
    console.log('Creating new database pool...');
    global._pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
      idleTimeout: 60000,        // 60 seconds idle timeout
      connectTimeout: 30000,      // 30 seconds connect timeout
    });
  }
  return global._pool;
}

// Helper function to execute queries
export async function query(sql: string, params?: any[]) {
  const pool = getPool();
  const connection = await pool.getConnection();
  
  try {
    const [rows] = await connection.execute(sql, params);
    return rows;
  } finally {
    connection.release();
    console.log('🔌 Query connection released');
  }
}

// Helper function to get connection for transactions
export async function getConnection(): Promise<mysql.PoolConnection> {
  const pool = getPool();
  const connection = await pool.getConnection();
  console.log('🔗 New connection acquired');
  return connection;
}

// Helper function to execute query with automatic retry on connection lost
export async function executeWithRetry<T>(
  queryFn: (connection: mysql.PoolConnection) => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let i = 0; i < maxRetries; i++) {
    let connection;
    try {
      connection = await getPool().getConnection();
      const result = await queryFn(connection);
      return result;
    } catch (error: any) {
      lastError = error;
      console.error(`Attempt ${i + 1} failed:`, error.message);
      
      if (error.code === 'PROTOCOL_CONNECTION_LOST' && i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }
      throw error;
    } finally {
      if (connection) {
        connection.release();
        console.log('🔌 Retry connection released');
      }
    }
  }
  
  throw lastError;
}

// Export pool for direct use if needed
export { getPool };