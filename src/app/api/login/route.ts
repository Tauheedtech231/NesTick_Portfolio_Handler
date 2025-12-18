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
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Connect to database
    connection = await mysql.createConnection(dbConfig);

    // Check if user exists
    const [users] = await connection.execute(
      'SELECT id, full_name, email, password, country, is_verified FROM users WHERE email = ?',
      [email.toLowerCase()]
    );

    const userArray = users as any[];

    if (userArray.length === 0) {
      return NextResponse.json(
        { success: false, message: "No account found with this email" },
        { status: 404 }
      );
    }

    const user = userArray[0];

    // Check if user is verified
    if (!user.is_verified) {
      return NextResponse.json(
        { success: false, message: "Please verify your email before logging in" },
        { status: 401 }
      );
    }

    // Verify password (plain text comparison - assuming passwords are stored in plain text for now)
    // If you want to hash passwords, use bcrypt.compare
    if (user.password !== password) {
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 401 }
      );
    }

    // Login successful
    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        country: user.country
      }
    });

  } catch (error: any) {
    console.error('Login error:', error);
    
    // Handle specific database connection errors
    if (error.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { success: false, message: "Database connection failed. Please try again later." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    // Close connection if it exists
    if (connection) {
      await connection.end();
    }
  }
}