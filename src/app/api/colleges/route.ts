import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Your database configuration
const dbConfig = {
  host: "72.61.117.188",
  user: "portfolio_user",
  password: "StrongPass123!",
  database: "portfolio_handler_db",
  waitForConnections: true,
  connectionLimit: 10,
  // Add SSL configuration if required
  ssl: {
    rejectUnauthorized: false // Set to true in production with proper certificates
  }
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Helper function to validate college data
function validateCollegeData(data: any) {
  const errors: string[] = [];
  
  if (!data.name || data.name.trim() === '') {
    errors.push('College name is required');
  }
  
  if (!data.email || data.email.trim() === '') {
    errors.push('Email is required');
  } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.push('Invalid email format');
  }
  
  if (data.website && !/^https?:\/\/.+/.test(data.website)) {
    errors.push('Invalid website URL (must start with http:// or https://)');
  }
  
  return errors;
}

// GET all colleges
export async function GET(request: NextRequest) {
  let connection;
  try {
    connection = await pool.getConnection();
    
    const search = request.nextUrl.searchParams.get('search');
    const status = request.nextUrl.searchParams.get('status');
    
    let query = `
      SELECT 
        c.*,
        t.name as template_name
      FROM colleges c
      LEFT JOIN templates t ON c.template_id = t.id
    `;
    const conditions: string[] = [];
    const params: any[] = [];
    
    if (search) {
      conditions.push('(c.name LIKE ? OR c.email LIKE ? OR c.city LIKE ? OR c.country LIKE ? OR c.phone LIKE ?)');
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
    }
    
    if (status && status !== 'all') {
      conditions.push('c.is_active = ?');
      params.push(status === 'active' ? 1 : 0);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY c.created_at DESC';
    
    const [rows] = await connection.execute(query, params);
    
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch colleges',
        details: error.message 
      },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}

// POST create new college
export async function POST(request: NextRequest) {
  let connection;
  try {
    const data = await request.json();
    
    // Validate data
    const validationErrors = validateCollegeData(data);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }
    
    connection = await pool.getConnection();
    
    const query = `
      INSERT INTO colleges (name, email, website, city, country, phone, template_id, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      data.name.trim(),
      data.email.trim(),
      data.website?.trim() || null,
      data.city?.trim() || null,
      data.country?.trim() || null,
      data.phone?.trim() || null,
      data.template_id ? parseInt(data.template_id) : null,
      data.is_active !== undefined ? (data.is_active ? 1 : 0) : 1
    ];
    
    const [result] = await connection.execute(query, values);
    const insertId = (result as any).insertId;
    
    // Get the created college with template name
    const [createdCollege] = await connection.execute(
      `SELECT c.*, t.name as template_name 
       FROM colleges c 
       LEFT JOIN templates t ON c.template_id = t.id 
       WHERE c.id = ?`,
      [insertId]
    );
    
    return NextResponse.json(
      { 
        message: 'College created successfully',
        data: (createdCollege as any[])[0]
      },
      { status: 201 }
    );
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
        error: 'Failed to create college',
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