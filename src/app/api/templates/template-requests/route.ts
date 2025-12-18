import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Database configuration
const dbConfig = {
  host: "72.61.117.188",
  user: "portfolio_user",
  password: "StrongPass123!",
  database: "portfolio_handler_db",
};

export async function POST(request: NextRequest) {
  let connection;
  
  try {
    const body = await request.json();
    const { 
      template_id, 
      name, 
      college, 
      email, 
      phone, 
      plan = 'basic', 
      type 
    } = body;
   

    // Validation
    const errors: string[] = [];

    if (!template_id || isNaN(parseInt(template_id))) {
      errors.push("Valid template ID is required");
    }

    if (!name?.trim()) {
      errors.push("Name is required");
    }

    if (!college?.trim()) {
      errors.push("College name is required");
    }

    if (!email?.trim()) {
      errors.push("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push("Valid email is required");
    }

    if (!phone?.trim()) {
      errors.push("Phone number is required");
    } else if (!/^[\+]?[0-9\s\-\(\)]{10,20}$/.test(phone)) {
      errors.push("Valid phone number is required");
    }

    if (!type || !['free', 'paid'].includes(type)) {
      errors.push("Valid type (free or paid) is required");
    }

    // Validate plan based on type
    const validPlans = ['basic', 'professional', 'enterprise'];
    if (type === 'paid' && (!plan || !validPlans.includes(plan))) {
      errors.push("Valid plan (basic, professional, or enterprise) is required for paid templates");
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Validation failed", 
          errors 
        },
        { status: 400 }
      );
    }

    // Connect to database
    connection = await mysql.createConnection(dbConfig);

    // Check if template exists
    const [templates] = await connection.execute(
      'SELECT id, type FROM templates WHERE id = ?',
      [template_id]
    );

    const templateArray = templates as any[];

    if (templateArray.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Template not found" 
        },
        { status: 404 }
      );
    }

    // Verify template type matches
    const template = templateArray[0];
    if (template.type !== type) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Template type mismatch. This template is ${template.type}` 
        },
        { status: 400 }
      );
    }

    // Insert request into database
    const [result] = await connection.execute(
      `INSERT INTO template_requests 
       (template_id, name, college, email, phone, plan, type, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        template_id,
        name.trim(),
        college.trim(),
        email.toLowerCase().trim(),
        phone.trim(),
        type === 'paid' ? plan : null, // Only store plan for paid templates
        type
      ]
    );

    const insertResult = result as any;

    return NextResponse.json({
      success: true,
      message: "Template request submitted successfully",
      requestId: insertResult.insertId,
      data: {
        id: insertResult.insertId,
        template_id,
        name: name.trim(),
        college: college.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        plan: type === 'paid' ? plan : null,
        type,
        status: 'pending'
      }
    });

  } catch (error: any) {
    console.error('Template request submission error:', error);
    
    // Handle duplicate requests (same email for same template)
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { 
          success: false, 
          message: "You have already submitted a request for this template" 
        },
        { status: 409 }
      );
    }

    // Handle foreign key constraint (template doesn't exist)
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return NextResponse.json(
        { 
          success: false, 
          message: "Template not found" 
        },
        { status: 404 }
      );
    }

    // Handle database connection errors
    if (error.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { 
          success: false, 
          message: "Database connection failed. Please try again later." 
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to submit template request",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  } finally {
    // Close connection if it exists
    if (connection) {
      await connection.end();
    }
  }
}

// GET method to fetch template requests (for admin panel)
export async function GET(request: NextRequest) {
  let connection;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // pending / approved / rejected
    const type = searchParams.get('type');     // free / paid

    // Connect to DB
    connection = await mysql.createConnection(dbConfig);

    // Base query
    let query = `
      SELECT tr.*, t.name AS template_name, t.type AS template_type
      FROM template_requests tr
      LEFT JOIN templates t ON tr.template_id = t.id
    `;

    // Dynamic WHERE conditions
    const conditions: string[] = [];
    const params: any[] = [];

    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      conditions.push('tr.status = ?');
      params.push(status);
    }

    if (type && ['free', 'paid'].includes(type)) {
      conditions.push('t.type = ?');
      params.push(type);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    // Correct column for ordering
    query += ' ORDER BY tr.submitted_at DESC';

    const [rows] = await connection.execute(query, params);

    // Format data for CollegeTable
    const formatted = (rows as any[]).map(r => ({
      id: r.id.toString(),
      name: r.name,
      representativeName: r.college,
      email: r.email,
      phone: r.phone,
      status: r.status,
      plan: r.plan,
      templateName: r.template_name,
      type: r.template_type,
      createdAt: r.submitted_at,
      updatedAt: r.submitted_at,
    }));

    return NextResponse.json({
      success: true,
      requests: formatted,
      count: formatted.length
    });

  } catch (error: any) {
    console.error('Fetch template requests error:', error);

    if (error.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { success: false, message: "Database connection failed" },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to fetch template requests" },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
