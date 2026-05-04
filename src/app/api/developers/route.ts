/* eslint-disable @typescript-eslint/no-explicit-any */
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

// ============================================
// POST - Register New Developer
// ============================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name, email, password, phone, companyName, specialization,
      experience, skills, portfolio, cvFile, cvFileName, bio, location, bankAccountDetails
    } = body;

    // Validation
    if (!name || !email || !password || !phone || !specialization || !experience) {
      return NextResponse.json(
        { success: false, error: 'Required fields missing' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const [existing] = await pool.execute('SELECT id FROM developers WHERE email = ?', [email]);
    if ((existing as any[]).length > 0) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.execute(
      `INSERT INTO developers (
        name, email, password, phone, company_name, specialization,
        experience, skills, portfolio, cv_file, cv_filename, bio, location, bank_account_details, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        name, email, hashedPassword, phone, companyName || null,
        specialization, experience, skills ? JSON.stringify(skills) : null,
        portfolio || null, cvFile || null, cvFileName || null,
        bio || null, location || null, bankAccountDetails || null
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Developer registered successfully',
      developerId: (result as any).insertId
    });

  } catch (error) {
    console.error('Developer registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Registration failed' },
      { status: 500 }
    );
  }
}

// ============================================
// GET - Fetch Developers (with CV file for download)
// ============================================
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const email = searchParams.get('email');
    const status = searchParams.get('status');

    // Include cv_file and cv_url for CV download functionality
    let query = `SELECT id, name, email, phone, company_name, specialization, experience,
                        skills, portfolio, cv_filename, cv_file, cv_url, bio, location, 
                        bank_account_details, status, created_at
                 FROM developers WHERE 1=1`;
    const params: any[] = [];

    if (id) { 
      query += ' AND id = ?'; 
      params.push(parseInt(id)); 
    }
    if (email) { 
      query += ' AND email = ?'; 
      params.push(email); 
    }
    if (status) { 
      query += ' AND status = ?'; 
      params.push(status); 
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.execute(query, params);
    
    // Return complete data including cv_file for download
    return NextResponse.json({ 
      success: true, 
      data: rows,
      count: (rows as any[]).length
    });

  } catch (error) {
    console.error('GET developers error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch developers' }, 
      { status: 500 }
    );
  }
}

// ============================================
// PUT - Update Developer Status (Approve/Reject)
// ============================================
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'ID and status are required' },
        { status: 400 }
      );
    }

    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Check if developer exists
    const [existing] = await pool.execute('SELECT id, email, name FROM developers WHERE id = ?', [id]);
    if ((existing as any[]).length === 0) {
      return NextResponse.json(
        { success: false, error: 'Developer not found' },
        { status: 404 }
      );
    }

    const developer = (existing as any[])[0];

    // Update status
    await pool.execute(
      'UPDATE developers SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, id]
    );

    return NextResponse.json({
      success: true,
      message: `Developer ${status} successfully`,
      developer: {
        id: developer.id,
        email: developer.email,
        name: developer.name,
        status: status
      }
    });

  } catch (error) {
    console.error('PUT developer error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update developer status' },
      { status: 500 }
    );
  }
}

// ============================================
// DELETE - Remove Developer
// ============================================
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }

    // Check if developer exists
    const [existing] = await pool.execute('SELECT id FROM developers WHERE id = ?', [id]);
    if ((existing as any[]).length === 0) {
      return NextResponse.json(
        { success: false, error: 'Developer not found' },
        { status: 404 }
      );
    }

    await pool.execute('DELETE FROM developers WHERE id = ?', [parseInt(id)]);

    return NextResponse.json({
      success: true,
      message: 'Developer deleted successfully'
    });

  } catch (error) {
    console.error('DELETE developer error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete developer' },
      { status: 500 }
    );
  }
}