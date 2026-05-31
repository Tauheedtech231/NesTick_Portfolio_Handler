/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/designers/designs/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

// ✅ GET - Fetch single design by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let connection;
  
  try {
    const { id } = await params;
    const designId = parseInt(id);
    
    console.log('GET /api/designers/designs/[id] - Design ID:', designId);
    
    if (isNaN(designId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid design ID' },
        { status: 400 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const designerId = searchParams.get('designerId');

    console.log('Designer ID from query:', designerId);

    if (!designerId) {
      return NextResponse.json(
        { success: false, error: 'Designer ID is required' },
        { status: 400 }
      );
    }

    connection = await getConnection();
    console.log('✅ GET connection acquired');

    const [rows] = await connection.execute(
      `SELECT id, title, description, category, tags, price, preview_image, 
              figma_url, live_url, white_paper, white_paper_filename, 
              instruction_doc, instruction_filename, status, rejection_reason, 
              downloads, likes, views, revision_count, is_permanently_rejected,
              created_at, updated_at, approved_at
       FROM designer_designs 
       WHERE id = ? AND designer_id = ?`,
      [designId, designerId]
    );

    const designs = rows as any[];
    
    console.log('Found designs:', designs.length);
    
    if (designs.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Design not found' },
        { status: 404 }
      );
    }

    // Parse tags if needed
    const design = designs[0];
    if (design.tags && typeof design.tags === 'string') {
      try {
        design.tags = JSON.parse(design.tags);
      } catch {
        design.tags = [];
      }
    }
    
    // Convert tinyint to boolean
    if (design.is_permanently_rejected !== undefined) {
      design.is_permanently_rejected = design.is_permanently_rejected === 1 || design.is_permanently_rejected === true;
    }
    
    // Set default revision count
    if (design.revision_count === null || design.revision_count === undefined) {
      design.revision_count = 0;
    }

    return NextResponse.json({
      success: true,
      designs: [design],
      count: 1
    });

  } catch (error) {
    console.error('Fetch single design error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch design' },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
      console.log('🔌 GET connection released');
    }
  }
}

// PUT - Update design
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let connection;
  
  try {
    const { id } = await params;
    const designId = parseInt(id);
    const body = await request.json();
    const { title, description, category, price, tags, figma_url, live_url } = body;

    connection = await getConnection();
    console.log('✅ PUT connection acquired');

    await connection.execute(
      `UPDATE designer_designs 
       SET title = ?, description = ?, category = ?, price = ?, tags = ?, 
           figma_url = ?, live_url = ?, updated_at = NOW()
       WHERE id = ?`,
      [title, description, category, price, JSON.stringify(tags), figma_url, live_url, designId]
    );

    return NextResponse.json({
      success: true,
      message: 'Design updated successfully'
    });

  } catch (error) {
    console.error('Update design error:', error);
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
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let connection;
  
  try {
    const { id } = await params;
    const designId = parseInt(id);

    connection = await getConnection();
    console.log('✅ DELETE connection acquired');

    // First get designer_id to update count
    const [designRows] = await connection.execute(
      'SELECT designer_id FROM designer_designs WHERE id = ?',
      [designId]
    );
    const design = (designRows as any[])[0];

    if (design) {
      // Delete design
      await connection.execute('DELETE FROM designer_designs WHERE id = ?', [designId]);
      
      // Update designer's total_designs count
      await connection.execute(
        'UPDATE designers SET total_designs = total_designs - 1 WHERE id = ?',
        [design.designer_id]
      );
    }

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