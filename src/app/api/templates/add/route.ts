import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
/* eslint-disable */

// Database configuration
const dbConfig = {
  host: "72.61.117.188",
  user: "portfolio_user",
  password: "StrongPass123!",
  database: "portfolio_handler_db",
};

export async function POST(request: NextRequest) {
  let connection;
  
  try {
    const body = await request.json();
    const { name, description, image, live_url, type } = body;

    // Validation
    if (!name || !description) {
      return NextResponse.json(
        { success: false, message: "Name and description are required" },
        { status: 400 }
      );
    }

    if (!image) {
      return NextResponse.json(
        { success: false, message: "Image is required" },
        { status: 400 }
      );
    }

    // Validate type
    const validTypes = ['free', 'paid'];
    const templateType = validTypes.includes(type) ? type : 'free';

    // Connect to database
    connection = await mysql.createConnection(dbConfig);

    // Directly insert a new template (no ID or name check)
    const [result] = await connection.execute(
      'INSERT INTO templates (name, description, image, live_url, type) VALUES (?, ?, ?, ?, ?)',
      [name, description, image, live_url || null, templateType]
    );

    const insertResult = result as any;

    return NextResponse.json({
      success: true,
      message: "Template created successfully",
      templateId: insertResult.insertId
    });

  } catch (error: any) {
    console.error('Template creation error:', error);
    
    if (error.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { success: false, message: "Database connection failed" },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to create template" },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
