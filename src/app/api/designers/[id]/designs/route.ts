/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/designers/[id]/designs/route.ts
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
        `SELECT id, title, description, preview_image, category, price, status, 
                figma_url, live_url, created_at
         FROM designer_designs 
         WHERE designer_id = ?
         ORDER BY created_at DESC`,
        [designerId]
      );

      return NextResponse.json({ 
        success: true, 
        designs: rows,
        count: (rows as any[]).length
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('GET designer designs error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch designs' }, { status: 500 });
  }
}