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

    // Check if the template already exists with ID 2 or name 'College Website Template'
    const [existingTemplate]: any = await connection.execute(
      "SELECT * FROM templates WHERE id = 2 OR name = ?",
      ['College Website Template']
    );

    if (existingTemplate.length > 0) {
      // Update the existing template instead of inserting a new one
      await connection.execute(
        "UPDATE templates SET name = ?, description = ?, image = ?, live_url = ?, type = ? WHERE id = 2",
        [name, description, image, live_url || null, templateType]
      );

      return NextResponse.json({
        success: true,
        message: "Template updated successfully",
        templateId: 2
      });
    }

    // Otherwise insert a new template
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
    console.error('Template creation/update error:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { success: false, message: "A template with this name already exists" },
        { status: 409 }
      );
    }

    if (error.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { success: false, message: "Database connection failed" },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to create or update template" },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
