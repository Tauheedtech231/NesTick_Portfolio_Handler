// app/api/send-credentials/route.ts
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { to, collegeName, adminName, email, password } = await request.json();

    // Validate required fields
    if (!to || !collegeName || !adminName || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: `Welcome to Portfolio Handler - Your College Portal Credentials`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #000000 0%, #333333 100%); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Portfolio Handler</h1>
            <p style="color: #cccccc; margin: 10px 0 0 0;">College Portal Access</p>
          </div>
          
          <div style="padding: 30px; background: #ffffff; border: 1px solid #e5e5e5;">
            <h2 style="color: #000000; margin-top: 0;">Welcome, ${adminName}!</h2>
            
            <p style="color: #666666; line-height: 1.6;">
              Congratulations! Your college <strong>${collegeName}</strong> has been approved for the Portfolio Handler system.
              You can now access your college administration dashboard using the credentials below.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="color: #000000; margin-top: 0;">Your Login Credentials:</h3>
              <table style="width: 100%; color: #666666;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; width: 120px;">Email:</td>
                  <td style="padding: 8px 0; font-family: monospace;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Password:</td>
                  <td style="padding: 8px 0; font-family: monospace; font-weight: bold; color: #000000;">${password}</td>
                </tr>
              </table>
            </div>

            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #856404; margin: 0 0 10px 0;">🔒 Security Notice</h4>
              <p style="color: #856404; margin: 0; font-size: 14px;">
                For security reasons, we recommend that you change your password after your first login.
              </p>
            </div>
            
            <p style="color: #666666; line-height: 1.6;">
              You can now login to your dashboard and start managing your college portfolio, faculty, events, and more.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/College_Portfolio_Handler/login" 
                 style="background: #000000; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                Access Your Dashboard
              </a>
            </div>
            
            <div style="border-top: 1px solid #e5e5e5; padding-top: 20px; margin-top: 30px;">
              <p style="color: #999999; font-size: 12px; margin: 0;">
                If you have any questions or need assistance, please contact our support team at 
                <a href="mailto:support@nesticktech.com" style="color: #000000;"> support@nesticktech.com</a>
              </p>
            </div>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e5e5e5;">
            <p style="color: #999999; font-size: 12px; margin: 0;">
              &copy; ${new Date().getFullYear()} Portfolio Handler. All rights reserved.<br>
              <a href="https://nesticktech.com" style="color: #666666;">nesticktech.com</a>
            </p>
          </div>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Credentials email sent successfully!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Send credentials API error:', error);
    return NextResponse.json(
      { error: 'Failed to send credentials email. Please try again.' },
      { status: 500 }
    );
  }
}