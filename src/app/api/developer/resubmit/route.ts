/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/developer/resubmit/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function POST(request: NextRequest) {
  let connection;

  try {
    const body = await request.json();

    const {
      assignmentId,
      developerId,
      liveUrl,
      previewImage,
      notes,
      isResubmit,
    } = body;

    if (!assignmentId || !developerId || !liveUrl) {
      return NextResponse.json(
        {
          success: false,
          error: 'Assignment ID, Developer ID, and Live URL are required',
        },
        { status: 400 }
      );
    }

    connection = await getConnection();
    console.log('✅ Resubmit connection acquired');

    // Check assignment
    const [assignments] = await connection.execute(
      `SELECT id, status, revision_count, is_permanently_rejected
       FROM developer_assignments
       WHERE id = ? AND developer_id = ?`,
      [assignmentId, developerId]
    );

    const assignment = (assignments as any[])[0];

    if (!assignment) {
      return NextResponse.json(
        {
          success: false,
          error: 'Assignment not found',
        },
        { status: 404 }
      );
    }

    if (assignment.is_permanently_rejected) {
      return NextResponse.json(
        {
          success: false,
          error: 'Design is permanently rejected. Cannot resubmit.',
        },
        { status: 400 }
      );
    }

    if (assignment.status !== 'rejected') {
      return NextResponse.json(
        {
          success: false,
          error: 'Only rejected designs can be resubmitted',
        },
        { status: 400 }
      );
    }

    if (assignment.revision_count >= 3) {
      return NextResponse.json(
        {
          success: false,
          error: 'Maximum revisions reached. Design permanently rejected.',
        },
        { status: 400 }
      );
    }

    // Store image directly in database
    let previewImageData = null;

    if (previewImage) {
      previewImageData = previewImage.startsWith('data:image')
        ? previewImage
        : `data:image/png;base64,${previewImage}`;
    }

    // Update assignment
    await connection.execute(
      `UPDATE developer_assignments
       SET submission_url = ?,
           submission_notes = ?,
           preview_image_url = COALESCE(?, preview_image_url),
           status = 'submitted',
           submitted_at = NOW(),
           updated_at = NOW()
       WHERE id = ? AND developer_id = ?`,
      [
        liveUrl,
        notes || null,
        previewImageData,
        assignmentId,
        developerId,
      ]
    );

    // Notify admin
    await connection.execute(
      `INSERT INTO admin_notifications
      (type, related_id, message, created_at)
      VALUES
      ('design_resubmitted', ?, 'A design has been resubmitted for review', NOW())`,
      [assignmentId]
    );

    return NextResponse.json({
      success: true,
      message: 'Design resubmitted successfully',
    });

  } catch (error) {
    console.error('Resubmit error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to resubmit design',
      },
      { status: 500 }
    );

  } finally {
    if (connection) {
      connection.release();
      console.log('🔌 Resubmit connection released');
    }
  }
}