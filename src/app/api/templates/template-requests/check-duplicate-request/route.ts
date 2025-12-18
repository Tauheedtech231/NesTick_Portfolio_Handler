import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
/* eslint-disable */

const dbConfig = {
  host: "72.61.117.188",
  user: "portfolio_user",
  password: "StrongPass123!",
  database: "portfolio_handler_db",
};

export async function GET(request: NextRequest) {
  let connection;
  
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const template_id = searchParams.get('template_id');

    if (!email || !template_id) {
      return NextResponse.json(
        { success: false, message: "Email and template ID are required" },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Check for existing request
    const [requests] = await connection.execute(
      'SELECT id FROM template_requests WHERE email = ? AND template_id = ? AND type = "free"',
      [email.toLowerCase(), template_id]
    );

    const requestArray = requests as any[];

    return NextResponse.json({
      success: true,
      duplicate: requestArray.length > 0,
      count: requestArray.length
    });

  } catch (error: any) {
    console.error('Check duplicate error:', error);
    
    return NextResponse.json(
      { success: false, message: "Failed to check duplicate request" },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}