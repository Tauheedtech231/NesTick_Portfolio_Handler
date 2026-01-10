// src/app/api/sections/route.ts
import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';
/* eslint-disable */

interface SectionBody {
  college_id: number;
  template_id: number;
  section_name: string;
  is_active?: number;
}

const dbConfig = {
  host: "72.61.117.188",
  user: "portfolio_user",
  password: "StrongPass123!",
  database: "portfolio_handler_db",
  waitForConnections: true,
  connectionLimit: 10,
  ssl: {
    rejectUnauthorized: false
  }
};

// POST: Create new section
export async function POST(request: Request) {
  let connection: mysql.Connection | undefined;

  try {
    const body: SectionBody = await request.json();
    const { college_id, template_id, section_name, is_active = 1 } = body;

    // Validate required fields
    if (!college_id || !template_id || !section_name) {
      return NextResponse.json(
        { success: false, message: 'College ID, Template ID and Section Name are required' },
        { status: 400 }
      );
    }

    // Validate section_name length
    if (section_name.length > 50) {
      return NextResponse.json(
        { success: false, message: 'Section name must be 50 characters or less' },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Check if section already exists
    const [existing] = await connection.execute<mysql.RowDataPacket[]>(
      `SELECT * FROM college_template_sections 
       WHERE college_id = ? AND template_id = ? AND section_name = ?`,
      [college_id, template_id, section_name]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Section with this name already exists for this college and template' },
        { status: 409 }
      );
    }

    // Insert new section
    const [result] = await connection.execute<mysql.ResultSetHeader>(
      `INSERT INTO college_template_sections 
       (college_id, template_id, section_name, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [college_id, template_id, section_name, is_active]
    );

    // Fetch newly created section
    const [newSection] = await connection.execute<mysql.RowDataPacket[]>(
      'SELECT * FROM college_template_sections WHERE id = ?',
      [result.insertId]
    );

    return NextResponse.json({
      success: true,
      message: 'Section created successfully',
      data: newSection[0]
    }, { status: 201 });

  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create section', error: error?.message || 'Unknown error' },
      { status: 500 }
    );
  } finally {
    if (connection) await connection.end();
  }
}

// GET: Get all sections
export async function GET(request: Request) {
  let connection: mysql.Connection | undefined;

  try {
    const { searchParams } = new URL(request.url);
    const college_id = searchParams.get('college_id');
    const template_id = searchParams.get('template_id');

    connection = await mysql.createConnection(dbConfig);

    let query = 'SELECT * FROM college_template_sections';
    const params: (string | number)[] = [];

    if (college_id && template_id) {
      query += ' WHERE college_id = ? AND template_id = ?';
      params.push(college_id, template_id);
    } else if (college_id) {
      query += ' WHERE college_id = ?';
      params.push(college_id);
    }

    const [sections] = await connection.execute<mysql.RowDataPacket[]>(query, params);

    return NextResponse.json({
      success: true,
      data: sections,
      count: sections.length
    });

  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch sections', error: error?.message || 'Unknown error' },
      { status: 500 }
    );
  } finally {
    if (connection) await connection.end();
  }
}
