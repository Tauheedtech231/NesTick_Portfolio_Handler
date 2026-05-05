/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/admin/designs/[id]/route.ts
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

// GET - Fetch single design by ID (with documents)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ Await params first (Next.js 15 fix)
    const { id } = await params;
    const designId = parseInt(id);
    
    if (isNaN(designId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid design ID' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();

    try {
      // ✅ Added white_paper, white_paper_filename, instruction_doc, instruction_filename fields
      const [rows] = await connection.execute(
        `SELECT 
          dd.id,
          dd.title,
          dd.description,
          dd.preview_image,
          dd.category,
          dd.price,
          dd.status,
          dd.designer_id,
          dd.figma_url,
          dd.live_url,
          dd.tags,
          dd.rejection_reason,
          dd.created_at,
          dd.white_paper,
          dd.white_paper_filename,
          dd.instruction_doc,
          dd.instruction_filename,
          d.name as designer_name,
          d.email as designer_email
         FROM designer_designs dd
         LEFT JOIN designers d ON dd.designer_id = d.id
         WHERE dd.id = ?`,
        [designId]
      );

      const designs = rows as any[];
      
      if (designs.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Design not found' },
          { status: 404 }
        );
      }

      const design = designs[0];
      
      // Parse tags if it's a JSON string
      if (design.tags && typeof design.tags === 'string') {
        try {
          design.tags = JSON.parse(design.tags);
        } catch {
          design.tags = [];
        }
      } else if (!design.tags) {
        design.tags = [];
      }

      return NextResponse.json({
        success: true,
        design: design
      });

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('GET design detail error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch design details' },
      { status: 500 }
    );
  }
}

// PUT - Update design status (approve/reject)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ Await params first
    const { id } = await params;
    const designId = parseInt(id);
    const body = await request.json();
    const { status, rejection_reason } = body;

    if (isNaN(designId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid design ID' },
        { status: 400 }
      );
    }

    if (!status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Valid status (approved/rejected) is required' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();

    try {
      // Check if design exists
      const [checkRows] = await connection.execute(
        'SELECT id FROM designer_designs WHERE id = ?',
        [designId]
      );

      if ((checkRows as any[]).length === 0) {
        return NextResponse.json(
          { success: false, error: 'Design not found' },
          { status: 404 }
        );
      }

      // Update design status
      await connection.execute(
        `UPDATE designer_designs 
         SET status = ?, 
             rejection_reason = ?,
             approved_at = CASE WHEN ? = 'approved' THEN NOW() ELSE approved_at END,
             updated_at = NOW()
         WHERE id = ?`,
        [status, rejection_reason || null, status, designId]
      );

      return NextResponse.json({
        success: true,
        message: `Design ${status} successfully`
      });

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('PUT design error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update design' },
      { status: 500 }
    );
  }
}

// DELETE - Remove design
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ Await params first
    const { id } = await params;
    const designId = parseInt(id);

    if (isNaN(designId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid design ID' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();

    try {
      const [result] = await connection.execute(
        'DELETE FROM designer_designs WHERE id = ?',
        [designId]
      );

      const deleteResult = result as any;
      
      if (deleteResult.affectedRows === 0) {
        return NextResponse.json(
          { success: false, error: 'Design not found' },
          { status: 404 }
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
    console.error('DELETE design error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete design' },
      { status: 500 }
    );
  }
}