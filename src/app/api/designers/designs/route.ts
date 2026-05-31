/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/designer/designs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

// POST - Upload new design
export async function POST(request: NextRequest) {
  let connection;
  
  try {
    const body = await request.json();
    const { 
      designer_id, 
      title, 
      description, 
      category, 
      tags, 
      price, 
      preview_image, 
      figma_url, 
      live_url, 
      status 
    } = body;

    if (!designer_id || !title || !description || !category || !price || !preview_image || !live_url) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, description, category, price, preview_image, and live_url are required' },
        { status: 400 }
      );
    }

    connection = await getConnection();

    const [result] = await connection.execute(
      `INSERT INTO designer_designs 
       (designer_id, title, description, category, tags, price, preview_image, 
        figma_url, live_url, white_paper, white_paper_filename, 
        instruction_doc, instruction_filename, status, 
        revision_count, max_revisions, is_permanently_rejected, current_version,
        created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL, NULL, NULL, ?, 0, 3, FALSE, 1, NOW(), NOW())`,
      [
        designer_id, 
        title, 
        description, 
        category, 
        tags || null, 
        price, 
        preview_image, 
        figma_url || null, 
        live_url,
        status || 'pending'
      ]
    );

    await connection.execute(
      `UPDATE designers SET total_designs = total_designs + 1 WHERE id = ?`,
      [designer_id]
    );

    return NextResponse.json({
      success: true,
      message: 'Design uploaded successfully. White paper can be uploaded after approval.',
      designId: (result as any).insertId
    });

  } catch (error) {
    console.error('Upload design error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload design' },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}

// GET - Fetch designer's designs
export async function GET(request: NextRequest) {
  let connection;
  
  try {
    const searchParams = request.nextUrl.searchParams;
    const designerId = searchParams.get('designerId');
    const designId = searchParams.get('designId');

    if (!designerId && !designId) {
      return NextResponse.json(
        { success: false, error: 'Designer ID or Design ID required' },
        { status: 400 }
      );
    }

    connection = await getConnection();

    let query = '';
    let params: any[] = [];

    if (designId) {
      query = `SELECT id, title, description, category, tags, price, preview_image, figma_url, live_url, 
                      white_paper, white_paper_filename, instruction_doc, instruction_filename,
                      status, rejection_reason, downloads, likes, views, 
                      revision_count, is_permanently_rejected,
                      created_at, updated_at
               FROM designer_designs 
               WHERE id = ?`;
      params = [designId];
    } else {
      query = `SELECT id, title, description, category, tags, price, preview_image, figma_url, live_url, 
                      status, rejection_reason, downloads, likes, views, 
                      revision_count, is_permanently_rejected,
                      created_at, updated_at
               FROM designer_designs 
               WHERE designer_id = ? 
               ORDER BY created_at DESC`;
      params = [designerId];
    }

    const [rows] = await connection.execute(query, params);

    const processedRows = (rows as any[]).map(row => {
      if (row.tags && typeof row.tags === 'string') {
        try {
          row.tags = JSON.parse(row.tags);
        } catch {
          row.tags = [];
        }
      }
      if (row.is_permanently_rejected !== undefined) {
        row.is_permanently_rejected = row.is_permanently_rejected === 1 || row.is_permanently_rejected === true;
      }
      if (row.revision_count === null || row.revision_count === undefined) {
        row.revision_count = 0;
      }
      if (!designId) {
        delete row.white_paper;
        delete row.white_paper_filename;
        delete row.instruction_doc;
        delete row.instruction_filename;
      }
      return row;
    });

    return NextResponse.json({
      success: true,
      designs: processedRows,
      count: processedRows.length
    });

  } catch (error) {
    console.error('Fetch designs error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch designs' },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}

// PUT - Update design
export async function PUT(request: NextRequest) {
  let connection;
  
  try {
    const body = await request.json();
    const { 
      id, 
      designer_id,
      title, 
      description, 
      category, 
      tags, 
      price, 
      preview_image, 
      figma_url, 
      live_url,
      white_paper,
      white_paper_filename,
      instruction_doc,
      instruction_filename,
      status 
    } = body;

    if (!id || !designer_id) {
      return NextResponse.json(
        { success: false, error: 'Design ID and Designer ID required' },
        { status: 400 }
      );
    }

    connection = await getConnection();

    const updates: string[] = [];
    const values: any[] = [];

    if (title) { updates.push('title = ?'); values.push(title); }
    if (description) { updates.push('description = ?'); values.push(description); }
    if (category) { updates.push('category = ?'); values.push(category); }
    if (tags) { updates.push('tags = ?'); values.push(tags); }
    if (price) { updates.push('price = ?'); values.push(price); }
    if (preview_image) { updates.push('preview_image = ?'); values.push(preview_image); }
    if (figma_url !== undefined) { updates.push('figma_url = ?'); values.push(figma_url); }
    if (live_url) { updates.push('live_url = ?'); values.push(live_url); }
    if (white_paper) { updates.push('white_paper = ?'); values.push(white_paper); }
    if (white_paper_filename) { updates.push('white_paper_filename = ?'); values.push(white_paper_filename); }
    if (instruction_doc !== undefined) { updates.push('instruction_doc = ?'); values.push(instruction_doc); }
    if (instruction_filename !== undefined) { updates.push('instruction_filename = ?'); values.push(instruction_filename); }
    if (status) { updates.push('status = ?'); values.push(status); }
    
    updates.push('updated_at = NOW()');
    values.push(id);
    values.push(designer_id);

    await connection.execute(
      `UPDATE designer_designs SET ${updates.join(', ')} WHERE id = ? AND designer_id = ?`,
      values
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
    if (connection) connection.release();
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

    connection = await getConnection();

    const [result] = await connection.execute(
      'DELETE FROM designer_designs WHERE id = ? AND designer_id = ?',
      [id, designerId]
    );

    const deleteResult = result as any;
    
    if (deleteResult.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Design not found' },
        { status: 404 }
      );
    }

    await connection.execute(
      `UPDATE designers SET total_designs = total_designs - 1 WHERE id = ? AND total_designs > 0`,
      [designerId]
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
    if (connection) connection.release();
  }
}