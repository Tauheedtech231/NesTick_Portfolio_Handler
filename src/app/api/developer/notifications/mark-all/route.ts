// app/api/developer/notifications/mark-all/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const developerId = searchParams.get('developerId');

    if (!developerId) {
      return NextResponse.json({ success: false, error: 'Developer ID required' }, { status: 401 });
    }

    const connection = await pool.getConnection();

    try {
      await connection.execute(
        'UPDATE developer_notifications SET is_read = 1 WHERE developer_id = ?',
        [developerId]
      );

      return NextResponse.json({
        success: true,
        message: 'All notifications marked as read'
      });

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Mark all notifications error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}