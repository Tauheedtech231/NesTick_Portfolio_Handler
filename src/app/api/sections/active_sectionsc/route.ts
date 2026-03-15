// app/api/sections/active_sections/route.ts - Version without portfolio_sections
import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';
/* eslint-disable */
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email is required' 
      }, { status: 400 });
    }

    const connection = await pool.getConnection();

    try {
      // Get college_id and template_id
      const [credRows] = await connection.execute<RowDataPacket[]>(
        `SELECT cc.college_id, tr.template_id
         FROM college_credentials cc
         JOIN template_requests tr ON cc.template_request_id = tr.id
         WHERE cc.login_email = ?
         LIMIT 1`,
        [email]
      );

      if (credRows.length === 0) {
        return NextResponse.json({ 
          success: false, 
          error: 'No credentials found for this email' 
        }, { status: 404 });
      }

      const collegeId = credRows[0].college_id;
      const templateId = credRows[0].template_id;

      // ✅ Get active sections directly from college_template_sections
      const [activeSections] = await connection.execute<RowDataPacket[]>(
        `SELECT section_name 
         FROM college_template_sections 
         WHERE college_id = ? AND template_id = ? AND is_active = 1
         ORDER BY id ASC`,
        [collegeId, templateId]
      );

      const sections = activeSections.map(row => row.section_name);

      return NextResponse.json({
        success: true,
        sections: sections,
        template_id: templateId,
        college_id: collegeId,
        count: sections.length
      });

    } finally {
      connection.release();
    }
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error?.message || 'Internal server error' 
    }, { status: 500 });
  }
}