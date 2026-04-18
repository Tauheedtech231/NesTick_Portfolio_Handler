/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/partners/route.ts
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

// GET - Fetch partners
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const email = searchParams.get('email');
    const status = searchParams.get('status');

    let query = 'SELECT id, organization_name, contact_person, email, phone, organization_type, country, message, status, created_at FROM partners WHERE 1=1';
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
    console.error('GET partners error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch partners' }, { status: 500 });
  }
}

// POST - Create new partner
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { organization_name, contact_person, email, phone, organization_type, country, message } = body;

    // Validation
    if (!organization_name || !contact_person || !email) {
      return NextResponse.json({ success: false, error: 'Organization name, contact person and email are required' }, { status: 400 });
    }

    // Check if email already exists
    const [existing] = await pool.execute('SELECT id FROM partners WHERE email = ?', [email]);
    if ((existing as any[]).length > 0) {
      return NextResponse.json({ success: false, error: 'Email already registered' }, { status: 409 });
    }

    // Insert partner
    const [result] = await pool.execute(
      `INSERT INTO partners (organization_name, contact_person, email, phone, organization_type, country, message, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [organization_name, contact_person, email, phone || null, organization_type || null, country || null, message || null]
    );

    const insertId = (result as any).insertId;

    // Get inserted record
    const [newPartner] = await pool.execute(
      'SELECT id, organization_name, contact_person, email, phone, organization_type, country, message, status, created_at FROM partners WHERE id = ?',
      [insertId]
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Partner application submitted successfully. Waiting for review.',
      data: (newPartner as any[])[0]
    }, { status: 201 });

  } catch (error) {
    console.error('POST partner error:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit partner application' }, { status: 500 });
  }
}

// PUT - Update partner status (review/approve/reject)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'ID and status are required' }, { status: 400 });
    }

    await pool.execute(
      'UPDATE partners SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, id]
    );

    return NextResponse.json({ 
      success: true, 
      message: `Partner ${status} successfully` 
    });

  } catch (error) {
    console.error('PUT partner error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update partner' }, { status: 500 });
  }
}