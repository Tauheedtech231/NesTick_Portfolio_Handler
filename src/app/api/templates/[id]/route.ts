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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let connection;
  
  try {
    const { id } = await params;
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { success: false, message: "Invalid template ID" },
        { status: 400 }
      );
    }

    // Connect to database
    connection = await mysql.createConnection(dbConfig);

    // Check if template exists
    const [templates] = await connection.execute(
      'SELECT id FROM templates WHERE id = ?',
      [id]
    );

    const templateArray = templates as any[];

    if (templateArray.length === 0) {
      return NextResponse.json(
        { success: false, message: "Template not found" },
        { status: 404 }
      );
    }

    // Delete the template
    await connection.execute(
      'DELETE FROM templates WHERE id = ?',
      [id]
    );

    return NextResponse.json({
      success: true,
      message: "Template deleted successfully"
    });

  } catch (error: unknown) {
    console.error('Delete template error:', error);
    
    if (error instanceof Error && 'code' in error && error.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { success: false, message: "Database connection failed" },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to delete template" },
      { status: 500 }
    );
  } finally {
    // Close connection if it exists
    if (connection) {
      await connection.end();
    }
  }
}

// GET single template by ID (optional, for future use)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let connection;
  
  try {
    const { id } = await params;
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { success: false, message: "Invalid template ID" },
        { status: 400 }
      );
    }

    // Connect to database
    connection = await mysql.createConnection(dbConfig);

    // Get template by ID
    const [templates] = await connection.execute(
      'SELECT * FROM templates WHERE id = ?',
      [id]
    );

    const templateArray = templates as unknown[];

    if (templateArray.length === 0) {
      return NextResponse.json(
        { success: false, message: "Template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      template: templateArray[0] as Record<string, unknown>
    });

  } catch (error: unknown) {
    console.error('Get template error:', error);
    
    if (error instanceof Error && 'code' in error && error.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { success: false, message: "Database connection failed" },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to fetch template" },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}