/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/dashboard/stats/route.ts
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
    const connection = await pool.getConnection();

    try {
      const [rows] = await connection.execute(
        `SELECT 
          (SELECT COUNT(*) FROM designers) AS total_designers,
          (SELECT COUNT(*) FROM designer_designs) AS total_designs,
          (SELECT COUNT(*) FROM templates) AS total_templates`
      );

      const data = (rows as any[])[0];

      return NextResponse.json({
        success: true,
        data: {
          totalDesigners: data.total_designers || 0,
          totalDesigns: data.total_designs || 0,
          totalTemplates: data.total_templates || 0
        }
      });

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch dashboard statistics' 
    }, { status: 500 });
  }
}