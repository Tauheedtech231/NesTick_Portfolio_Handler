// app/api/announcements/[id]/route.ts
import { getConnection } from '@/lib/db'; 
import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
/* eslint-disable */

interface Params {
  id: string;
}

interface PatchBody {
  title?: string;
  message?: string;
  college_id?: number | null;
}

// TypeScript type for the context parameter
interface Context {
  params: Promise<Params>;
}

// GET: Fetch single announcement by ID
export async function GET(
  request: Request,
  context: Context
) {
  try {
    // ✅ Await the params promise first
    const { id } = await context.params;
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: 'Announcement ID is required' 
      }, { status: 400 });
    }

    const pool = await getConnection();
    const [announcements] = await (await pool).execute<mysql.RowDataPacket[]>(
      `SELECT a.*, c.name AS college_name
       FROM announcements a
       LEFT JOIN colleges c ON a.college_id = c.id
       WHERE a.id = ?`,
      [id]
    );

    if (announcements.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'Announcement not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      data: announcements[0] 
    });
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch announcement', 
      error: error?.message || 'Unknown error' 
    }, { status: 500 });
  }
}

// PATCH: Update announcement by ID
export async function PATCH(
  request: Request,
  context: Context
) {
  try {
    // ✅ Await the params promise first
    const { id } = await context.params;
    const body: PatchBody = await request.json();
    const { title, message, college_id } = body;

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: 'Announcement ID is required' 
      }, { status: 400 });
    }

    if (!title && !message && college_id === undefined) {
      return NextResponse.json({ 
        success: false, 
        message: 'No fields to update' 
      }, { status: 400 });
    }

    if (title && title.length > 255) {
      return NextResponse.json({ 
        success: false, 
        message: 'Title must be 255 characters or less' 
      }, { status: 400 });
    }

    const pool = await getConnection();

    // Check if announcement exists
    const [existingAnnouncement] = await pool.execute<mysql.RowDataPacket[]>(
      'SELECT * FROM announcements WHERE id = ?',
      [id]
    );

    if (existingAnnouncement.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'Announcement not found' 
      }, { status: 404 });
    }

    // Build dynamic update query
    const updates: string[] = [];
    const values: Array<string | number | null> = [];

    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title.trim());
    }
    if (message !== undefined) {
      updates.push('message = ?');
      values.push(message.trim());
    }
    if (college_id !== undefined) {
      updates.push('college_id = ?');
      values.push(college_id || null);
    }

    updates.push('updated_at = NOW()');
    values.push(id); // id goes last for WHERE clause

    const [result] = await pool.execute<mysql.ResultSetHeader>(
      `UPDATE announcements SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to update announcement' 
      }, { status: 500 });
    }

    // Fetch updated announcement
    const [updatedAnnouncement] = await pool.execute<mysql.RowDataPacket[]>(
      `SELECT a.*, c.name AS college_name
       FROM announcements a
       LEFT JOIN colleges c ON a.college_id = c.id
       WHERE a.id = ?`,
      [id]
    );

    return NextResponse.json({
      success: true,
      message: 'Announcement updated successfully',
      data: updatedAnnouncement[0],
    });
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to update announcement', 
      error: error?.message || 'Unknown error' 
    }, { status: 500 });
  }
}

// DELETE: Delete announcement by ID
export async function DELETE(
  request: Request,
  context: Context
) {
  try {
    // ✅ Await the params promise first
    const { id } = await context.params;
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: 'Announcement ID is required' 
      }, { status: 400 });
    }

    const pool = await getConnection();

    // Check if announcement exists
    const [existingAnnouncement] = await pool.execute<mysql.RowDataPacket[]>(
      'SELECT * FROM announcements WHERE id = ?',
      [id]
    );

    if (existingAnnouncement.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'Announcement not found' 
      }, { status: 404 });
    }

    // Delete announcement
    await pool.execute('DELETE FROM announcements WHERE id = ?', [id]);

    return NextResponse.json({ 
      success: true, 
      message: 'Announcement deleted successfully' 
    });
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to delete announcement', 
      error: error?.message || 'Unknown error' 
    }, { status: 500 });
  }
}