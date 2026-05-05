/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/designers/[id]/route.ts
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const designerId = parseInt(id);

    if (isNaN(designerId)) {
      return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
    }

    const connection = await pool.getConnection();

    try {
      const [rows] = await connection.execute(
        `SELECT id, name, email, phone, company, specialization, experience, 
                portfolio, cv_filename, cv_url, bio, location, status, created_at
         FROM designers WHERE id = ?`,
        [designerId]
      );

      const designers = rows as any[];
      if (designers.length === 0) {
        return NextResponse.json({ success: false, error: 'Designer not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, data: designers[0] });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('GET designer error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch designer' }, { status: 500 });
  }
}