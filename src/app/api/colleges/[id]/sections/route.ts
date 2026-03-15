// src/app/api/colleges/[id]/sections/route.ts
import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';
/* eslint-disable */

interface Params {
  id: string;
}

const dbConfig = {
  host:process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  ssl: {
    rejectUnauthorized: false
  }
};

export async function GET(
  request: Request,
  { params }: { params: Promise<Params> } // <-- unwrap Promise
) {
  let connection: mysql.Connection | undefined;

  try {
    // Unwrap params
    const { id: collegeId } = await params;
    console.log('Fetching sections for college ID:', collegeId);

    // Extract template_id from query parameters
    const { searchParams } = new URL(request.url);
    const templateId = searchParams.get('template_id');

    // Validate required parameters
    if (!collegeId || !templateId) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'College ID and Template ID are required' 
        },
        { status: 400 }
      );
    }

    // Create database connection
    connection = await mysql.createConnection(dbConfig);

    // Query to fetch sections for the specific college and template
    const [sections] = await connection.execute<mysql.RowDataPacket[]>(
      `SELECT * FROM college_template_sections 
       WHERE college_id = ? AND template_id = ?`,
      [collegeId, templateId]
    );

    return NextResponse.json({
      success: true,
      data: sections,
      count: sections.length
    });

  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch sections',
        error: error?.message || 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
