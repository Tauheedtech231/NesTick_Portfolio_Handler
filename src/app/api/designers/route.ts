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
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const email = searchParams.get('email');
    const status = searchParams.get('status');

    let query = 'SELECT id, name, email, phone, company, specialization, experience, portfolio, status, created_at FROM designers WHERE 1=1';
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
    
    return NextResponse.json({ 
      success: true, 
      data: rows,
      count: (rows as any[]).length
    });
  } catch (error) {
    console.error('GET designers error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch designers' }, { status: 500 });
  }
}

// POST - Create new designer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, phone, company, specialization, experience, portfolio } = body;

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: 'Name, email and password are required' }, { status: 400 });
    }

    // Check if email already exists
    const [existing] = await pool.execute('SELECT id FROM designers WHERE email = ?', [email]);
    if ((existing as any[]).length > 0) {
      return NextResponse.json({ success: false, error: 'Email already registered' }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert designer
    const [result] = await pool.execute(
      `INSERT INTO designers (name, email, password, phone, company, specialization, experience, portfolio, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [name, email, hashedPassword, phone || null, company || null, specialization || null, experience || null, portfolio || null]
    );

    const insertId = (result as any).insertId;

    // Get inserted record (without password)
    const [newDesigner] = await pool.execute(
      'SELECT id, name, email, phone, company, specialization, experience, portfolio, status, created_at FROM designers WHERE id = ?',
      [insertId]
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Designer registered successfully. Waiting for approval.',
      data: (newDesigner as any[])[0]
    }, { status: 201 });

  } catch (error) {
    console.error('POST designer error:', error);
    return NextResponse.json({ success: false, error: 'Failed to register designer' }, { status: 500 });
  }
}

// PUT - Update designer status (approve/reject)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'ID and status are required' }, { status: 400 });
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
    return NextResponse.json({ success: false, error: 'Failed to update designer' }, { status: 500 });
  }
}