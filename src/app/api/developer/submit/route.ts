// app/api/developer/submit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
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
  try {
    const body = await request.json();
    const { assignmentId, liveUrl, whitePaper, sourceCodeUrl, previewImage, notes, developerId } = body;

    if (!assignmentId || !liveUrl || !whitePaper || !developerId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Assignment ID, Live URL, White Paper and Developer ID are required' 
      }, { status: 400 });
    }

    if (whitePaper.length < 100) {
      return NextResponse.json({ 
        success: false, 
        error: 'Technical documentation must be at least 100 characters' 
      }, { status: 400 });
    }

    const connection = await pool.getConnection();

    try {
      let previewImageUrl = null;
      if (previewImage) {
        previewImageUrl = await uploadToCloudinary(previewImage, `assignment_${assignmentId}`);
      }

      // Update assignment with submission details including white paper
      await connection.execute(
        `UPDATE developer_assignments 
         SET submission_url = ?, 
             submission_notes = ?, 
             white_paper = ?,
             source_code_url = ?,
             preview_image_url = ?,
             status = 'submitted', 
             submitted_at = NOW(),
             updated_at = NOW()
         WHERE id = ? AND developer_id = ?`,
        [liveUrl, notes || null, whitePaper, sourceCodeUrl || null, previewImageUrl, assignmentId, developerId]
      );

      // Create notification for admin (optional)
      await connection.execute(
        `INSERT INTO admin_notifications (type, related_id, message, created_at)
         VALUES ('design_submitted', ?, 'A new design has been submitted for review', NOW())`,
        [assignmentId]
      );

      return NextResponse.json({
        success: true,
        message: 'Design submitted successfully'
      });

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Submit design error:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit design' }, { status: 500 });
  }
}