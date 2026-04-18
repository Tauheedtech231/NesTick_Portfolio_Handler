/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/designer/designs/[id]/route.ts
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

// PUT - Update design
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // Changed to Promise
) {
  try {
    const { id } = await params;  // Await the params
    const designId = parseInt(id);
    const body = await request.json();
    const { title, description, category, price, tags, figma_url, live_url } = body;

    const connection = await pool.getConnection();

    try {
      await connection.execute(
        `UPDATE designer_designs 
         SET title = ?, description = ?, category = ?, price = ?, tags = ?, 
             figma_url = ?, live_url = ?, updated_at = NOW()
         WHERE id = ?`,
        [title, description, category, price, JSON.stringify(tags), figma_url, live_url, designId]
      );

      return NextResponse.json({
        success: true,
        message: 'Design updated successfully'
      });

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Update design error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update design' },
      { status: 500 }
    );
  }
}

// DELETE - Delete design
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // Changed to Promise
) {
  try {
    const { id } = await params;  // Await the params
    const designId = parseInt(id);

    const connection = await pool.getConnection();

    try {
      // First get designer_id to update count
      const [designRows] = await connection.execute(
        'SELECT designer_id FROM designer_designs WHERE id = ?',
        [designId]
      );
      const design = (designRows as any[])[0];

      if (design) {
        // Delete design
        await connection.execute('DELETE FROM designer_designs WHERE id = ?', [designId]);
        
        // Update designer's total_designs count
        await connection.execute(
          'UPDATE designers SET total_designs = total_designs - 1 WHERE id = ?',
          [design.designer_id]
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Design deleted successfully'
      });

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Delete design error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete design' },
      { status: 500 }
    );
  }
}