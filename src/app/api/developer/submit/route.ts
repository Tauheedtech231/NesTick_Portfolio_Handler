// app/api/developer/submit/route.ts
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
      folder: `developer_submissions/${folder}`,
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
    const { assignmentId, liveUrl, previewImage, notes, developerId } = body;

    // Validation - Only liveUrl is required now
    if (!assignmentId || !liveUrl || !developerId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Assignment ID, Live URL, and Developer ID are required' 
      }, { status: 400 });
    }

    connection = await getConnection();
    console.log('✅ Submit assignment connection acquired');

    let previewImageUrl = null;
    if (previewImage) {
      previewImageUrl = await uploadToCloudinary(previewImage, `assignment_${assignmentId}`);
    }

    // Update assignment with submission details (without white paper)
    await connection.execute(
      `UPDATE developer_assignments 
       SET submission_url = ?, 
           submission_notes = ?, 
           preview_image_url = ?,
           status = 'submitted', 
           submitted_at = NOW(),
           updated_at = NOW()
       WHERE id = ? AND developer_id = ?`,
      [liveUrl, notes || null, previewImageUrl, assignmentId, developerId]
    );

    // Create notification for admin
    await connection.execute(
      `INSERT INTO admin_notifications (type, related_id, message, created_at)
       VALUES ('design_submitted', ?, 'A new design has been submitted for review', NOW())`,
      [assignmentId]
    );

    return NextResponse.json({
      success: true,
      message: 'Design submitted successfully. Admin will review your work.'
    });

  } catch (error) {
    console.error('Submit design error:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit design' }, { status: 500 });
  } finally {
    if (connection) {
      connection.release();
      console.log('🔌 Submit connection released');
    }
  }
}