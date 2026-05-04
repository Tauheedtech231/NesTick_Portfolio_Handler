import nodemailer from "nodemailer";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const { 
      name, 
      email, 
      phone, 
      designation, 
      collegeName, 
      collegeType, 
      studentCount, 
      city, 
      country, 
      interestedPlan, 
      requirements, 
      timeline, 
      budget, 
      hearAboutUs, 
      message,
      subject,  // for old form compatibility
      message: messageText  // for old form compatibility
    } = body;

    // Check if it's from the new sales form or old contact form
    const isSalesForm = !!collegeName || !!interestedPlan;
    const emailSubject = subject || (isSalesForm ? `Sales Inquiry - ${interestedPlan} Plan` : "Contact Form Submission");

    if (isSalesForm) {
      // Sales Form Validation
      if (!name || !email || !phone || !designation || !collegeName || !collegeType || !studentCount || !city || !interestedPlan || !timeline) {
        return new Response(JSON.stringify({ error: "All required fields must be filled" }), {
          status: 400,
          headers: corsHeaders,
        });
      }
    } else {
      // Old Contact Form Validation
      if (!name || !email || !subject || !message) {
        return new Response(JSON.stringify({ error: "All fields are required" }), {
          status: 400,
          headers: corsHeaders,
        });
      }
    }

    // Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Prepare email content based on form type
    let emailHtml = "";
    let finalSubject = "";

    if (isSalesForm) {
      finalSubject = `🎓 New Sales Inquiry - ${interestedPlan} Plan from ${collegeName}`;
      emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1D4ED8, #38BDF8); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
            .section { margin-bottom: 25px; }
            .section-title { background: #e5e7eb; padding: 8px 12px; font-weight: bold; margin-bottom: 15px; border-radius: 5px; }
            .field { margin-bottom: 12px; }
            .field-label { font-weight: bold; width: 180px; display: inline-block; color: #374151; }
            .field-value { color: #111827; }
            .footer { background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none; }
            .badge { display: inline-block; background: #10b981; color: white; padding: 4px 8px; border-radius: 5px; font-size: 12px; margin-left: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>🎓 New College Portfolio Inquiry</h2>
              <p>Sales Request from ${collegeName}</p>
            </div>
            <div class="content">
              
              <div class="section">
                <div class="section-title">📋 Personal Information</div>
                <div class="field">
                  <span class="field-label">Full Name:</span>
                  <span class="field-value">${name}</span>
                </div>
                <div class="field">
                  <span class="field-label">Designation:</span>
                  <span class="field-value">${designation}</span>
                </div>
                <div class="field">
                  <span class="field-label">Email:</span>
                  <span class="field-value">${email}</span>
                </div>
                <div class="field">
                  <span class="field-label">Phone:</span>
                  <span class="field-value">${phone}</span>
                </div>
              </div>

              <div class="section">
                <div class="section-title">🏛️ College Information</div>
                <div class="field">
                  <span class="field-label">College Name:</span>
                  <span class="field-value">${collegeName}</span>
                </div>
                <div class="field">
                  <span class="field-label">College Type:</span>
                  <span class="field-value">${collegeType}</span>
                </div>
                <div class="field">
                  <span class="field-label">Student Count:</span>
                  <span class="field-value">${studentCount}</span>
                </div>
                <div class="field">
                  <span class="field-label">Location:</span>
                  <span class="field-value">${city}, ${country || 'Pakistan'}</span>
                </div>
              </div>

              <div class="section">
                <div class="section-title">⭐ Requirements</div>
                <div class="field">
                  <span class="field-label">Interested Plan:</span>
                  <span class="field-value"><strong>${interestedPlan}</strong> ${interestedPlan === 'Most Featured' ? '<span class="badge">Most Popular</span>' : ''}</span>
                </div>
                <div class="field">
                  <span class="field-label">Timeline:</span>
                  <span class="field-value">${timeline}</span>
                </div>
                <div class="field">
                  <span class="field-label">Budget Range:</span>
                  <span class="field-value">${budget || 'Not specified'}</span>
                </div>
                <div class="field">
                  <span class="field-label">Found via:</span>
                  <span class="field-value">${hearAboutUs || 'Not specified'}</span>
                </div>
                ${requirements ? `
                <div class="field">
                  <span class="field-label">Specific Requirements:</span>
                  <span class="field-value">${requirements}</span>
                </div>
                ` : ''}
                ${message ? `
                <div class="field">
                  <span class="field-label">Additional Message:</span>
                  <span class="field-value">${message}</span>
                </div>
                ` : ''}
              </div>

            </div>
            <div class="footer">
              <p>This inquiry was submitted from the Portfolio Handler contact sales form.</p>
              <p>Reply to: ${email} | Call: ${phone}</p>
              <p>Source: nesticktech.com/contact</p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else {
      // Old contact form
      finalSubject = `📧 New Contact Form Submission - ${subject}`;
      emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .container { max-width: 500px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1D4ED8, #38BDF8); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>New Contact Message</h2>
            </div>
            <div class="content">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Message:</strong> ${message}</p>
            </div>
          </div>
        </body>
        </html>
      `;
    }

    // Send email to Nestick Tech (Primary)
    await transporter.sendMail({
      from: `"Portfolio Handler" <${process.env.EMAIL_USER}>`,
      to: "nesticktech@gmail.com",
      subject: finalSubject,
      html: emailHtml,
      replyTo: email,
    });

    // Send email to Backup/Admin (optional - can comment if not needed)
    await transporter.sendMail({
      from: `"Portfolio Handler" <${process.env.EMAIL_USER}>`,
      to: "tauheeddeveloper13@gmail.com",
      subject: `[Backup] ${finalSubject}`,
      html: emailHtml,
      replyTo: email,
    });

    // Send auto-reply to user
    await transporter.sendMail({
      from: `"Nestick Tech" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thank you for contacting Nestick Tech",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .container { max-width: 500px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1D4ED8, #38BDF8); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #1D4ED8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
            .logo { text-align: center; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Welcome to Nestick Tech! 🚀</h2>
            </div>
            <div class="content">
              <p>Dear ${name},</p>
              <p>Thank you for reaching out to <strong>Nestick Tech</strong>! We have received your inquiry and our team will get back to you within <strong>24 hours</strong>.</p>
              ${isSalesForm ? `
              <p><strong>Your inquiry summary:</strong></p>
              <ul>
                <li>📋 Plan: ${interestedPlan}</li>
                <li>🏛️ College: ${collegeName}</li>
                <li>⏰ Timeline: ${timeline}</li>
              </ul>
              ` : ''}
              <p>In the meantime, you can:</p>
              <ul>
                <li>📱 Chat with us on WhatsApp: <a href="https://wa.me/923193236529">+92 319 3236529</a></li>
                <li>📧 Reply to this email for urgent queries</li>
                <li>🌐 Visit: <a href="https://nesticktech.com">nesticktech.com</a></li>
              </ul>
              <a href="https://wa.me/923193236529" class="button">💬 Chat on WhatsApp</a>
              <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">Best regards,<br><strong>Nestick Tech Team</strong><br>https://nesticktech.com</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Your request has been submitted successfully! Our team will contact you soon." 
    }), {
      status: 200,
      headers: corsHeaders,
    });
    
  } catch (error) {
    console.error("Email sending error:", error);
    return new Response(JSON.stringify({ error: "Failed to send your request. Please try again or contact us directly on WhatsApp." }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}