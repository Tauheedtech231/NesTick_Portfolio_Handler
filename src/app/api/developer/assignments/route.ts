/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/developer/assignments/route.ts (Complete updated file)

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
    const id = searchParams.get('id');
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');

    if (!developerId) {
      return NextResponse.json({ success: false, error: 'Developer ID required' }, { status: 401 });
    }

    const connection = await pool.getConnection();

    try {
      let query = `
        SELECT 
          da.id,
          da.design_id,
          dd.title as design_title,
          dd.description as design_description,
          dd.preview_image as preview_image,
          dd.figma_url as figma_url,
          d.name as designer_name,
          da.status,
          da.assigned_at,
          da.deadline,
          da.notes,
          da.submission_url,
          da.review_notes
        FROM developer_assignments da
        LEFT JOIN designer_designs dd ON da.design_id = dd.id
        LEFT JOIN designers d ON dd.designer_id = d.id
        WHERE da.developer_id = ?
      `;
      const params: any[] = [developerId];

      if (id) {
        query += ' AND da.id = ?';
        params.push(parseInt(id));
      }
      if (status) {
        query += ' AND da.status = ?';
        params.push(status);
      }

      query += ' ORDER BY da.assigned_at DESC';
      
      if (limit) {
        query += ' LIMIT ?';
        params.push(parseInt(limit));
      }

      const [rows] = await connection.execute(query, params);

      // Transform response to match frontend expected fields
      const transformedRows = (rows as any[]).map(row => ({
        ...row,
        design_preview_image: row.preview_image,
        design_figma_url: row.figma_url
      }));

      return NextResponse.json({
        success: true,
        data: transformedRows,
        count: transformedRows.length
      });

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Assignments API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, developerId } = body;

    if (!id || !status || !developerId) {
      return NextResponse.json({ success: false, error: 'ID, status and developerId required' }, { status: 400 });
    }

    const connection = await pool.getConnection();

    try {
      await connection.execute(
        'UPDATE developer_assignments SET status = ? WHERE id = ? AND developer_id = ?',
        [status, id, developerId]
      );

      return NextResponse.json({
        success: true,
        message: 'Assignment updated successfully'
      });

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Update assignment error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}