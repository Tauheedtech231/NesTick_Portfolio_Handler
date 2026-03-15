import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
/* eslint-disable */

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  ssl: {
    rejectUnauthorized: false
  }
};

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const generateRandomPassword = (length: number = 12): string => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

export async function POST(request: NextRequest) {
  let connection;
  
  try {
    // ✅ Parse request body
    const body = await request.json();
    console.log('Full request body:', body); // Debug line
    
    // ✅ Handle both possible formats
    let templateRequestId, requestData, resend = false;
    
    if (body.templateRequestId && body.requestData) {
      // Format 1: Nested object (from credentials-manage page)
      templateRequestId = body.templateRequestId;
      requestData = body.requestData;
      resend = body.resend || false;
    } else if (body.templateRequestId && body.collegeId) {
      // Format 2: Flat structure (from somewhere else)
      templateRequestId = body.templateRequestId;
      requestData = {
        template_id: body.template_id,
        college: body.college,
        email: body.email,
        name: body.name,
        phone: body.phone,
        plan: body.plan,
        type: body.type
      };
      resend = body.resend || false;
    } else {
      // Format 3: Direct values (fallback)
      templateRequestId = body.templateRequestId;
      requestData = {
        template_id: body.template_id || body.templateId,
        college: body.college || body.collegeName,
        email: body.email,
        name: body.name || body.requesterName,
        phone: body.phone,
        plan: body.plan || 'basic',
        type: body.type || 'free'
      };
      resend = body.resend || false;
    }
    
    console.log('Processed data:', { templateRequestId, requestData, resend });

    // ✅ Validation
    if (!templateRequestId) {
      return NextResponse.json(
        { success: false, message: 'Template Request ID is required.' },
        { status: 400 }
      );
    }

    if (!requestData) {
      return NextResponse.json(
        { success: false, message: 'Request data is required.' },
        { status: 400 }
      );
    }

    // ✅ Check for email in various possible fields
    const email = requestData.email || requestData.college_email || requestData.requester_email;
    
    if (!email) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'College email is required.',
          receivedData: requestData // Debug info
        },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);
    await connection.beginTransaction();

    // Find college by email
    const [collegeRows] = await connection.execute(
      `SELECT * FROM colleges WHERE email = ?`,
      [email]
    );
    const colleges = collegeRows as any[];
    
    let college;
    let collegeId;
    
    if (colleges.length === 0) {
      // ✅ College nahi mila to create karo
      console.log('College not found, creating new college record...');
      
      const collegeName = requestData.college || requestData.college_name || 'Unknown College';
      
      const [insertResult] = await connection.execute(
        `INSERT INTO colleges (name, email, phone, is_active) VALUES (?, ?, ?, 1)`,
        [
          collegeName,
          email,
          requestData.phone || null
        ]
      );
      
      collegeId = (insertResult as any).insertId;
      college = {
        id: collegeId,
        name: collegeName,
        email: email
      };
      
      console.log('New college created with ID:', collegeId);
    } else {
      college = colleges[0];
      collegeId = college.id;
      console.log('Existing college found with ID:', collegeId);
    }

    // Fetch template request
    const [templateRows] = await connection.execute(
      `SELECT * FROM template_requests WHERE id = ?`,
      [templateRequestId]
    );
    const templates = templateRows as any[];
    
    if (templates.length === 0) {
      await connection.rollback();
      return NextResponse.json(
        { success: false, message: 'Template request not found.' },
        { status: 404 }
      );
    }
    
    const templateRequest = templates[0];

    // Check existing credentials
    const [existingCreds] = await connection.execute(
      `SELECT id FROM college_credentials WHERE college_id = ? AND template_request_id = ?`,
      [collegeId, templateRequestId]
    );
    const existingCredsArray = existingCreds as any[];

    if (existingCredsArray.length > 0 && !resend) {
      await connection.rollback();
      return NextResponse.json(
        { 
          success: false, 
          message: 'Credentials already sent for this request.',
          data: {
            collegeId,
            templateRequestId
          }
        },
        { status: 409 }
      );
    }

    // Generate password & hash
    const plainPassword = generateRandomPassword();
    const passwordHash = await bcrypt.hash(plainPassword, 10);

    if (existingCredsArray.length > 0) {
      await connection.execute(
        `UPDATE college_credentials 
         SET password_hash = ?, sent_at = NOW() 
         WHERE college_id = ? AND template_request_id = ?`,
        [passwordHash, collegeId, templateRequestId]
      );
    } else {
      await connection.execute(
        `INSERT INTO college_credentials 
         (college_id, template_request_id, login_email, password_hash, sent_at) 
         VALUES (?, ?, ?, ?, NOW())`,
        [collegeId, templateRequestId, college.email, passwordHash]
      );
    }

    // Update template request status
    await connection.execute(
      `UPDATE template_requests 
       SET status = 'completed', updated_at = NOW()
       WHERE id = ? AND status = 'approved'`,
      [templateRequestId]
    );

    // Send email
    try {
      const transporter = createTransporter();
      await transporter.sendMail({
        from: `"Portfolio Handler" <${process.env.EMAIL_USER}>`,
        to: college.email,
        subject: resend ? "Your College Account Credentials (Resent)" : "Your College Account is Ready",
        html: `
          <h3>${resend ? 'Credentials Resent' : 'Welcome to Portfolio Handler!'}</h3>
          <p>Dear ${college.name},</p>
          <p>Your account has been created successfully. Here are your login credentials:</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Email:</strong> ${college.email}</p>
            <p><strong>Password:</strong> ${plainPassword}</p>
            <p><strong>Template ID:</strong> ${templateRequest.template_id}</p>
            <p><strong>Plan:</strong> ${templateRequest.plan || 'Basic'}</p>
          </div>
          
          <p>You can login at: <a href="${process.env.NEXT_PUBLIC_APP_URL}/auth/login">${process.env.NEXT_PUBLIC_APP_URL}/auth/login</a></p>
          
          <p>Best regards,<br/>Portfolio Handler Team</p>
        `
      });
      
      console.log('Email sent successfully to:', college.email);
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // Email fail hua to bhi transaction commit karo, credentials save ho chuke hain
    }

    await connection.commit();

    return NextResponse.json({
      success: true,
      message: resend ? 'Credentials resent successfully' : 'Credentials sent successfully',
      data: {
        collegeId,
        templateRequestId,
        recipientEmail: college.email,
        recipientName: college.name,
        resend,
        emailSent: true
      }
    });

  } catch (error: any) {
    if (connection) await connection.rollback();
    console.error('Error sending credentials:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to send credentials', 
        error: error.message 
      },
      { status: 500 }
    );
  } finally {
    if (connection) await connection.end();
  }
}

// OPTIONS for CORS
export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}