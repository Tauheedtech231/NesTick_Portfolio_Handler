/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/designer/change-password/route.ts
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
    const { designerId, currentPassword, newPassword } = body;

    if (!designerId || !currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();

    try {
      // Get current password hash
      const [rows] = await connection.execute(
        'SELECT password FROM designers WHERE id = ?',
        [designerId]
      );

      const designers = rows as any[];
      
      if (designers.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Designer not found' },
          { status: 404 }
        );
      }

      // Verify current password
      const isValid = await bcrypt.compare(currentPassword, designers[0].password);
      
      if (!isValid) {
        return NextResponse.json(
          { success: false, error: 'Current password is incorrect' },
          { status: 401 }
        );
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      await connection.execute(
        'UPDATE designers SET password = ?, updated_at = NOW() WHERE id = ?',
        [hashedPassword, designerId]
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
    return NextResponse.json(
      { success: false, error: 'Failed to change password' },
      { status: 500 }
    );
  }
}