/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/developer/assignments/route.ts (Complete updated file)

import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET(request: NextRequest) {
  let connection;
  
  try {
    const searchParams = request.nextUrl.searchParams;
    const developerId = searchParams.get('developerId');
    const id = searchParams.get('id');
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');

    if (!developerId) {
      return NextResponse.json({ success: false, error: 'Developer ID required' }, { status: 401 });
    }

    connection = await getConnection();
    console.log('✅ GET assignments connection acquired');

    let query = `
      SELECT 
        da.id,
        da.design_id,
        dd.title as design_title,
        dd.description as design_description,
        dd.preview_image as preview_image,
        dd.figma_url as figma_url,
        dd.white_paper as design_white_paper,
        dd.white_paper_filename as design_white_paper_filename,
        d.name as designer_name,
        da.status,
        da.assigned_at,
        da.deadline,
        da.notes,
        da.submission_url,
        da.submission_notes,
        da.review_notes,
        da.revision_count,
        da.is_permanently_rejected,
        da.approved_at
      FROM developer_assignments da
      LEFT JOIN designer_designs dd ON da.design_id = dd.id
      LEFT JOIN designers d ON dd.designer_id = d.id
      WHERE da.developer_id = ?
    `;
    const params: any[] = [developerId];

    if (id) {
      query += ' AND da.id = ?';
      params.push(parseInt(id));
    }
    if (status) {
      query += ' AND da.status = ?';
      params.push(status);
    }

    query += ' ORDER BY da.assigned_at DESC';
    
    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit));
    }

    const [rows] = await connection.execute(query, params);

    // Transform response to match frontend expected fields
    const transformedRows = (rows as any[]).map(row => ({
      id: row.id,
      design_id: row.design_id,
      design_title: row.design_title,
      design_description: row.design_description,
      designer_name: row.designer_name,
      preview_image: row.preview_image,
      figma_url: row.figma_url,
      status: row.status,
      assigned_at: row.assigned_at,
      deadline: row.deadline,
      notes: row.notes,
      submission_url: row.submission_url,
      submission_notes: row.submission_notes,
      review_notes: row.review_notes,
      revision_count: row.revision_count || 0,
      is_permanently_rejected: row.is_permanently_rejected === 1 || row.is_permanently_rejected === true,
      approved_at: row.approved_at,
      // White paper from designer (for developer to reference)
      white_paper: row.design_white_paper,
      white_paper_filename: row.design_white_paper_filename
    }));

    return NextResponse.json({
      success: true,
      data: transformedRows,
      count: transformedRows.length
    });

  } catch (error) {
    console.error('Assignments API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  } finally {
    if (connection) {
      connection.release();
      console.log('🔌 GET assignments connection released');
    }
  }
}

export async function PUT(request: NextRequest) {
  let connection;
  
  try {
    const body = await request.json();
    const { id, status, developerId, submission_url, submission_notes } = body;

    if (!id || !status || !developerId) {
      return NextResponse.json({ success: false, error: 'ID, status and developerId required' }, { status: 400 });
    }

    connection = await getConnection();
    console.log('✅ PUT assignment connection acquired');

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];

    updates.push('status = ?');
    values.push(status);

    if (submission_url !== undefined) {
      updates.push('submission_url = ?');
      values.push(submission_url);
    }

    if (submission_notes !== undefined) {
      updates.push('submission_notes = ?');
      values.push(submission_notes);
    }

    updates.push('updated_at = NOW()');
    values.push(id);
    values.push(developerId);

    await connection.execute(
      `UPDATE developer_assignments SET ${updates.join(', ')} WHERE id = ? AND developer_id = ?`,
      values
    );

    return NextResponse.json({
      success: true,
      message: 'Assignment updated successfully'
    });

  } catch (error) {
    console.error('Update assignment error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  } finally {
    if (connection) {
      connection.release();
      console.log('🔌 PUT assignment connection released');
    }
  }
}