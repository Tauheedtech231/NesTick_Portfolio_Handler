/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/developer/upload-template-code/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, unlink, readdir, readFile } from 'fs/promises';
import path from 'path';
import { getConnection } from '@/lib/db';
import AdmZip from 'adm-zip';

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
      githubUrl,
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

    if (!githubUrl) {
      return NextResponse.json({ 
        success: false, 
        error: 'GitHub Repository URL is required' 
      }, { status: 400 });
    }

    if (!githubUrl.includes('github.com')) {
      return NextResponse.json({ 
        success: false, 
        error: 'Please enter a valid GitHub repository URL' 
      }, { status: 400 });
    }

    connection = await getConnection();
    console.log('✅ Upload template connection acquired');

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

    if (templateId) {
      console.log(`📝 Updating existing template ${templateId}`);
      
      await connection.execute(
        `UPDATE templates 
         SET name = ?, description = ?, image = ?, live_url = ?, github_url = ?, type = ?, updated_at = NOW()
         WHERE id = ? AND assignment_id = ?`,
        [templateName, templateDescription, templateImage, liveUrl, githubUrl, templateType, templateId, assignmentId]
      );

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
      console.log('📝 Creating new template');
      
      const [templateResult] = await connection.execute(
        `INSERT INTO templates (name, description, image, live_url, github_url, type, developer_id, assignment_id, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
        [templateName, templateDescription, templateImage, liveUrl, githubUrl, templateType, developerId, assignmentId]
      );

      templateId = (templateResult as any).insertId;
      const templateFolder = path.join(STORAGE_BASE, 'templates', `template_${templateId}`);
      await mkdir(templateFolder, { recursive: true });

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

    // ✅ Handle full template ZIP with AUTO-EXTRACT
    if (fullTemplateFile && fullTemplateFileName) {
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

      // ✅ AUTO-EXTRACT ZIP
      console.log(`📦 Extracting ZIP: ${filePath}`);
      const zip = new AdmZip(filePath);
      const extractPath = path.join(templateFolder, 'extracted');
      zip.extractAllTo(extractPath, true);
      console.log(`✅ Extracted to: ${extractPath}`);

      // ✅ Move HTML files from extracted/out to sections folder
      const outPath = path.join(extractPath, 'out');
      const sectionsPath = path.join(templateFolder, 'sections');
      await mkdir(sectionsPath, { recursive: true });

      try {
        const files = await readdir(outPath);
        for (const file of files) {
          if (file.endsWith('.html')) {
            const srcPath = path.join(outPath, file);
            const destPath = path.join(sectionsPath, file);
            await writeFile(destPath, await readFile(srcPath, 'utf8'));
            console.log(`📄 Moved: ${file} → sections/`);
          }
        }
      } catch (err) {
        console.log('No "out" folder found, checking root...');
        const files = await readdir(extractPath);
        for (const file of files) {
          if (file.endsWith('.html')) {
            const srcPath = path.join(extractPath, file);
            const destPath = path.join(sectionsPath, file);
            await writeFile(destPath, await readFile(srcPath, 'utf8'));
            console.log(`📄 Moved: ${file} → sections/`);
          }
        }
      }

      // ✅ Clean up extracted folder
      await unlink(filePath); // Delete original ZIP? Keep it? Let's keep it.
      // await rm(extractPath, { recursive: true, force: true });

      await connection.execute(
        `UPDATE templates SET template_zip_path = ?, template_zip_filename = ? WHERE id = ?`,
        [filePath, fullTemplateFileName, templateId]
      );

      await connection.execute(
        `INSERT INTO developer_uploads (assignment_id, developer_id, template_id, upload_type, file_name, storage_path, file_size)
         VALUES (?, ?, ?, 'full_template', ?, ?, ?)`,
        [assignmentId, developerId, templateId, fullTemplateFileName, filePath, buffer.length]
      );
    }

    // Handle sections (individual uploads)
    const sectionsFolder = path.join(STORAGE_BASE, 'sections', `template_${templateId}`);
    await mkdir(sectionsFolder, { recursive: true });

    for (const section of sections) {
      if (section.file) {
        const sectionFolder = path.join(sectionsFolder, section.section_key);
        await mkdir(sectionFolder, { recursive: true });
        
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
        const version = section.id ? 2 : 1;
        const filePath = path.join(sectionFolder, `v${version}.zip`);
        await writeFile(filePath, buffer);

        if (section.id) {
          await connection.execute(
            `UPDATE template_sections 
             SET file_name = ?, storage_path = ?, version = ?, updated_at = NOW()
             WHERE id = ?`,
            [section.fileName, filePath, version, section.id]
          );
        } else {
          await connection.execute(
            `INSERT INTO template_sections (template_id, assignment_id, section_name, section_key, file_name, storage_path, version, uploaded_by)
             VALUES (?, ?, ?, ?, ?, ?, 1, ?)`,
            [templateId, assignmentId, section.section_name, section.section_key, section.fileName, filePath, developerId]
          );
        }
      } else if (section.keepExisting && section.id) {
        console.log(`Keeping existing section: ${section.section_name}`);
      }
    }

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