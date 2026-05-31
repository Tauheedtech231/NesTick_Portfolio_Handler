// app/api/designers/approved-designs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const designerId = searchParams.get('designer_id');

    if (!designerId) {
      return NextResponse.json(
        { success: false, error: 'Designer ID is required' },
        { status: 400 }
      );
    }

    const designs = await query(
      `SELECT id, title, preview_image, status, 
              white_paper, white_paper_filename,
              instruction_doc, instruction_filename,
              approved_at
       FROM designer_designs 
       WHERE designer_id = ? AND status = 'approved'
       ORDER BY approved_at DESC, id DESC`,
      [designerId]
    ) as any[];

    // Process the designs
    const processedDesigns = designs.map(design => ({
      id: design.id,
      title: design.title,
      preview_image: design.preview_image,
      status: design.status,
      white_paper: design.white_paper,
      white_paper_filename: design.white_paper_filename,
      instruction_doc: design.instruction_doc,
      instruction_filename: design.instruction_filename,
      approved_at: design.approved_at,
      has_white_paper: !!design.white_paper,
      has_instruction_doc: !!design.instruction_doc
    }));

    return NextResponse.json({
      success: true,
      designs: processedDesigns,
      count: processedDesigns.length
    });

  } catch (error) {
    console.error('Error fetching approved designs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch approved designs' },
      { status: 500 }
    );
  }
}