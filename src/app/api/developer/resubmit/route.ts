/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/developer/resubmit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getConnection } from '@/lib/db';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadToCloudinary(base64: string, folder: string): Promise<string> {
  try {
    let imageData = base64;
    if (base64.includes(',')) {
      imageData = base64.split(',')[1];
    }
    const result = await cloudinary.uploader.upload(`data:image/png;base64,${imageData}`, {
      folder: `developer_resubmissions/${folder}`,
    });
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  let connection;
  
  try {
    const body = await request.json();
    const { assignmentId, developerId, liveUrl, previewImage, notes, isResubmit } = body;

    if (!assignmentId || !developerId || !liveUrl) {
      return NextResponse.json({ 
        success: false, 
        error: 'Assignment ID, Developer ID, and Live URL are required' 
      }, { status: 400 });
    }

    connection = await getConnection();
    console.log('✅ Resubmit connection acquired');

    // Check if assignment exists and is rejected
    const [assignments] = await connection.execute(
      `SELECT id, status, revision_count, is_permanently_rejected 
       FROM developer_assignments 
       WHERE id = ? AND developer_id = ?`,
      [assignmentId, developerId]
    );

    const assignment = (assignments as any[])[0];
    
    if (!assignment) {
      return NextResponse.json({ success: false, error: 'Assignment not found' }, { status: 404 });
    }

    if (assignment.is_permanently_rejected) {
      return NextResponse.json({ 
        success: false, 
        error: 'Design is permanently rejected. Cannot resubmit.' 
      }, { status: 400 });
    }

    if (assignment.status !== 'rejected') {
      return NextResponse.json({ 
        success: false, 
        error: 'Only rejected designs can be resubmitted' 
      }, { status: 400 });
    }

    if (assignment.revision_count >= 3) {
      return NextResponse.json({ 
        success: false, 
        error: 'Maximum revisions reached. Design permanently rejected.' 
      }, { status: 400 });
    }

    let previewImageUrl = null;
    if (previewImage) {
      previewImageUrl = await uploadToCloudinary(previewImage, `resubmit_${assignmentId}`);
    }

    // Update assignment with resubmission details
    await connection.execute(
      `UPDATE developer_assignments 
       SET submission_url = ?, 
           submission_notes = ?, 
           preview_image_url = COALESCE(?, preview_image_url),
           status = 'submitted', 
           submitted_at = NOW(),
           updated_at = NOW()
       WHERE id = ? AND developer_id = ?`,
      [liveUrl, notes || null, previewImageUrl, assignmentId, developerId]
    );

    // Create notification for admin
    await connection.execute(
      `INSERT INTO admin_notifications (type, related_id, message, created_at)
       VALUES ('design_resubmitted', ?, 'A design has been resubmitted for review', NOW())`,
      [assignmentId]
    );

    return NextResponse.json({
      success: true,
      message: 'Design resubmitted successfully'
    });

  } catch (error) {
    console.error('Resubmit error:', error);
    return NextResponse.json({ success: false, error: 'Failed to resubmit design' }, { status: 500 });
  } finally {
    if (connection) {
      connection.release();
      console.log('🔌 Resubmit connection released');
    }
  }
}