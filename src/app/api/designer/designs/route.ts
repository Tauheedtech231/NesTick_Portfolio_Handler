/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/designer/designs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getConnection, query } from '@/lib/db';

// GET - Fetch designs (all or single)
export async function GET(request: NextRequest) {
  let connection;
  
  try {
    const searchParams = request.nextUrl.searchParams;
    const designerId = searchParams.get('designerId');
    const designId = searchParams.get('designId');

    console.log('GET /api/designer/designs - designerId:', designerId, 'designId:', designId);

    if (!designerId && !designId) {
      return NextResponse.json(
        { success: false, error: 'Designer ID or Design ID required' },
        { status: 400 }
      );
    }

    connection = await getConnection();
    console.log('✅ Database connection acquired');

    let queryStr = '';
    let params: any[] = [];

    if (designId) {
      // Fetch single design
      queryStr = `SELECT id, title, description, category, tags, price, preview_image, 
                      figma_url, live_url, white_paper, white_paper_filename, 
                      instruction_doc, instruction_filename, status, rejection_reason, 
                      downloads, likes, views, revision_count, is_permanently_rejected,
                      created_at, updated_at, approved_at
               FROM designer_designs 
               WHERE id = ? AND designer_id = ?`;
      params = [designId, designerId];
    } else {
      // Fetch all designs for a designer
      queryStr = `SELECT id, title, description, category, tags, price, preview_image, 
                      figma_url, live_url, status, rejection_reason, 
                      downloads, likes, views, revision_count, is_permanently_rejected,
                      created_at, updated_at
               FROM designer_designs 
               WHERE designer_id = ? 
               ORDER BY created_at DESC 
               LIMIT 50`;  // ✅ Added limit for performance
      params = [designerId];
    }

    const [rows] = await connection.execute(queryStr, params);
    const designs = rows as any[];

    // Process each design
    for (const design of designs) {
      // Parse tags
      if (design.tags && typeof design.tags === 'string') {
        try {
          design.tags = JSON.parse(design.tags);
        } catch {
          design.tags = [];
        }
      } else if (!design.tags) {
        design.tags = [];
      }
      
      // Convert tinyint to boolean
      if (design.is_permanently_rejected !== undefined) {
        design.is_permanently_rejected = design.is_permanently_rejected === 1 || design.is_permanently_rejected === true;
      }
      
      // Set default revision count
      if (design.revision_count === null || design.revision_count === undefined) {
        design.revision_count = 0;
      }
      
      // Remove document fields from list view
      if (!designId) {
        delete design.white_paper;
        delete design.white_paper_filename;
        delete design.instruction_doc;
        delete design.instruction_filename;
      }
    }

    return NextResponse.json({
      success: true,
      designs: designs,
      count: designs.length
    });

  } catch (error) {
    console.error('Fetch designs error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch designs' },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
      console.log('🔌 GET connection released');
    }
  }
}

// PUT - Update design (for resubmit)
export async function PUT(request: NextRequest) {
  let connection;
  
  try {
    console.log('📥 PUT request received at /api/designer/designs');
    
    let body;
    try {
      body = await request.json();
      console.log('📥 Raw body:', JSON.stringify(body, null, 2));
    } catch (parseError) {
      console.error('❌ Failed to parse JSON body:', parseError);
      return NextResponse.json(
        { success: false, error: 'Invalid JSON body' },
        { status: 400 }
      );
    }
    
    const { 
      id, designer_id, title, description, category, price, tags, 
      figma_url, live_url, preview_image, status 
    } = body;

    console.log('📥 Parsed values:');
    console.log('  - id:', id, 'type:', typeof id);
    console.log('  - designer_id:', designer_id, 'type:', typeof designer_id);
    console.log('  - title:', title);
    console.log('  - status:', status);

    if (!id || !designer_id) {
      console.error('❌ Missing required fields: id or designer_id');
      return NextResponse.json(
        { success: false, error: 'Design ID and Designer ID are required' },
        { status: 400 }
      );
    }

    connection = await getConnection();
    console.log('✅ Database connection acquired');

    // First check if design exists and is not permanently rejected
    const [existing] = await connection.execute(
      `SELECT id, is_permanently_rejected, status, revision_count 
       FROM designer_designs 
       WHERE id = ? AND designer_id = ?`,
      [id, designer_id]
    );

    const existingDesign = (existing as any[])[0];
    
    if (!existingDesign) {
      console.error('❌ Design not found:', id, designer_id);
      return NextResponse.json(
        { success: false, error: 'Design not found' },
        { status: 404 }
      );
    }

    console.log('✅ Design found:', {
      id: existingDesign.id,
      is_permanently_rejected: existingDesign.is_permanently_rejected,
      status: existingDesign.status
    });

    if (existingDesign.is_permanently_rejected) {
      console.error('❌ Design is permanently rejected');
      return NextResponse.json(
        { success: false, error: 'Cannot update permanently rejected design' },
        { status: 400 }
      );
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];

    if (title !== undefined) { updates.push('title = ?'); values.push(title); }
    if (description !== undefined) { updates.push('description = ?'); values.push(description); }
    if (category !== undefined) { updates.push('category = ?'); values.push(category); }
    if (price !== undefined) { updates.push('price = ?'); values.push(price); }
    if (tags !== undefined) { 
      updates.push('tags = ?'); 
      values.push(typeof tags === 'string' ? tags : JSON.stringify(tags));
    }
    if (figma_url !== undefined) { updates.push('figma_url = ?'); values.push(figma_url); }
    if (live_url !== undefined) { updates.push('live_url = ?'); values.push(live_url); }
    if (preview_image !== undefined) { updates.push('preview_image = ?'); values.push(preview_image); }
    if (status !== undefined) { updates.push('status = ?'); values.push(status); }
    
    updates.push('updated_at = NOW()');
    values.push(id);
    values.push(designer_id);

    console.log('📝 Executing update...');

    await connection.execute(
      `UPDATE designer_designs SET ${updates.join(', ')} WHERE id = ? AND designer_id = ?`,
      values
    );

    console.log('✅ Update executed successfully');

    // If status changed to pending, clear rejection reason
    if (status === 'pending') {
      await connection.execute(
        `UPDATE designer_designs 
         SET rejection_reason = NULL 
         WHERE id = ? AND designer_id = ?`,
        [id, designer_id]
      );
      console.log('✅ Cleared rejection reason');
    }

    return NextResponse.json({
      success: true,
      message: 'Design updated successfully'
    });

  } catch (error) {
    console.error('❌ Update design error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update design' },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
      console.log('🔌 PUT connection released');
    }
  }
}

// DELETE - Delete design
export async function DELETE(request: NextRequest) {
  let connection;
  
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const designerId = searchParams.get('designerId');

    if (!id || !designerId) {
      return NextResponse.json(
        { success: false, error: 'Design ID and Designer ID required' },
        { status: 400 }
      );
    }

    const designId = parseInt(id);
    const designerIdNum = parseInt(designerId);

    connection = await getConnection();
    console.log('✅ Database connection acquired for DELETE');

    // Delete design
    const [result] = await connection.execute(
      'DELETE FROM designer_designs WHERE id = ? AND designer_id = ?',
      [designId, designerIdNum]
    );

    const deleteResult = result as any;
    
    if (deleteResult.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Design not found' },
        { status: 404 }
      );
    }

    // Update designer's total_designs count
    await connection.execute(
      `UPDATE designers SET total_designs = total_designs - 1 WHERE id = ? AND total_designs > 0`,
      [designerIdNum]
    );

    return NextResponse.json({
      success: true,
      message: 'Design deleted successfully'
    });

  } catch (error) {
    console.error('Delete design error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete design' },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
      console.log('🔌 DELETE connection released');
    }
  }
}