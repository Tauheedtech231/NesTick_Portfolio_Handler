/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/developer/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const developerId = searchParams.get('developerId');

    if (!developerId) {
      return NextResponse.json({ success: false, error: 'Developer ID required' }, { status: 401 });
    }

    const connection = await pool.getConnection();

    try {
      const [rows] = await connection.execute(
        `SELECT id, name, email, phone, company_name, specialization, experience, 
                skills, portfolio, bio, location, bank_account_details
         FROM developers 
         WHERE id = ?`,
        [developerId]
      );

      if ((rows as any[]).length === 0) {
        return NextResponse.json({ success: false, error: 'Developer not found' }, { status: 404 });
      }

      const developer = (rows as any[])[0];
      developer.skills = JSON.parse(developer.skills || '[]');

      return NextResponse.json({
        success: true,
        data: developer
      });

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, phone, company_name, specialization, experience, skills, portfolio, bio, location, bank_account_details, developerId } = body;
    const normalizedDeveloperId = developerId ? parseInt(developerId, 10) : null;

    if (!id || !normalizedDeveloperId || id !== normalizedDeveloperId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const connection = await pool.getConnection();

    try {
      await connection.execute(
        `UPDATE developers 
         SET name = ?, phone = ?, company_name = ?, specialization = ?, 
             experience = ?, skills = ?, portfolio = ?, bio = ?, 
             location = ?, bank_account_details = ?
         WHERE id = ?`,
        [
          name, phone || null, company_name || null, specialization,
          experience, JSON.stringify(skills || []), portfolio || null,
          bio || null, location || null, bank_account_details || null, id
        ]
      );

      return NextResponse.json({
        success: true,
        message: 'Profile updated successfully'
      });

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update profile' }, { status: 500 });
  }
}