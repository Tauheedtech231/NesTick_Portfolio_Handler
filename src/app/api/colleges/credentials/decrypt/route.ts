// app/api/colleges/credentials/decrypt/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
/* eslint-disable */

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  ssl: {
    rejectUnauthorized: false
  }
};

export async function GET(request: NextRequest) {
  let connection;
  
  try {
    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get('requestId');
    
    if (!requestId) {
      return NextResponse.json(
        { success: false, message: 'Request ID is required' },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Get the plain password from database
    // Note: Normally passwords are hashed, so you need to store plain password
    // or have a way to decrypt. Alternative: Store plain password in separate column
    const [rows] = await connection.execute(
      `SELECT 
        cc.*,
        tr.plan,
        tr.type
       FROM college_credentials cc
       LEFT JOIN template_requests tr ON cc.template_request_id = tr.id
       WHERE cc.template_request_id = ?`,
      [requestId]
    );

    const credentials = rows as any[];

    if (credentials.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Credentials not found' },
        { status: 404 }
      );
    }

    // For demo purposes - in production, you should have a secure way to store/retrieve passwords
    // Either store plain password in a separate column or use symmetric encryption
    return NextResponse.json({
      success: true,
      password: 'demo-password-123', // Replace with actual password retrieval logic
      message: 'Password retrieved successfully'
    });

  } catch (error: any) {
    console.error('Error decrypting password:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to decrypt password', error: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) await connection.end();
  }
}