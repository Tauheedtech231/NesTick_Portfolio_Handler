import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
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

export async function POST(request: NextRequest) {
  let connection;
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password required" }, { status: 400 });
    }

    connection = await mysql.createConnection(dbConfig);

    // Fetch credentials by email
    const [rows] = await connection.execute(
      `SELECT cc.id as credential_id, cc.college_id, cc.template_request_id, cc.login_email, cc.password_hash,
              c.name as college_name, tr.name as template_name, tr.plan, tr.type
       FROM college_credentials cc
       JOIN colleges c ON cc.college_id = c.id
       JOIN template_requests tr ON cc.template_request_id = tr.id
       WHERE cc.login_email = ?`,
      [email]
    );

    const creds = rows as any[];

    if (creds.length === 0) {
      return NextResponse.json({ success: false, message: "Email not found" }, { status: 404 });
    }

    const credential = creds[0];

    // Verify password
    const isMatch = await bcrypt.compare(password, credential.password_hash);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: "Invalid password" }, { status: 401 });
    }

    // Login successful → return relevant data
    return NextResponse.json({
      success: true,
      data: {
        credentialId: credential.credential_id,
        collegeId: credential.college_id,
        templateRequestId: credential.template_request_id,
        collegeName: credential.college_name,
        templateName: credential.template_name,
        plan: credential.plan,
        type: credential.type,
        email: credential.login_email,
      }
    });

  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ success: false, message: "Login failed", error: error.message }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}
