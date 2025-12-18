import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
/* eslint-disable */

const dbConfig = {
  host: "72.61.117.188",
  user: "portfolio_user",
  password: "StrongPass123!",
  database: "portfolio_handler_db",
  waitForConnections: true,
  connectionLimit: 10,
  ssl: { rejectUnauthorized: false }
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
    const { templateRequestId, requestData, resend = false } = await request.json();
    console.log('Received data for sending credentials:', requestData)
    if (!templateRequestId || !requestData?.email) {
      return NextResponse.json(
        { success: false, message: 'Template Request ID and College Email are required.' },
        { status: 400 }
      );
      
    }

    connection = await mysql.createConnection(dbConfig);
    await connection.beginTransaction();

    // Find college by email
    const [collegeRows] = await connection.execute(
      `SELECT * FROM colleges WHERE email = ?`,
      [requestData.email]
    );
    const colleges = collegeRows as any[];
    if (colleges.length === 0) {
      await connection.rollback();
      return NextResponse.json(
        { success: false, message: 'College not found with this email.' },
        { status: 404 }
      );
    }
    const college = colleges[0];
    const collegeId = college.id;

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
        { success: false, message: 'Credentials already sent for this request.' },
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
       SET status = 'completed', submitted_at = NOW()
       WHERE id = ? AND status = 'approved'`,
      [templateRequestId]
    );

    // Send email
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"Portfolio Handler" <${process.env.EMAIL_USER}>`,
      to: college.email,
      subject: resend ? "Your College Account Credentials (Resent)" : "Your College Account is Ready",
      html: `
        <h3>${resend ? 'Credentials Resent' : 'Welcome!'}</h3>
        <p>Email: ${college.email}</p>
        <p>Password: ${plainPassword}</p>
        <p>Template: ${templateRequest.template_id}</p>
        <p>Plan: ${templateRequest.plan}</p>
      `
    });

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
      { success: false, message: 'Failed to send credentials', error: error.message },
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
