/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/admin/submissions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getConnection } from '@/lib/db';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// GET - Fetch all submissions with revision info
export async function GET(request: NextRequest) {
  let connection;
  
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');

    // Map frontend status to database status
    let dbStatus = '';
    if (status === 'pending') {
      dbStatus = 'submitted';
    } else if (status === 'approved') {
      dbStatus = 'approved';
    } else if (status === 'rejected') {
      dbStatus = 'rejected';
    }

    let query = `
      SELECT 
        da.id as assignment_id,
        da.status,
        da.submission_url as live_url,
        da.white_paper,
        da.source_code_url,
        da.preview_image_url,
        da.submission_notes,
        da.review_notes,
        da.submitted_at,
        da.revision_count,
        da.is_permanently_rejected,
        da.rejection_reason,
        dd.id as design_id,
        dd.title as design_title,
        dd.description as design_description,
        dev.id as developer_id,
        dev.name as developer_name,
        dev.email as developer_email
      FROM developer_assignments da
      LEFT JOIN designer_designs dd ON da.design_id = dd.id
      LEFT JOIN developers dev ON da.developer_id = dev.id
      WHERE da.submission_url IS NOT NULL
    `;
    const params: any[] = [];

    if (dbStatus) {
      query += ' AND da.status = ?';
      params.push(dbStatus);
    } else {
      // If no status filter, show all (submitted, approved, rejected)
      query += ' AND da.status IN (?, ?, ?)';
      params.push('submitted', 'approved', 'rejected');
    }

    query += ' ORDER BY da.submitted_at DESC';

    connection = await getConnection();
    console.log('✅ GET submissions connection acquired');
    
    const [rows] = await connection.execute(query, params);
    
    // Transform status for frontend (map 'submitted' to 'pending')
    const transformedRows = (rows as any[]).map(row => ({
      ...row,
      status: row.status === 'submitted' ? 'pending' : row.status,
      // Convert tinyint to boolean
      is_permanently_rejected: row.is_permanently_rejected === 1 || row.is_permanently_rejected === true,
      // Set default revision count
      revision_count: row.revision_count || 0
    }));
    
    return NextResponse.json({ success: true, data: transformedRows });
    
  } catch (error) {
    console.error('GET submissions error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch submissions' }, { status: 500 });
  } finally {
    if (connection) {
      connection.release();
      console.log('🔌 GET submissions connection released');
    }
  }
}

// PUT - Approve/Reject submission with revision tracking
export async function PUT(request: NextRequest) {
  let connection;
  
  try {
    const body = await request.json();
    const { id, status, reviewNotes } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'ID and status required' }, { status: 400 });
    }

    connection = await getConnection();
    console.log('✅ PUT submission connection acquired');

    // Get assignment details before update
    const [assignmentRows] = await connection.execute(
      `SELECT da.*, dd.title as design_title, dev.name as developer_name, dev.email as developer_email
       FROM developer_assignments da
       LEFT JOIN designer_designs dd ON da.design_id = dd.id
       LEFT JOIN developers dev ON da.developer_id = dev.id
       WHERE da.id = ?`,
      [id]
    );

    const assignment = (assignmentRows as any[])[0];
    if (!assignment) {
      return NextResponse.json({ success: false, error: 'Assignment not found' }, { status: 404 });
    }

    // Check if design is permanently rejected
    if (assignment.is_permanently_rejected && status === 'approved') {
      return NextResponse.json({ 
        success: false, 
        error: 'Cannot approve permanently rejected design' 
      }, { status: 400 });
    }

    const newStatus = status === 'approved' ? 'approved' : 'rejected';
    let newRevisionCount = assignment.revision_count || 0;
    let isPermanentlyRejected = assignment.is_permanently_rejected || false;

    // If rejecting, increment revision count
    if (status === 'rejected') {
      newRevisionCount = (assignment.revision_count || 0) + 1;
      isPermanentlyRejected = newRevisionCount >= 3;
    }

    // Update assignment status with revision tracking
    await connection.execute(
      `UPDATE developer_assignments 
       SET status = ?, 
           review_notes = ?, 
           revision_count = ?,
           is_permanently_rejected = ?,
           rejection_reason = ?,
           reviewed_at = NOW(), 
           updated_at = NOW()
       WHERE id = ?`,
      [
        newStatus, 
        reviewNotes || null, 
        newRevisionCount,
        isPermanentlyRejected,
        status === 'rejected' ? reviewNotes : null,
        id
      ]
    );

    // Send email to developer
    const emailSubject = status === 'approved' 
      ? `✅ Your design "${assignment.design_title}" has been approved!`
      : `❌ Your design "${assignment.design_title}" needs revisions`;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: ${status === 'approved' ? 'linear-gradient(135deg, #22C55E, #16A34A)' : 'linear-gradient(135deg, #EF4444, #DC2626)'}; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px; }
          .review-notes { background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .warning { background: #FEF3C7; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #F59E0B; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>${status === 'approved' ? '🎉 Design Approved! 🎉' : '📝 Design Update'}</h2>
          </div>
          <div class="content">
            <p>Dear ${assignment.developer_name},</p>
            <p>Your design <strong>"${assignment.design_title}"</strong> has been ${status === 'approved' ? '<strong style="color: #22C55E;">APPROVED</strong>' : '<strong style="color: #EF4444;">REJECTED</strong>'}.</p>
            ${reviewNotes ? `
            <div class="review-notes">
              <p><strong>${status === 'approved' ? '✨ Congratulations! ✨' : '📋 Feedback from admin:'}</strong></p>
              <p>${reviewNotes}</p>
            </div>
            ` : ''}
            ${status === 'rejected' && newRevisionCount >= 3 ? `
            <div class="warning">
              <p><strong>⚠️ Important: Maximum Revisions Reached</strong></p>
              <p>This design has been rejected ${newRevisionCount} times and is now <strong>permanently rejected</strong>. You cannot resubmit this design again.</p>
            </div>
            ` : status === 'rejected' ? `
            <div class="review-notes">
              <p><strong>📊 Revision Status: ${newRevisionCount}/3</strong></p>
              <p>You have ${3 - newRevisionCount} revision(s) remaining. Please make the requested changes and resubmit.</p>
            </div>
            ` : ''}
            ${status === 'approved' ? `
            <p>Your design will now be listed in our templates marketplace. You will receive earnings when colleges purchase your template.</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/developer/completed-designs" class="button">View Your Completed Designs</a>
            ` : status === 'rejected' && newRevisionCount < 3 ? `
            <p>Please review the feedback and make necessary changes. You can resubmit your design after revisions.</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/developer/assigned-designs" class="button">Resubmit Design</a>
            ` : ''}
            <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">Best regards,<br><strong>Portfolio Handler Team</strong></p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"Portfolio Handler" <${process.env.EMAIL_USER}>`,
      to: assignment.developer_email,
      subject: emailSubject,
      html: emailHtml,
    });

    return NextResponse.json({
      success: true,
      message: `Design ${status} successfully and developer notified`,
      revision_count: newRevisionCount,
      is_permanently_rejected: isPermanentlyRejected
    });

  } catch (error) {
    console.error('PUT submission error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update submission' }, { status: 500 });
  } finally {
    if (connection) {
      connection.release();
      console.log('🔌 PUT submission connection released');
    }
  }
}