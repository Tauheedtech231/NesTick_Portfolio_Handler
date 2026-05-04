/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/developers/login/route.ts
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

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();

    try {
      // Check in developers table
      const [rows] = await connection.execute(
        'SELECT id, name, email, password, specialization, experience, status FROM developers WHERE email = ?',
        [email.toLowerCase().trim()]
      );

      const developers = rows as any[];

      if (developers.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      const developer = developers[0];

      // Check status
      if (developer.status !== 'approved') {
        return NextResponse.json(
          { success: false, error: 'Your account is pending approval. Please wait for admin approval.' },
          { status: 403 }
        );
      }

      // Verify password
      const isValid = await bcrypt.compare(password, developer.password);

      if (!isValid) {
        return NextResponse.json(
          { success: false, error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      // Return user data (excluding password)
      return NextResponse.json({
        success: true,
        user: {
          id: developer.id,
          name: developer.name,
          email: developer.email,
          specialization: developer.specialization,
          experience: developer.experience,
          type: 'developer'
        }
      });

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Developer login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}