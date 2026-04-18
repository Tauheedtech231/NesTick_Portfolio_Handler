/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/designer/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();

    try {
      // Check if designer exists
      const [rows] = await connection.execute(
        `SELECT id, name, email, password, phone, company, specialization, experience, 
                portfolio, avatar, bio, location, website, status, total_earnings, total_designs, created_at
         FROM designers WHERE email = ?`,
        [email]
      );

      const designers = rows as any[];
      
      if (designers.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      const designer = designers[0];

      // Check status
      if (designer.status !== 'approved') {
        return NextResponse.json(
          { success: false, error: 'Your account is pending approval. Please wait for admin approval.' },
          { status: 403 }
        );
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, designer.password);
      
      if (!isValidPassword) {
        return NextResponse.json(
          { success: false, error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      // Remove password from response
      const { password: _, ...designerWithoutPassword } = designer;

      // Generate simple session token (not JWT)
      const sessionToken = Buffer.from(`${designer.id}:${Date.now()}`).toString('base64');

      return NextResponse.json({
        success: true,
        message: 'Login successful',
        token: sessionToken,
        user: designerWithoutPassword
      });

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}