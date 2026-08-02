// app/api/developer/submit/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function POST(request: NextRequest) {
  let connection;

  try {
    const body = await request.json();

    const { 
      assignmentId, 
      liveUrl, 
      previewImage, 
      notes, 
      developerId 
    } = body;


    if (!assignmentId || !liveUrl || !developerId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Assignment ID, Live URL, and Developer ID are required'
        },
        { status: 400 }
      );
    }


    connection = await getConnection();

    console.log('✅ Submit assignment connection acquired');


    // Store image directly in database
    let previewImageData = null;

    if (previewImage) {
      previewImageData = previewImage;
    }


    await connection.execute(
      `UPDATE developer_assignments 
       SET submission_url = ?, 
           submission_notes = ?, 
           preview_image_url = ?,
           status = 'submitted', 
           submitted_at = NOW(),
           updated_at = NOW()
       WHERE id = ? AND developer_id = ?`,
      [
        liveUrl,
        notes || null,
        previewImageData,
        assignmentId,
        developerId
      ]
    );


    await connection.execute(
      `INSERT INTO admin_notifications 
       (type, related_id, message, created_at)
       VALUES 
       ('design_submitted', ?, 
       'A new design has been submitted for review', 
       NOW())`,
      [assignmentId]
    );


    return NextResponse.json({
      success: true,
      message: 'Design submitted successfully. Admin will review your work.'
    });


  } catch (error) {

    console.error('Submit design error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit design'
      },
      { status: 500 }
    );

  } finally {

    if (connection) {
      connection.release();
      console.log('🔌 Submit connection released');
    }

  }
}