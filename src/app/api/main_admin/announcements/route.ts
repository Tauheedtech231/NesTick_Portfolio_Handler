// app/api/announcements/route.ts - FIXED VERSION
import { getConnection } from '@/app/lib/db';
import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
/* eslint-disable */

interface PostBody {
  title: string;
  message: string;
  college_id?: number | null;
}

// POST: Create a new announcement
export async function POST(request: Request) {
  try {
    const body: PostBody = await request.json();
    const { title, message, college_id } = body;

    // Validate required fields
    if (!title || !title.trim()) {
      return NextResponse.json({ success: false, message: 'Title is required' }, { status: 400 });
    }

    if (!message || !message.trim()) {
      return NextResponse.json({ success: false, message: 'Message is required' }, { status: 400 });
    }

    if (title.length > 255) {
      return NextResponse.json({ success: false, message: 'Title must be 255 characters or less' }, { status: 400 });
    }

    const pool = getConnection();

    // Insert new announcement
    const [result] = await pool.execute<mysql.ResultSetHeader>(
      `INSERT INTO announcements 
       (title, message, college_id, created_at, updated_at)
       VALUES (?, ?, ?, NOW(), NOW())`,
      [title.trim(), message.trim(), college_id || null]
    );

    // Fetch the newly created announcement
    const [newAnnouncement] = await pool.execute<mysql.RowDataPacket[]>(
      'SELECT * FROM announcements WHERE id = ?',
      [(result as mysql.ResultSetHeader).insertId]
    );

    return NextResponse.json({
      success: true,
      message: 'Announcement created successfully',
      data: newAnnouncement[0],
    }, { status: 201 });

  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create announcement',
      error: error?.message || 'Unknown error',
    }, { status: 500 });
  }
}

// ✅ FIXED GET: Fetch announcements with proper parameterized query
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const collegeIdStr = searchParams.get('college_id');

    const pool = await getConnection();

    let query = `
      SELECT a.*, c.name AS college_name
      FROM announcements a
      LEFT JOIN colleges c ON a.college_id = c.id
    `;
    
    const params: any[] = [];

    // ✅ Fix: Parameterized query use karo, direct concatenation nahi
    if (collegeIdStr) {
      const college_id = parseInt(collegeIdStr, 10);
      
      // Check if valid number
      if (!isNaN(college_id)) {
        query += ` WHERE a.college_id = ? OR a.college_id IS NULL`;
        params.push(college_id);
      } else {
        // Agar invalid number hai to sirf global announcements
        query += ` WHERE a.college_id IS NULL`;
      }
    }

    query += ' ORDER BY a.created_at DESC';

    // ✅ Use params array for safe execution
    const [announcements] = await pool.execute<mysql.RowDataPacket[]>(query, params);

    return NextResponse.json({
      success: true,
      data: announcements
    });

  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch announcements',
      error: error?.message || 'Unknown error',
    }, { status: 500 });
  }
}