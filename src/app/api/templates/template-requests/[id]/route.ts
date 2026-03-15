import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
/* eslint-disable */

const dbConfig = {
  host:process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let connection;
  
  try {
    const { id } = await params;
    console.log('Updating request ID:', id);
    
    const body = await request.json() as { status: string };
    const { status } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "Request ID is required" }, { status: 400 });
    }

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json({ success: false, message: "Valid status is required (pending, approved, rejected)" }, { status: 400 });
    }

    // Connect to database
    connection = await mysql.createConnection(dbConfig);

    // Check if request exists
    const [requests] = await connection.execute(
      'SELECT * FROM template_requests WHERE id = ?',
      [id]
    );

    const requestArray = requests as unknown[];
    if (requestArray.length === 0) {
      return NextResponse.json({ success: false, message: "Request not found" }, { status: 404 });
    }

    // Update request status with updated_at
    await connection.execute(
      'UPDATE template_requests SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, id]
    );

    return NextResponse.json({
      success: true,
      message: `Request ${status} successfully`
    });

  } catch (error: unknown) {
    console.error('Update request error:', error);
    
    if (error instanceof Error && 'code' in error && error.code === 'ECONNREFUSED') {
      return NextResponse.json({ success: false, message: "Database connection failed" }, { status: 503 });
    }

    return NextResponse.json({ success: false, message: "Failed to update request" }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let connection;
  
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ success: false, message: "Request ID is required" }, { status: 400 });

    connection = await mysql.createConnection(dbConfig);

    await connection.execute('DELETE FROM template_requests WHERE id = ?', [id]);

    return NextResponse.json({ success: true, message: "Request deleted successfully" });

  } catch (error: unknown) {
    console.error('Delete request error:', error);

    if (error instanceof Error && 'code' in error && error.code === 'ECONNREFUSED') {
      return NextResponse.json({ success: false, message: "Database connection failed" }, { status: 503 });
    }

    return NextResponse.json({ success: false, message: "Failed to delete request" }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}
