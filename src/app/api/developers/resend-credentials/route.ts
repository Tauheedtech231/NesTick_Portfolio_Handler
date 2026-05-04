/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/developers/resend-credentials/route.ts
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
    const { developerId, email, name } = await request.json();

    if (!developerId) {
      return NextResponse.json({ success: false, error: 'Developer ID required' }, { status: 400 });
    }

    const connection = await pool.getConnection();

    try {
      // Get developer info
      const [rows] = await connection.execute(
        'SELECT id, name, email FROM developers WHERE id = ?',
        [developerId]
      );

      const developers = rows as any[];
      if (developers.length === 0) {
        return NextResponse.json({ success: false, error: 'Developer not found' }, { status: 404 });
      }

      const developer = developers[0];
      
      // Generate new password
      const newPassword = generateRandomPassword(12);
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      // Update password in database
      await connection.execute(
        'UPDATE developers SET password = ? WHERE id = ?',
        [hashedPassword, developerId]
      );

      // Send email with new credentials
      await transporter.sendMail({
        from: `"Portfolio Handler" <${process.env.EMAIL_USER}>`,
        to: developer.email,
        subject: 'Your Developer Portal Credentials (Resent)',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #8B5CF6, #6D28D9); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px; }
              .credentials { background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0; }
              .button { display: inline-block; background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>Your Developer Portal Credentials 🔐</h2>
              </div>
              <div class="content">
                <p>Dear ${developer.name},</p>
                <p>Your developer portal credentials have been resent as requested.</p>
                <div class="credentials">
                  <p><strong>🔗 Portal URL:</strong><br/>
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/designer/login?type=developer">${process.env.NEXT_PUBLIC_APP_URL}/designer/login?type=developer</a></p>
                  <p><strong>📧 Email:</strong> ${developer.email}</p>
                  <p><strong>🔑 New Password:</strong> <code style="background: #e5e7eb; padding: 4px 8px; border-radius: 4px; font-size: 14px;">${newPassword}</code></p>
                </div>
                <p><strong style="color: #ef4444;">Important:</strong> Please change your password after logging in for security reasons.</p>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/designer/login?type=developer" class="button">Login to Developer Portal</a>
                <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">Best regards,<br><strong>Portfolio Handler Team</strong></p>
              </div>
            </div>
          </body>
          </html>
        `,
      });

      return NextResponse.json({ success: true, message: 'Credentials resent successfully', newPassword });

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error resending credentials:', error);
    return NextResponse.json({ success: false, error: 'Failed to resend credentials' }, { status: 500 });
  }
}