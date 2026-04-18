/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/admin/designs/route.ts
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
    const status = searchParams.get('status');

    let query = `
      SELECT 
        dd.*,
        d.name as designer_name,
        d.email as designer_email
      FROM designer_designs dd
      JOIN designers d ON dd.designer_id = d.id
    `;
    const params: any[] = [];

    if (status && status !== 'all') {
      query += ' WHERE dd.status = ?';
      params.push(status);
    }

    query += ' ORDER BY dd.created_at DESC';

    const connection = await pool.getConnection();

    try {
      const [rows] = await connection.execute(query, params);
      const designs = rows as any[];

      // Parse tags for each design
      const parsedDesigns = designs.map(design => ({
        ...design,
        tags: typeof design.tags === 'string' ? JSON.parse(design.tags) : design.tags
      }));

      return NextResponse.json({
        success: true,
        designs: parsedDesigns
      });

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Admin designs API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch designs' },
      { status: 500 }
    );
  }
}