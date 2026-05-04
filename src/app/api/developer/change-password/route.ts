/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/developer/change-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

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
    const { currentPassword, newPassword, developerId } = body;

    if (!currentPassword || !newPassword || !developerId) {
      return NextResponse.json({ success: false, error: 'Current password, new password and developerId required' }, { status: 400 });
    }

    const connection = await pool.getConnection();

    try {
      const [rows] = await connection.execute(
        'SELECT password FROM developers WHERE id = ?',
        [developerId]
      );

      if ((rows as any[]).length === 0) {
        return NextResponse.json({ success: false, error: 'Developer not found' }, { status: 404 });
      }

      const developer = (rows as any[])[0];
      const isValid = await bcrypt.compare(currentPassword, developer.password);

      if (!isValid) {
        return NextResponse.json({ success: false, error: 'Current password is incorrect' }, { status: 401 });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await connection.execute(
        'UPDATE developers SET password = ? WHERE id = ?',
        [hashedPassword, developerId]
      );

      return NextResponse.json({
        success: true,
        message: 'Password changed successfully'
      });

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json({ success: false, error: 'Failed to change password' }, { status: 500 });
  }
}