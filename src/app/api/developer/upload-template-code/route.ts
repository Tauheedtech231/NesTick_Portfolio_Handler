/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/developer/upload-template-code/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import { getConnection } from '@/lib/db';

const STORAGE_BASE = process.env.STORAGE_PATH || '/storage';

export async function POST(request: NextRequest) {
  let connection;
  
  try {
    const body = await request.json();
    const { 
      assignmentId, 
      developerId, 
      templateName, 
      templateDescription, 
      templateType,
      liveUrl,
      whitePaper,
      whitePaperFileName,
      fullTemplateFile,
      fullTemplateFileName,
      sections,
      existingTemplateId
    } = body;

    if (!assignmentId || !developerId || !templateName) {
      return NextResponse.json({ 
        success: false, 
        error: 'Assignment ID, Developer ID, and Template Name are required' 
      }, { status: 400 });
    }

    if (!liveUrl) {
      return NextResponse.json({ 
        success: false, 
        error: 'Live Demo URL is required' 
      }, { status: 400 });
    }

    connection = await getConnection();
    console.log('✅ Upload template connection acquired');

    // Get assignment details with preview image
    const [assignments] = await connection.execute(
      `SELECT da.*, dd.title, dd.description, da.preview_image_url as template_image
       FROM developer_assignments da
       LEFT JOIN designer_designs dd ON da.design_id = dd.id
       WHERE da.id = ? AND da.developer_id = ? AND da.status = 'approved'`,
      [assignmentId, developerId]
    );

    const assignment = (assignments as any[])[0];
    if (!assignment) {
      return NextResponse.json({ 
        success: false, 
        error: 'Assignment not found or not approved' 
      }, { status: 404 });
    }

    const templateImage = assignment.template_image || assignment.preview_image_url || '';
    let templateId = existingTemplateId;

    // Check if template already exists
    if (templateId) {
      // Update existing template
      console.log(`📝 Updating existing template ${templateId}`);
      
      await connection.execute(
        `UPDATE templates 
         SET name = ?, description = ?, image = ?, live_url = ?, type = ?, updated_at = NOW()
         WHERE id = ? AND assignment_id = ?`,
        [templateName, templateDescription, templateImage, liveUrl, templateType, templateId, assignmentId]
      );

      // Update white paper if provided
      if (whitePaper && whitePaperFileName) {
        const whitePaperFolder = path.join(STORAGE_BASE, 'templates', `template_${templateId}`);
        await mkdir(whitePaperFolder, { recursive: true });
        
        const whitePaperPath = path.join(whitePaperFolder, 'whitepaper.pdf');
        const base64Data = whitePaper.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');
        await writeFile(whitePaperPath, buffer);
        
        await connection.execute(
          `UPDATE templates SET white_paper_path = ?, white_paper_filename = ? WHERE id = ?`,
          [whitePaperPath, whitePaperFileName, templateId]
        );
      }
    } else {
      // Create new template
      console.log('📝 Creating new template');
      
      const [templateResult] = await connection.execute(
        `INSERT INTO templates (name, description, image, live_url, type, developer_id, assignment_id, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'active')`,
        [templateName, templateDescription, templateImage, liveUrl, templateType, developerId, assignmentId]
      );

      templateId = (templateResult as any).insertId;
      const templateFolder = path.join(STORAGE_BASE, 'templates', `template_${templateId}`);
      await mkdir(templateFolder, { recursive: true });

      // Save white paper if provided
      if (whitePaper && whitePaperFileName) {
        const whitePaperPath = path.join(templateFolder, 'whitepaper.pdf');
        const base64Data = whitePaper.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');
        await writeFile(whitePaperPath, buffer);
        
        await connection.execute(
          `UPDATE templates SET white_paper_path = ?, white_paper_filename = ? WHERE id = ?`,
          [whitePaperPath, whitePaperFileName, templateId]
        );
      }
    }

    const templateFolder = path.join(STORAGE_BASE, 'templates', `template_${templateId}`);

    // Handle full template ZIP
    if (fullTemplateFile && fullTemplateFileName) {
      // Delete old ZIP if exists
      const [oldTemplate] = await connection.execute(
        `SELECT template_zip_path FROM templates WHERE id = ?`,
        [templateId]
      );
      if ((oldTemplate as any[])[0]?.template_zip_path) {
        try {
          await unlink((oldTemplate as any[])[0].template_zip_path);
        } catch (e) {
          console.log('Old ZIP file not found, skipping delete');
        }
      }

      const base64Data = fullTemplateFile.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');
      const filePath = path.join(templateFolder, 'template.zip');
      await writeFile(filePath, buffer);

      await connection.execute(
        `UPDATE templates SET template_zip_path = ?, template_zip_filename = ? WHERE id = ?`,
        [filePath, fullTemplateFileName, templateId]
      );

      // Record upload
      await connection.execute(
        `INSERT INTO developer_uploads (assignment_id, developer_id, template_id, upload_type, file_name, storage_path, file_size)
         VALUES (?, ?, ?, 'full_template', ?, ?, ?)`,
        [assignmentId, developerId, templateId, fullTemplateFileName, filePath, buffer.length]
      );
    }

    // Handle sections
    const sectionsFolder = path.join(STORAGE_BASE, 'sections', `template_${templateId}`);
    await mkdir(sectionsFolder, { recursive: true });

    for (const section of sections) {
      if (section.file) {
        // New or updated section
        const sectionFolder = path.join(sectionsFolder, section.section_key);
        await mkdir(sectionFolder, { recursive: true });
        
        // Delete old section file if exists
        if (section.id) {
          const [oldSection] = await connection.execute(
            `SELECT storage_path FROM template_sections WHERE id = ?`,
            [section.id]
          );
          if ((oldSection as any[])[0]?.storage_path) {
            try {
              await unlink((oldSection as any[])[0].storage_path);
            } catch (e) {
              console.log('Old section file not found, skipping delete');
            }
          }
        }
        
        const base64Data = section.file.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');
        const version = section.id ? 2 : 1; // Increment version for updates
        const filePath = path.join(sectionFolder, `v${version}.zip`);
        await writeFile(filePath, buffer);

        if (section.id) {
          // Update existing section
          await connection.execute(
            `UPDATE template_sections 
             SET file_name = ?, storage_path = ?, version = ?, updated_at = NOW()
             WHERE id = ?`,
            [section.fileName, filePath, version, section.id]
          );
        } else {
          // Insert new section
          await connection.execute(
            `INSERT INTO template_sections (template_id, assignment_id, section_name, section_key, file_name, storage_path, version, uploaded_by)
             VALUES (?, ?, ?, ?, ?, ?, 1, ?)`,
            [templateId, assignmentId, section.section_name, section.section_key, section.fileName, filePath, developerId]
          );
        }
      } else if (section.keepExisting && section.id) {
        // Section exists but no new file - keep as is (do nothing)
        console.log(`Keeping existing section: ${section.section_name}`);
      }
    }

    // Update developer_assignments submission_url if liveUrl changed
    if (liveUrl !== assignment.submission_url) {
      await connection.execute(
        `UPDATE developer_assignments SET submission_url = ? WHERE id = ?`,
        [liveUrl, assignmentId]
      );
    }

    console.log(`✅ Template ${templateId} processed successfully`);

    return NextResponse.json({
      success: true,
      message: existingTemplateId ? 'Template code updated successfully' : 'Template code uploaded successfully',
      templateId: templateId
    });

  } catch (error) {
    console.error('Upload template error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to upload template code' 
    }, { status: 500 });
  } finally {
    if (connection) {
      connection.release();
      console.log('🔌 Upload connection released');
    }
  }
}