/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/designer/designs/route.ts
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
    const { designer_id, title, description, category, tags, price, preview_image, figma_url, live_url, status } = body;

    // Validation
    if (!designer_id || !title || !description || !category || !price || !preview_image) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();

    try {
      // Insert design
      const [result] = await connection.execute(
        `INSERT INTO designer_designs 
         (designer_id, title, description, category, tags, price, preview_image, figma_url, live_url, status, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [designer_id, title, description, category, tags, price, preview_image, figma_url || null, live_url || null, status]
      );

      // Update designer's total_designs count
      await connection.execute(
        `UPDATE designers SET total_designs = total_designs + 1 WHERE id = ?`,
        [designer_id]
      );

      return NextResponse.json({
        success: true,
        message: 'Design uploaded successfully',
        designId: (result as any).insertId
      });

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Upload design error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload design' },
      { status: 500 }
    );
  }
}

// GET - Fetch designer's designs
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
        `SELECT id, title, description, category, tags, price, preview_image, figma_url, live_url, 
                status, rejection_reason, downloads, likes, views, created_at, updated_at
         FROM designer_designs 
         WHERE designer_id = ? 
         ORDER BY created_at DESC`,
        [designerId]
      );

      return NextResponse.json({
        success: true,
        designs: rows
      });

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Fetch designs error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch designs' },
      { status: 500 }
    );
  }
}