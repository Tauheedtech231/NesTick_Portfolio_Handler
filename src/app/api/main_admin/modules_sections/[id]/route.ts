// src/app/api/sections/[id]/route.ts
/* eslint-disable */

import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';

interface Params {
  id: string;
}

interface PatchBody {
  is_active: number;
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

// PATCH: Enable/Disable a section
export async function PATCH(
  request: Request,
  { params }: { params: Promise<Params> } // <-- unwrap Promise
) {
  let connection: mysql.Connection | undefined;

  try {
    const { id: sectionId } = await params; // <-- unwrap params here
    const body: PatchBody = await request.json();
    const { is_active } = body;

    if (!sectionId) {
      return NextResponse.json({ success: false, message: 'Section ID is required' }, { status: 400 });
    }

    if (is_active === undefined || is_active === null) {
      return NextResponse.json({ success: false, message: 'is_active field is required' }, { status: 400 });
    }

    const isActiveValue = Number(is_active);
    if (![0, 1].includes(isActiveValue)) {
      return NextResponse.json({ success: false, message: 'is_active must be 0 or 1' }, { status: 400 });
    }

    connection = await mysql.createConnection(dbConfig);

    const [existingSection] = await connection.execute<mysql.RowDataPacket[]>(
      'SELECT * FROM college_template_sections WHERE id = ?',
      [sectionId]
    );

    if (existingSection.length === 0) {
      return NextResponse.json({ success: false, message: 'Section not found' }, { status: 404 });
    }

    const [result] = await connection.execute<mysql.ResultSetHeader>(
      'UPDATE college_template_sections SET is_active = ? WHERE id = ?',
      [isActiveValue, sectionId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, message: 'Failed to update section' }, { status: 500 });
    }

    const [updatedSection] = await connection.execute<mysql.RowDataPacket[]>(
      'SELECT * FROM college_template_sections WHERE id = ?',
      [sectionId]
    );

    return NextResponse.json({
      success: true,
      message: `Section ${isActiveValue ? 'enabled' : 'disabled'} successfully`,
      data: updatedSection[0]
    });

  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update section',
      error: error?.message || 'Unknown error'
    }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}

// GET: Fetch a single section by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<Params> } // <-- unwrap Promise
) {
  let connection: mysql.Connection | undefined;

  try {
    const { id: sectionId } = await params; // <-- unwrap params here
    if (!sectionId) {
      return NextResponse.json({ success: false, message: 'Section ID is required' }, { status: 400 });
    }

    connection = await mysql.createConnection(dbConfig);

    const [sections] = await connection.execute<mysql.RowDataPacket[]>(
      'SELECT * FROM college_template_sections WHERE id = ?',
      [sectionId]
    );

    if (sections.length === 0) {
      return NextResponse.json({ success: false, message: 'Section not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: sections[0] });

  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch section',
      error: error?.message || 'Unknown error'
    }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}
