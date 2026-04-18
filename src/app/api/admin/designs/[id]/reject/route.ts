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
  try {
    // ✅ Await params because it's a Promise in Next.js 15+
    const { id } = await params;
    const designId = parseInt(id);
    const body = await request.json();
    const { reason } = body;

    console.log('📥 Rejecting design:', designId, 'Reason:', reason);

    const connection = await pool.getConnection();

    try {
      await connection.execute(
        `UPDATE designer_designs 
         SET status = 'rejected', rejection_reason = ?, updated_at = NOW() 
         WHERE id = ?`,
        [reason, designId]
      );

      console.log('✅ Design rejected:', designId);

      return NextResponse.json({
        success: true,
        message: 'Design rejected successfully'
      });

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('❌ Reject design error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reject design' },
      { status: 500 }
    );
  }
}