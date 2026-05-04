/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/developer/earnings/route.ts
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
    const searchParams = request.nextUrl.searchParams;
    const developerId = searchParams.get('developerId');
    const summary = searchParams.get('summary') === 'true';

    if (!developerId) {
      return NextResponse.json({ success: false, error: 'Developer ID required' }, { status: 401 });
    }

    const connection = await pool.getConnection();

    try {
      if (summary) {
        const [rows] = await connection.execute(
          `SELECT 
            COALESCE(SUM(CASE WHEN status = 'completed' THEN developer_earning ELSE 0 END), 0) as paid_earnings,
            COALESCE(SUM(CASE WHEN status = 'pending' THEN developer_earning ELSE 0 END), 0) as pending_earnings
           FROM developer_sales 
           WHERE developer_id = ?`,
          [developerId]
        );
        return NextResponse.json({ success: true, ...(rows as any[])[0] });
      }

      const [rows] = await connection.execute(
        `SELECT ds.*, dd.title as design_title
         FROM developer_sales ds
         LEFT JOIN designer_designs dd ON ds.design_id = dd.id
         WHERE ds.developer_id = ?
         ORDER BY ds.purchased_at DESC`,
        [developerId]
      );

      const [summaryRows] = await connection.execute(
        `SELECT 
          COALESCE(SUM(developer_earning), 0) as total_earnings,
          COALESCE(SUM(CASE WHEN status = 'pending' THEN developer_earning ELSE 0 END), 0) as pending_earnings,
          COALESCE(SUM(CASE WHEN status = 'completed' THEN developer_earning ELSE 0 END), 0) as paid_earnings,
          COUNT(*) as total_sales
         FROM developer_sales 
         WHERE developer_id = ?`,
        [developerId]
      );

      return NextResponse.json({
        success: true,
        data: rows,
        summary: (summaryRows as any[])[0]
      });

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Earnings API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}