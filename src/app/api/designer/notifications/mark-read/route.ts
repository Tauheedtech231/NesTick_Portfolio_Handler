// app/api/designer/notifications/mark-read/route.ts
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { notificationId, designerId } = body;

    if (!notificationId || !designerId) {
      return NextResponse.json(
        { success: false, error: 'Notification ID and Designer ID required' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();

    try {
      await connection.execute(
        `UPDATE designer_notifications 
         SET is_read = TRUE 
         WHERE id = ? AND designer_id = ?`,
        [notificationId, designerId]
      );

      return NextResponse.json({
        success: true,
        message: 'Notification marked as read'
      });

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Mark read API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to mark notification as read' },
      { status: 500 }
    );
  }
}