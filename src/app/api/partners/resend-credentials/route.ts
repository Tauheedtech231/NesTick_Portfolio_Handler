/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/partners/resend-credentials/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate random password
function generateRandomPassword(length: number = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export async function POST(request: NextRequest) {
  try {
    const { id, email, name, type } = await request.json();

    if (!id || !email) {
      return NextResponse.json(
        { success: false, error: 'ID and email are required' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();

    try {
      // Check if partner exists and is approved
      const [rows] = await connection.execute(
        'SELECT id, organization_name, email FROM partners WHERE id = ? AND status = "approved"',
        [id]
      );

      const partners = rows as any[];
      if (partners.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Partner not found or not approved' },
          { status: 404 }
        );
      }

      const partner = partners[0];
      
      // Generate new password (partners might not have password, so we create one)
      const newPassword = generateRandomPassword(12);
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      // Check if partners table has password column, if not add it
      // For now, we'll assume password column exists or create it
      await connection.execute(
        'UPDATE partners SET password = ? WHERE id = ?',
        [hashedPassword, id]
      ).catch(async () => {
        // If password column doesn't exist, add it
        await connection.execute('ALTER TABLE partners ADD COLUMN password VARCHAR(255) NULL');
        await connection.execute('UPDATE partners SET password = ? WHERE id = ?', [hashedPassword, id]);
      });

      // Send email with credentials
      await transporter.sendMail({
        from: `"Portfolio Handler" <${process.env.EMAIL_USER}>`,
        to: partner.email,
        subject: 'Your Partner Portal Credentials',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #10B981, #059669); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px; }
              .credentials { background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0; }
              .button { display: inline-block; background: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>Your Partner Portal Credentials 🔐</h2>
              </div>
              <div class="content">
                <p>Dear ${partner.organization_name} Team,</p>
                <p>Your partner portal credentials have been sent as requested.</p>
                <div class="credentials">
                  <p><strong>🔗 Portal URL:</strong><br/>
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/partner/login">${process.env.NEXT_PUBLIC_APP_URL}/partner/login</a></p>
                  <p><strong>📧 Email:</strong> ${partner.email}</p>
                  <p><strong>🔑 Password:</strong> <code style="background: #e5e7eb; padding: 4px 8px; border-radius: 4px; font-size: 14px;">${newPassword}</code></p>
                </div>
                <p><strong style="color: #ef4444;">Important:</strong> Please change your password after logging in for security reasons.</p>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/partner/login" class="button">Login to Partner Portal</a>
                <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">Best regards,<br><strong>Portfolio Handler Team</strong></p>
              </div>
            </div>
          </body>
          </html>
        `,
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Credentials resent successfully',
        newPassword 
      });

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error resending partner credentials:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to resend credentials' },
      { status: 500 }
    );
  }
}