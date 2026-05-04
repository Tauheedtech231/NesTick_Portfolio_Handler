// app/api/developer/notifications/route.ts
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
    const developerId = searchParams.get('developerId');

    if (!developerId) {
      return NextResponse.json({ success: false, error: 'Developer ID required' }, { status: 401 });
    }

    const connection = await pool.getConnection();

    try {
      const [rows] = await connection.execute(
        `SELECT * FROM developer_notifications 
         WHERE developer_id = ? 
         ORDER BY created_at DESC`,
        [developerId]
      );

      return NextResponse.json({
        success: true,
        data: rows
      });

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Notifications API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, is_read, developerId } = body;

    if (!id || !developerId) {
      return NextResponse.json({ success: false, error: 'ID and developerId required' }, { status: 400 });
    }

    const connection = await pool.getConnection();

    try {
      await connection.execute(
        'UPDATE developer_notifications SET is_read = ? WHERE id = ? AND developer_id = ?',
        [is_read ? 1 : 0, id, developerId]
      );

      return NextResponse.json({
        success: true,
        message: 'Notification updated'
      });

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Update notification error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, developerId } = body;

    if (!id || !developerId) {
      return NextResponse.json({ success: false, error: 'ID and developerId required' }, { status: 400 });
    }

    const connection = await pool.getConnection();

    try {
      await connection.execute(
        'DELETE FROM developer_notifications WHERE id = ? AND developer_id = ?',
        [id, developerId]
      );

      return NextResponse.json({
        success: true,
        message: 'Notification deleted'
      });

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Delete notification error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}