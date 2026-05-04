/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/developers/send-credentials/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import nodemailer from 'nodemailer';

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

export async function POST(request: NextRequest) {
  try {
    const { developerId } = await request.json();

    if (!developerId) {
      return NextResponse.json({ success: false, error: 'Developer ID required' }, { status: 400 });
    }

    const connection = await pool.getConnection();

    try {
      const [rows] = await connection.execute(
        'SELECT id, name, email, password FROM developers WHERE id = ?',
        [developerId]
      );

      const developers = rows as any[];
      if (developers.length === 0) {
        return NextResponse.json({ success: false, error: 'Developer not found' }, { status: 404 });
      }

      const developer = developers[0];

      // Send email to developer
      await transporter.sendMail({
        from: `"Portfolio Handler" <${process.env.EMAIL_USER}>`,
        to: developer.email,
        subject: 'Welcome to Developer Portal - Your Credentials',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #8B5CF6, #6D28D9); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>Welcome to Developer Portal! 🚀</h2>
              </div>
              <div class="content">
                <p>Dear ${developer.name},</p>
                <p>Your developer account has been <strong>approved</strong>! You can now access the Developer Portal.</p>
                <p><strong>Your Login Credentials:</strong></p>
                <ul>
                  <li>🔗 Portal URL: <a href="${process.env.NEXT_PUBLIC_APP_URL}/designer/login?type=developer">${process.env.NEXT_PUBLIC_APP_URL}/designer/login?type=developer</a></li>
                  <li>📧 Email: ${developer.email}</li>
                  <li>🔑 Password: (The password you set during registration)</li>
                </ul>
                <p>If you forgot your password, please use the "Forgot Password" option on the login page.</p>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/designer/login?type=developer" class="button">Login to Developer Portal</a>
                <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">Best regards,<br><strong>Portfolio Handler Team</strong></p>
              </div>
            </div>
          </body>
          </html>
        `,
      });

      return NextResponse.json({ success: true, message: 'Credentials sent successfully' });

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error sending credentials:', error);
    return NextResponse.json({ success: false, error: 'Failed to send credentials' }, { status: 500 });
  }
}