/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/designer/profile/route.ts
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

// GET - Fetch designer profile
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const designerId = searchParams.get('designerId');

    if (!designerId) {
      return NextResponse.json(
        { success: false, error: 'Designer ID required' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();

    try {
      const [rows] = await connection.execute(
        `SELECT id, name, email, phone, company, location, website, bio, 
                specialization, experience, avatar, total_earnings, total_designs, created_at
         FROM designers WHERE id = ?`,
        [designerId]
      );

      const designers = rows as any[];
      
      if (designers.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Designer not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        profile: designers[0]
      });

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Fetch profile error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// PUT - Update designer profile
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { designerId, name, phone, company, location, website, bio, specialization, experience, avatar } = body;

    if (!designerId) {
      return NextResponse.json(
        { success: false, error: 'Designer ID required' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();

    try {
      let query = 'UPDATE designers SET updated_at = NOW()';
      const params: any[] = [];

      if (name !== undefined) {
        query += ', name = ?';
        params.push(name);
      }
      if (phone !== undefined) {
        query += ', phone = ?';
        params.push(phone);
      }
      if (company !== undefined) {
        query += ', company = ?';
        params.push(company);
      }
      if (location !== undefined) {
        query += ', location = ?';
        params.push(location);
      }
      if (website !== undefined) {
        query += ', website = ?';
        params.push(website);
      }
      if (bio !== undefined) {
        query += ', bio = ?';
        params.push(bio);
      }
      if (specialization !== undefined) {
        query += ', specialization = ?';
        params.push(specialization);
      }
      if (experience !== undefined) {
        query += ', experience = ?';
        params.push(experience);
      }
      if (avatar !== undefined) {
        query += ', avatar = ?';
        params.push(avatar);
      }

      query += ' WHERE id = ?';
      params.push(designerId);

      await connection.execute(query, params);

      return NextResponse.json({
        success: true,
        message: 'Profile updated successfully'
      });

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}