import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
/* eslint-disable */

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export async function POST(request: NextRequest) {
  let connection;
  
  try {
    const body = await request.json() as {
      template_id: string;
      name: string;
      college: string;
      email: string;
      phone: string;
      designation?: string;
      student_count?: string;
      plan?: string;
      type: string;
      requirements?: string;
      timeline?: string;
      hear_about?: string;
    };
    
    const { 
      template_id, 
      name, 
      college, 
      email, 
      phone, 
      designation = '',
      student_count = '',
      plan = 'Most Featured', 
      type,
      requirements = '',
      timeline = '',
      hear_about = ''
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

    if (!designation?.trim()) {
      errors.push("Designation is required");
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
    const validPlans = ['Basic', 'Most Featured', 'Premium'];
    if (type === 'paid' && (!plan || !validPlans.includes(plan))) {
      errors.push("Valid plan (Basic, Most Featured, or Premium) is required for paid templates");
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

    const templateArray = templates as unknown[];

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
    const template = templateArray[0] as { type: string };
    if (template.type !== type) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Template type mismatch. This template is ${template.type}` 
        },
        { status: 400 }
      );
    }

    // Check for duplicate request
    const [existingRequests] = await connection.execute(
      'SELECT id FROM template_requests WHERE template_id = ? AND email = ?',
      [template_id, email.toLowerCase().trim()]
    );

    if ((existingRequests as unknown[]).length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: "You have already submitted a request for this template with this email" 
        },
        { status: 409 }
      );
    }

    // Insert request into database with new fields
    const [result] = await connection.execute(
      `INSERT INTO template_requests 
       (template_id, name, college, email, phone, designation, student_count, plan, type, requirements, timeline, hear_about, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        template_id,
        name.trim(),
        college.trim(),
        email.toLowerCase().trim(),
        phone.trim(),
        designation.trim() || null,
        student_count || null,
        type === 'paid' ? plan : null,
        type,
        requirements.trim() || null,
        timeline || null,
        hear_about || null
      ]
    );

    const insertResult = result as { insertId: number };

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
        designation: designation.trim() || null,
        student_count: student_count || null,
        plan: type === 'paid' ? plan : null,
        type,
        requirements: requirements.trim() || null,
        timeline: timeline || null,
        hear_about: hear_about || null,
        status: 'pending'
      }
    });

  } catch (error: unknown) {
    console.error('Template request submission error:', error);
    
    // Handle duplicate requests (same email for same template)
    if (error instanceof Error && 'code' in error && error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { 
          success: false, 
          message: "You have already submitted a request for this template" 
        },
        { status: 409 }
      );
    }

    // Handle foreign key constraint (template doesn't exist)
    if (error instanceof Error && 'code' in error && error.code === 'ER_NO_REFERENCED_ROW_2') {
      return NextResponse.json(
        { 
          success: false, 
          message: "Template not found" 
        },
        { status: 404 }
      );
    }

    // Handle database connection errors
    if (error instanceof Error && 'code' in error && error.code === 'ECONNREFUSED') {
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
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
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

    // Base query with new fields
    let query = `
      SELECT tr.*, t.name AS template_name, t.type AS template_type
      FROM template_requests tr
      LEFT JOIN templates t ON tr.template_id = t.id
    `;

    // Dynamic WHERE conditions
    const conditions: string[] = [];
    const params: unknown[] = [];

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

    query += ' ORDER BY tr.submitted_at DESC';

    const [rows] = await connection.execute(query, params);

    // Format data for CollegeTable with new fields
    const formatted = (rows as Array<Record<string, unknown>>).map(r => ({
      id: (r.id as number).toString(),
      name: r.name as string,
      representativeName: r.college as string,
      email: r.email as string,
      phone: r.phone as string,
      designation: r.designation as string || null,
      studentCount: r.student_count as string || null,
      status: r.status as string,
      plan: r.plan as string || null,
      templateName: r.template_name as string,
      type: r.template_type as string,
      requirements: r.requirements as string || null,
      timeline: r.timeline as string || null,
      hearAbout: r.hear_about as string || null,
      createdAt: r.submitted_at as string,
      updatedAt: r.submitted_at,
    }));

    return NextResponse.json({
      success: true,
      requests: formatted,
      count: formatted.length
    });

  } catch (error: unknown) {
    console.error('Fetch template requests error:', error);

    if (error instanceof Error && 'code' in error && error.code === 'ECONNREFUSED') {
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

// PUT method to update template request status (for admin panel)
export async function PUT(request: NextRequest) {
  let connection;

  try {
    const body = await request.json() as {
      id: string;
      status: string;
    };
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, message: "ID and status are required" },
        { status: 400 }
      );
    }

    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status value" },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    const [result] = await connection.execute(
      'UPDATE template_requests SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, id]
    );

    const updateResult = result as { affectedRows: number };

    if (updateResult.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Template request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Template request ${status} successfully`
    });

  } catch (error: unknown) {
    console.error('Update template request error:', error);
    return NextResponse.json(
      { success: false, message: "Failed to update template request" },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}