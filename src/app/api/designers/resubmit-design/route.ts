// app/api/designers/resubmit-design/route.ts
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
  let connection;
  
  try {
    const body = await request.json();
    const { design_id, designer_id } = body;

    if (!design_id || !designer_id) {
      return NextResponse.json(
        { success: false, error: 'Design ID and Designer ID are required' },
        { status: 400 }
      );
    }

    connection = await pool.getConnection();

    // Get design details
    const [designs] = await connection.execute(
      `SELECT id, status, revision_count, is_permanently_rejected 
       FROM designer_designs 
       WHERE id = ? AND designer_id = ?`,
      [design_id, designer_id]
    ) as any[];

    if (designs.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Design not found' },
        { status: 404 }
      );
    }

    const design = designs[0];

    // Check if permanently rejected
    if (design.is_permanently_rejected) {
      return NextResponse.json(
        { success: false, error: 'Design is permanently rejected. Cannot resubmit.' },
        { status: 400 }
      );
    }

    // Check if already at max revisions
    if (design.revision_count >= 3) {
      return NextResponse.json(
        { success: false, error: 'Maximum revisions reached. Design permanently rejected.' },
        { status: 400 }
      );
    }

    // Check if design is rejected (only rejected can be resubmitted)
    if (design.status !== 'rejected') {
      return NextResponse.json(
        { success: false, error: 'Only rejected designs can be resubmitted' },
        { status: 400 }
      );
    }

    // Resubmit: change status to pending, clear rejection reason
    await connection.execute(
      `UPDATE designer_designs 
       SET status = 'pending',
           rejection_reason = NULL,
           updated_at = NOW()
       WHERE id = ?`,
      [design_id]
    );

    return NextResponse.json({
      success: true,
      message: 'Design resubmitted for review successfully'
    });

  } catch (error) {
    console.error('Resubmit error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to resubmit design' },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}