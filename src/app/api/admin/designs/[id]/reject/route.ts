// app/api/admin/designs/[id]/reject/route.ts
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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let connection;
  
  try {
    // ✅ Await params because it's a Promise in Next.js 15+
    const { id } = await params;
    const designId = parseInt(id);
    const body = await request.json();
    const { reason } = body;

    console.log('📥 Rejecting design:', designId, 'Reason:', reason);

    if (!reason) {
      return NextResponse.json(
        { success: false, error: 'Rejection reason is required' },
        { status: 400 }
      );
    }

    connection = await pool.getConnection();

    // Get current design details
    const [designs] = await connection.execute(
      `SELECT id, revision_count, is_permanently_rejected 
       FROM designer_designs 
       WHERE id = ?`,
      [designId]
    );

    const design = (designs as any[])[0];
    
    if (!design) {
      return NextResponse.json(
        { success: false, error: 'Design not found' },
        { status: 404 }
      );
    }

    // Check if already permanently rejected
    if (design.is_permanently_rejected) {
      return NextResponse.json(
        { success: false, error: 'Design is permanently rejected. Cannot reject again.' },
        { status: 400 }
      );
    }

    // Calculate new revision count
    const newRevisionCount = design.revision_count + 1;
    const isPermanentlyRejected = newRevisionCount >= 3;

    // Update design with rejection and revision tracking
    await connection.execute(
      `UPDATE designer_designs 
       SET status = 'rejected', 
           rejection_reason = ?, 
           revision_count = ?,
           is_permanently_rejected = ?,
           updated_at = NOW() 
       WHERE id = ?`,
      [reason, newRevisionCount, isPermanentlyRejected, designId]
    );

    // Create notification for designer
    const notificationMessage = isPermanentlyRejected
      ? `Your design has been rejected ${newRevisionCount} times. It is permanently rejected.`
      : `Your design has been rejected. Please check the reason below and resubmit. (Revision ${newRevisionCount}/3)`;

    await connection.execute(
      `INSERT INTO designer_notifications 
       (designer_id, title, message, type, related_id, created_at) 
       SELECT designer_id, 'Design Rejected', ?, 'design_rejected', ?, NOW()
       FROM designer_designs WHERE id = ?`,
      [notificationMessage, designId, designId]
    );

    console.log('✅ Design rejected:', designId, 'Revision:', newRevisionCount, 'Permanently:', isPermanentlyRejected);

    return NextResponse.json({
      success: true,
      message: isPermanentlyRejected ? 'Design permanently rejected' : 'Design rejected',
      revision_count: newRevisionCount,
      is_permanently_rejected: isPermanentlyRejected,
      remaining_revisions: 3 - newRevisionCount
    });

  } catch (error) {
    console.error('❌ Reject design error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reject design' },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}