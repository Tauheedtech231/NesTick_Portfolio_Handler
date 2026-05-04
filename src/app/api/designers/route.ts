/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/designers/route.ts
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

// GET - Fetch designers
// GET - Fetch designers
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const email = searchParams.get('email');
    const status = searchParams.get('status');

    let query = `SELECT id, name, email, phone, company, specialization, experience, 
                        portfolio, cv_filename, cv_file, status, created_at FROM designers WHERE 1=1`;
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
    
    // Dynamically generate CV URL
    const processedRows = (rows as any[]).map(row => ({
      ...row,
      cv_url: row.cv_file ? `/api/designers/file?id=${row.id}` : null,
      cv_file: undefined // Remove file data from response
    }));
    
    return NextResponse.json({ 
      success: true, 
      data: processedRows,
      count: processedRows.length
    });
  } catch (error) {
    console.error('GET designers error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch designers' }, { status: 500 });
  }
}

// POST - Create new designer with direct database CV storage
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      id,
      name, 
      email, 
      password, 
      phone, 
      company, 
      specialization, 
      experience, 
      portfolio,
      cvFile,
      cvFileName
    } = body;

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json({ 
        success: false, 
        error: 'Name, email and password are required' 
      }, { status: 400 });
    }

    // Check if email already exists
    const [existing] = await pool.execute('SELECT id FROM designers WHERE email = ?', [email]);
    if ((existing as any[]).length > 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email already registered' 
      }, { status: 409 });
    }

    // Store CV directly in database (LONGTEXT column)
    let cvData = null;
    if (cvFile && cvFileName) {
      cvData = cvFile; // Already base64 string
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert designer with CV in database
    const [result] = await pool.execute(
      `INSERT INTO designers (
        name, email, password, phone, company, specialization, 
        experience, portfolio, cv_filename, cv_file, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        name, 
        email, 
        hashedPassword, 
        phone || null, 
        company || null, 
        specialization || null, 
        experience || null, 
        portfolio || null,
        cvFileName || null,
        cvData
      ]
    );

    const insertId = (result as any).insertId;

    // Get inserted record (without password and cv_file)
    const [newDesigner] = await pool.execute(
      `SELECT id, name, email, phone, company, specialization, experience, 
              portfolio, cv_filename, status, created_at FROM designers WHERE id = ?`,
      [insertId]
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Designer registered successfully. Waiting for approval.',
      data: (newDesigner as any[])[0]
    }, { status: 201 });

  } catch (error) {
    console.error('POST designer error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to register designer' 
    }, { status: 500 });
  }
}

// GET file endpoint - to retrieve CV file from database
export async function GET_FILE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const query = 'SELECT cv_file, cv_filename FROM designers WHERE id = ?';
    const [rows] = await pool.execute(query, [parseInt(id)]);
    const data = (rows as any[])[0];
    
    if (data && data.cv_file) {
      const fileName = data.cv_filename || 'cv_file';
      const base64Data = data.cv_file;
      // Extract mime type from base64
      const mimeMatch = base64Data.match(/^data:([^;]+);/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
      const base64Content = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;
      const buffer = Buffer.from(base64Content, 'base64');
      
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': mimeType,
          'Content-Disposition': `inline; filename="${fileName}"`,
        },
      });
    }

    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  } catch (error) {
    console.error('GET file error:', error);
    return NextResponse.json({ error: 'Failed to retrieve file' }, { status: 500 });
  }
}

// PUT - Update designer status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ 
        success: false, 
        error: 'ID and status are required' 
      }, { status: 400 });
    }

    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid status value' 
      }, { status: 400 });
    }

    await pool.execute(
      'UPDATE designers SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, id]
    );

    return NextResponse.json({ 
      success: true, 
      message: `Designer ${status} successfully` 
    });

  } catch (error) {
    console.error('PUT designer error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update designer' 
    }, { status: 500 });
  }
}

// DELETE - Remove designer
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'ID is required' 
      }, { status: 400 });
    }

    await pool.execute('DELETE FROM designers WHERE id = ?', [parseInt(id)]);

    return NextResponse.json({ 
      success: true, 
      message: 'Designer deleted successfully' 
    });

  } catch (error) {
    console.error('DELETE designer error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete designer' 
    }, { status: 500 });
  }
}