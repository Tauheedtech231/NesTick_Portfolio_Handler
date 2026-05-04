/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/developer/dashboard/route.ts
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

export async function GET(request: NextRequest) {
  try {
    // Get developer ID from session (you need to implement auth)
    // For now, we'll get from header or query
    const searchParams = request.nextUrl.searchParams;
    const developerId = searchParams.get('developerId');

    if (!developerId) {
      return NextResponse.json({ success: false, error: 'Developer ID required' }, { status: 401 });
    }

    const connection = await pool.getConnection();

    try {
      // Get stats
      const [statsRows] = await connection.execute(
        `SELECT 
          COUNT(CASE WHEN status IN ('pending', 'in_progress', 'submitted') THEN 1 END) as total_assigned,
          COUNT(CASE WHEN status = 'submitted' THEN 1 END) as pending_submissions,
          COUNT(CASE WHEN status = 'approved' THEN 1 END) as completed_designs
         FROM developer_assignments 
         WHERE developer_id = ?`,
        [developerId]
      );

      // Get earnings summary
      const [earningsRows] = await connection.execute(
        `SELECT 
          COALESCE(SUM(developer_earning), 0) as total_earnings,
          COALESCE(SUM(CASE WHEN status = 'pending' THEN developer_earning ELSE 0 END), 0) as pending_earnings,
          COALESCE(SUM(CASE WHEN status = 'completed' THEN developer_earning ELSE 0 END), 0) as paid_earnings
         FROM developer_sales 
         WHERE developer_id = ?`,
        [developerId]
      );

      // Get recent assignments
      const [recentRows] = await connection.execute(
        `SELECT da.id, dd.title as design_title, da.status, da.assigned_at, da.deadline
         FROM developer_assignments da
         LEFT JOIN designer_designs dd ON da.design_id = dd.id
         WHERE da.developer_id = ?
         ORDER BY da.assigned_at DESC
         LIMIT 5`,
        [developerId]
      );

      const stats = (statsRows as any[])[0];
      const earnings = (earningsRows as any[])[0];

      return NextResponse.json({
        success: true,
        data: {
          totalAssigned: stats.total_assigned || 0,
          pendingSubmissions: stats.pending_submissions || 0,
          completedDesigns: stats.completed_designs || 0,
          totalEarnings: earnings.total_earnings || 0,
          pendingEarnings: earnings.pending_earnings || 0,
          paidEarnings: earnings.paid_earnings || 0,
          recentAssignments: recentRows
        }
      });

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}