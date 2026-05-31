// app/api/designers/upload-approved-docs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function POST(request: NextRequest) {
  let connection;
  
  try {
    const body = await request.json();
    const { 
      design_id, 
      designer_id, 
      white_paper, 
      white_paper_filename, 
      design_file, 
      design_filename, 
      preview_image 
    } = body;

    // Validation
    if (!design_id || !designer_id) {
      return NextResponse.json(
        { success: false, error: 'Design ID and Designer ID are required' },
        { status: 400 }
      );
    }

    connection = await getConnection();
    console.log('✅ Database connection acquired');

    // ✅ First, fetch existing design data
    const [existingDesigns] = await connection.execute(
      `SELECT preview_image, white_paper, white_paper_filename, 
              instruction_doc, instruction_filename
       FROM designer_designs 
       WHERE id = ? AND designer_id = ? AND status = 'approved'`,
      [design_id, designer_id]
    );

    const existingData = (existingDesigns as any[])[0];
    
    if (!existingData) {
      return NextResponse.json(
        { success: false, error: 'Design not found or not approved' },
        { status: 404 }
      );
    }

    // ✅ Build update query using existing values as fallback
    const updates: string[] = [];
    const queryParams: any[] = [];

    // White paper - use new if provided, otherwise keep existing
    if (white_paper !== undefined && white_paper !== null) {
      updates.push('white_paper = ?');
      queryParams.push(white_paper);
    }
    // If not provided, don't update (keep existing)

    if (white_paper_filename !== undefined && white_paper_filename !== null) {
      updates.push('white_paper_filename = ?');
      queryParams.push(white_paper_filename);
    }

    // Design file (instruction_doc) - use new if provided
    if (design_file !== undefined && design_file !== null) {
      updates.push('instruction_doc = ?');
      queryParams.push(design_file);
    }

    if (design_filename !== undefined && design_filename !== null) {
      updates.push('instruction_filename = ?');
      queryParams.push(design_filename);
    }

    // ✅ Preview image - VERY IMPORTANT: use existing if not provided
    if (preview_image !== undefined && preview_image !== null) {
      updates.push('preview_image = ?');
      queryParams.push(preview_image);
    }
    // If preview_image not provided, DO NOT update it (keep existing)

    // If no fields to update
    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    updates.push('updated_at = NOW()');
    queryParams.push(design_id, designer_id);

    const updateQuery = `UPDATE designer_designs SET ${updates.join(', ')} WHERE id = ? AND designer_id = ?`;
    
    console.log('📝 Update query:', updateQuery);
    console.log('📝 Values:', queryParams);
    console.log('📝 Existing data:', existingData);

    await connection.execute(updateQuery, queryParams);

    console.log('✅ Documents uploaded successfully');

    return NextResponse.json({
      success: true,
      message: 'Documents uploaded successfully'
    });

  } catch (error) {
    console.error('Upload approved docs error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload documents' },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
      console.log('🔌 Connection released');
    }
  }
}