// app/api/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, password, country } = await request.json();

    // Validate required fields
    if (!fullName || !email || !password || !country) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Create transporter - FIXED: createTransport instead of createTransporter
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
      to: email,
      subject: 'Welcome to Our Platform - Registration Successful',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #000000 0%, #333333 100%); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Welcome to Our Platform</h1>
            <p style="color: #cccccc; margin: 10px 0 0 0;">Your account has been successfully created</p>
          </div>
          
          <div style="padding: 30px; background: #ffffff; border: 1px solid #e5e5e5;">
            <h2 style="color: #000000; margin-top: 0;">Welcome, ${fullName}!</h2>
            
            <p style="color: #666666; line-height: 1.6;">
              Thank you for registering with us. Your account has been successfully created and is now active.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="color: #000000; margin-top: 0;">Your Account Details:</h3>
              <table style="width: 100%; color: #666666;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; width: 120px;">Full Name:</td>
                  <td style="padding: 8px 0;">${fullName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Email:</td>
                  <td style="padding: 8px 0;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Country:</td>
                  <td style="padding: 8px 0;">${country}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Status:</td>
                  <td style="padding: 8px 0; color: #059669;">Active</td>
                </tr>
              </table>
            </div>
            
            <p style="color: #666666; line-height: 1.6;">
              You can now login to your account and start using our services.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/login" 
                 style="background: #000000; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                Login to Your Account
              </a>
            </div>
            
            <div style="border-top: 1px solid #e5e5e5; padding-top: 20px; margin-top: 30px;">
              <p style="color: #999999; font-size: 12px; margin: 0;">
                If you have any questions, please contact our support team at 
                <a href="mailto:support@nesticktech.com" style="color: #000000;">support@nesticktech.com</a>
              </p>
            </div>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e5e5e5;">
            <p style="color: #999999; font-size: 12px; margin: 0;">
              &copy; ${new Date().getFullYear()} Our Platform. All rights reserved.<br>
              <a href="https://nesticktech.com" style="color: #666666;">nesticktech.com</a>
            </p>
          </div>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Registration successful! Confirmation email sent.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Registration API error:', error);
    return NextResponse.json(
      { error: 'Failed to process registration. Please try again.' },
      { status: 500 }
    );
  }
}