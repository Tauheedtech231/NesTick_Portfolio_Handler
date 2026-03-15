import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import process from 'process';
/* eslint-disable */
// Your database configuration
const dbConfig = {
  host:process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  ssl: {
    rejectUnauthorized: false
  }
};

const pool = mysql.createPool(dbConfig);

// GET single college
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let connection;
  try {
    const { id } = await params;
    const collegeId = parseInt(id);
    if (isNaN(collegeId)) {
      return NextResponse.json(
        { error: 'Invalid college ID' },
        { status: 400 }
      );
    }
    
    connection = await pool.getConnection();
    
    const [rows] = await connection.execute(
      `SELECT c.*, t.name as template_name 
       FROM colleges c 
       LEFT JOIN templates t ON c.template_id = t.id 
       WHERE c.id = ?`,
      [collegeId]
    );
    
    const colleges = rows as any[];
    if (colleges.length === 0) {
      return NextResponse.json(
        { error: 'College not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(colleges[0]);
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch college',
        details: error.message 
      },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}

// PUT update college
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let connection;
  try {
    const { id } = await params;
    const collegeId = parseInt(id);
    if (isNaN(collegeId)) {
      return NextResponse.json(
        { error: 'Invalid college ID' },
        { status: 400 }
      );
    }
    
    const data = await request.json();
    
    // If updating email, validate it
    if (data.email && !/^\S+@\S+\.\S+$/.test(data.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // If updating website, validate format
    if (data.website && !/^https?:\/\/.+/.test(data.website)) {
      return NextResponse.json(
        { error: 'Invalid website URL' },
        { status: 400 }
      );
    }
    
    connection = await pool.getConnection();
    
    // Check if college exists
    const [existingRows] = await connection.execute(
      'SELECT id FROM colleges WHERE id = ?',
      [collegeId]
    );
    
    if ((existingRows as any[]).length === 0) {
      return NextResponse.json(
        { error: 'College not found' },
        { status: 404 }
      );
    }
    
    // Build dynamic update query
    const fields: string[] = [];
    const values: any[] = [];
    
    if (data.name !== undefined) {
      fields.push('name = ?');
      values.push(data.name.trim());
    }
    if (data.email !== undefined) {
      fields.push('email = ?');
      values.push(data.email.trim());
    }
    if (data.website !== undefined) {
      fields.push('website = ?');
      values.push(data.website?.trim() || null);
    }
    if (data.city !== undefined) {
      fields.push('city = ?');
      values.push(data.city?.trim() || null);
    }
    if (data.country !== undefined) {
      fields.push('country = ?');
      values.push(data.country?.trim() || null);
    }
    if (data.phone !== undefined) {
      fields.push('phone = ?');
      values.push(data.phone?.trim() || null);
    }
    if (data.template_id !== undefined) {
      fields.push('template_id = ?');
      values.push(data.template_id ? parseInt(data.template_id) : null);
    }
    if (data.is_active !== undefined) {
      fields.push('is_active = ?');
      values.push(data.is_active ? 1 : 0);
    }
    
    if (fields.length === 0) {
      return NextResponse.json(
        { error: 'No data provided for update' },
        { status: 400 }
      );
    }
    
    values.push(collegeId);
    
    const query = `UPDATE colleges SET ${fields.join(', ')} WHERE id = ?`;
    
    await connection.execute(query, values);
    
    // Get updated college
    const [updatedRows] = await connection.execute(
      `SELECT c.*, t.name as template_name 
       FROM colleges c 
       LEFT JOIN templates t ON c.template_id = t.id 
       WHERE c.id = ?`,
      [collegeId]
    );
    
    return NextResponse.json({
      message: 'College updated successfully',
      data: (updatedRows as any[])[0]
    });
  } catch (error: any) {
    console.error('Database error:', error);
    
    // Handle duplicate entry error
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { error: 'College with this email already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to update college',
        details: error.message 
      },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}

// DELETE college
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let connection;
  try {
    const { id } = await params;
    const collegeId = parseInt(id);
    if (isNaN(collegeId)) {
      return NextResponse.json(
        { error: 'Invalid college ID' },
        { status: 400 }
      );
    }
    
    connection = await pool.getConnection();
    
    // First check if college exists
    const [existingRows] = await connection.execute(
      'SELECT name FROM colleges WHERE id = ?',
      [collegeId]
    );
    
    if ((existingRows as any[]).length === 0) {
      return NextResponse.json(
        { error: 'College not found' },
        { status: 404 }
      );
    }
    
    // Delete the college
    await connection.execute('DELETE FROM colleges WHERE id = ?', [collegeId]);
    
    return NextResponse.json({ 
      message: 'College deleted successfully',
      deletedId: collegeId
    });
  } catch (error: any) {
    console.error('Database error:', error);
    
    // Handle foreign key constraint error
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return NextResponse.json(
        { error: 'Cannot delete college because it is referenced in other tables' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to delete college',
        details: error.message 
      },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}

// OPTIONS method for CORS
export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}