/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/developers/assigned-designs/route.ts
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
    const countOnly = searchParams.get('count') === 'true';

    if (!developerId) {
      return NextResponse.json(
        { success: false, error: 'Developer ID is required' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();

    try {
      if (countOnly) {
        // Just return the count
        const [rows] = await connection.execute(
          `SELECT COUNT(*) as count FROM developer_assignments 
           WHERE developer_id = ? AND status NOT IN ('completed', 'rejected')`,
          [parseInt(developerId)]
        );
        return NextResponse.json({ success: true, count: (rows as any[])[0].count });
      }

      // Return full design details
      const [rows] = await connection.execute(
        `SELECT 
          da.id,
          da.design_id,
          da.status,
          da.assigned_at,
          da.deadline,
          dd.title as design_title,
          dd.description as design_description,
          d.name as designer_name
         FROM developer_assignments da
         LEFT JOIN designer_designs dd ON da.design_id = dd.id
         LEFT JOIN designers d ON dd.designer_id = d.id
         WHERE da.developer_id = ?
         ORDER BY da.assigned_at DESC`,
        [parseInt(developerId)]
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
    console.error('Error fetching assigned designs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch assigned designs' },
      { status: 500 }
    );
  }
}