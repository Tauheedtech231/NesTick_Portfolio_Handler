/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, designType, inspiration, description } = body;

    // Validation
    if (!name || !email || !phone || !designType || !description) {
      return NextResponse.json(
        { success: false, message: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    // Admin emails list
    const adminEmails = [
      'nesticktech@gmail.com',
      'tauheeddeveloper13@gmail.com'
    ];
    
    // Common email HTML template
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #9333EA, #DB2777); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
          .field { margin-bottom: 15px; }
          .field-label { font-weight: bold; color: #374151; width: 140px; display: inline-block; }
          .field-value { color: #111827; }
          .footer { background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 10px 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🎨 New Design Request</h2>
            <p>Someone wants to collaborate on a design</p>
          </div>
          <div class="content">
            <div class="field">
              <span class="field-label">Name:</span>
              <span class="field-value">${name}</span>
            </div>
            <div class="field">
              <span class="field-label">Email:</span>
              <span class="field-value">${email}</span>
            </div>
            <div class="field">
              <span class="field-label">Phone:</span>
              <span class="field-value">${phone}</span>
            </div>
            <div class="field">
              <span class="field-label">Design Type:</span>
              <span class="field-value">${designType}</span>
            </div>
            ${inspiration ? `
            <div class="field">
              <span class="field-label">Inspiration:</span>
              <span class="field-value">${inspiration}</span>
            </div>
            ` : ''}
            <div class="field">
              <span class="field-label">Requirements:</span>
              <span class="field-value">${description}</span>
            </div>
          </div>
          <div class="footer">
            <p>This request was submitted from the Portfolio Handler website.</p>
            <p>Reply to: ${email} | Call: ${phone}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email to both admins
    for (const adminEmail of adminEmails) {
      await transporter.sendMail({
        from: `"Portfolio Handler" <${process.env.EMAIL_USER}>`,
        to: adminEmail,
        subject: `🎨 New Design Request from ${name}`,
        html: emailHtml,
        replyTo: email,
      });
    }

    // Send auto-reply to user
    await transporter.sendMail({
      from: `"Portfolio Handler" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thank you for your design request",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .container { max-width: 500px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #9333EA, #DB2777); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: linear-gradient(135deg, #9333EA, #DB2777); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Thank You for Your Design Request! 🎨</h2>
            </div>
            <div class="content">
              <p>Dear ${name},</p>
              <p>Thank you for sharing your design vision with us! We have received your request and our design team will review it within <strong>24-48 hours</strong>.</p>
              <p><strong>Your Request Summary:</strong></p>
              <ul>
                <li>🎨 Design Type: ${designType}</li>
                <li>📧 Email: ${email}</li>
                <li>📞 Phone: ${phone}</li>
              </ul>
              <p>Our team will reach out to you shortly to discuss your requirements in detail.</p>
              <p>In the meantime, you can:</p>
              <ul>
                <li>📱 WhatsApp us at: +92 319 3236529</li>
                <li>📧 Reply to this email</li>
                <li>🌐 Visit our website for portfolio inspiration</li>
              </ul>
              <a href="https://nesticktech.com" class="button">Visit Our Website</a>
              <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">Best regards,<br><strong>Portfolio Handler Team</strong><br>Nestick Tech</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({
      success: true,
      message: 'Design request submitted successfully'
    });

  } catch (error) {
    console.error('Design request error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit design request' },
      { status: 500 }
    );
  }
}