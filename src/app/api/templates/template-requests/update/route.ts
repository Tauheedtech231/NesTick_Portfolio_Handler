import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
/* eslint-disable */

const dbConfig = {
  host:process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export async function PATCH(request: NextRequest) {
  let connection;
  
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Request ID is required" },
        { status: 400 }
      );
    }

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Valid status is required (pending, approved, rejected)" },
        { status: 400 }
      );
    }

    // Connect to database
    connection = await mysql.createConnection(dbConfig);

    // Check if request exists
    const [requests] = await connection.execute(
      'SELECT * FROM template_requests WHERE id = ?',
      [id]
    );

    const requestArray = requests as any[];

    if (requestArray.length === 0) {
      return NextResponse.json(
        { success: false, message: "Request not found" },
        { status: 404 }
      );
    }

    // Update request status
    await connection.execute(
      'UPDATE template_requests SET status = ?, updatedAt = NOW() WHERE id = ?',
      [status, id]
    );

    return NextResponse.json({
      success: true,
      message: `Request ${status} successfully`
    });

  } catch (error: any) {
    console.error('Update request error:', error);
    
    if (error.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { success: false, message: "Database connection failed" },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to update request" },
      { status: 500 }
    );
  } finally {
    // Close connection if it exists
    if (connection) {
      await connection.end();
    }
  }
}