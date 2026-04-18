// app/api/designer/notifications/route.ts
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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const designerId = searchParams.get('designerId');

    if (!designerId) {
      return NextResponse.json(
        { success: false, error: 'Designer ID required' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();

    try {
      const [rows] = await connection.execute(
        `SELECT id, title, message, type, is_read, created_at, related_id 
         FROM designer_notifications 
         WHERE designer_id = ? 
         ORDER BY created_at DESC 
         LIMIT 50`,
        [designerId]
      );

      return NextResponse.json({
        success: true,
        notifications: rows
      });

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Notifications API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}