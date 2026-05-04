/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/developer/earnings/export/route.ts
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

    if (!developerId) {
      return NextResponse.json({ success: false, error: 'Developer ID required' }, { status: 401 });
    }

    const connection = await pool.getConnection();

    try {
      const [rows] = await connection.execute(
        `SELECT 
          dd.title as design_title,
          ds.amount,
          ds.platform_fee,
          ds.developer_earning,
          ds.status,
          ds.purchased_at,
          ds.buyer_name,
          ds.buyer_email
         FROM developer_sales ds
         LEFT JOIN designer_designs dd ON ds.design_id = dd.id
         WHERE ds.developer_id = ?
         ORDER BY ds.purchased_at DESC`,
        [developerId]
      );

      // Create CSV
      const headers = ['Design Title', 'Amount', 'Platform Fee', 'Your Earnings', 'Status', 'Purchase Date', 'Buyer Name', 'Buyer Email'];
      const csvRows = [headers];

      for (const row of rows as any[]) {
        csvRows.push([
          row.design_title,
          row.amount,
          row.platform_fee,
          row.developer_earning,
          row.status,
          new Date(row.purchased_at).toLocaleDateString(),
          row.buyer_name,
          row.buyer_email
        ]);
      }

      const csvContent = csvRows.map(row => row.join(',')).join('\n');
      
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename=earnings-${new Date().toISOString().split('T')[0]}.csv`
        }
      });

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Export earnings error:', error);
    return NextResponse.json({ success: false, error: 'Failed to export earnings' }, { status: 500 });
  }
}