/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/developer/get-template-code/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET(request: NextRequest) {
  let connection;
  
  try {
    const searchParams = request.nextUrl.searchParams;
    const assignmentId = searchParams.get('assignmentId');
    const developerId = searchParams.get('developerId');

    if (!assignmentId || !developerId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Assignment ID and Developer ID required' 
      }, { status: 400 });
    }

    connection = await getConnection();
    console.log('✅ Get template code connection acquired');

    // ✅ Added github_url to SELECT query
    const [templates] = await connection.execute(
      `SELECT id, name, description, image, live_url, github_url, type, 
              template_zip_path, template_zip_filename,
              white_paper_path, white_paper_filename,
              developer_id, assignment_id, status
       FROM templates 
       WHERE assignment_id = ? AND developer_id = ?`,
      [assignmentId, developerId]
    );

    if ((templates as any[]).length === 0) {
      return NextResponse.json({ 
        success: true, 
        data: null 
      });
    }

    const template = (templates as any[])[0];

    // Get sections
    let sections = [];
    try {
      const [sectionRows] = await connection.execute(
        `SELECT id, section_name, section_key, file_name, storage_path, version
         FROM template_sections 
         WHERE template_id = ? AND assignment_id = ?`,
        [template.id, assignmentId]
      );
      sections = sectionRows as any[];
    } catch (err) {
      console.log('template_sections table not found');
      sections = [];
    }

    return NextResponse.json({
      success: true,
      data: {
        templateId: template.id,
        templateName: template.name,
        templateDescription: template.description,
        templateType: template.type,
        liveUrl: template.live_url,
        githubUrl: template.github_url,  // ✅ Added GitHub URL
        templateZipPath: template.template_zip_path,
        templateZipFileName: template.template_zip_filename,
        whitePaper: template.white_paper_path,
        whitePaperFileName: template.white_paper_filename,
        sections: sections
      }
    });

  } catch (error) {
    console.error('Get template code error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch template code',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    if (connection) {
      connection.release();
      console.log('🔌 Get template code connection released');
    }
  }
}