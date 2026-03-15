// app/api/college/dashboard-data/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';

/* eslint-disable */

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const collegeId = searchParams.get('collegeId');

    if (!collegeId) {
      return NextResponse.json({ 
        success: false, 
        error: 'College ID is required' 
      }, { status: 400 });
    }

    const connection = await pool.getConnection();

    try {
      // ===========================================
      // 1. COLLEGE DETAILS
      // ===========================================
      
      const [collegeRows] = await connection.execute<RowDataPacket[]>(
        `SELECT 
          c.id,
          c.name,
          c.email,
          c.phone,
          c.website,
          c.city,
          c.country,
          c.is_active as status,
          t.id as template_id,
          t.name as template_name
         FROM colleges c
         LEFT JOIN templates t ON c.template_id = t.id
         WHERE c.id = ?`,
        [collegeId]
      );

      if (collegeRows.length === 0) {
        return NextResponse.json({ 
          success: false, 
          error: 'College not found' 
        }, { status: 404 });
      }

      const college = collegeRows[0];

      // ===========================================
      // 2. ACTIVE SECTIONS/MODULES from college_template_sections
      // ===========================================
      
      const [sectionRows] = await connection.execute<RowDataPacket[]>(
        `SELECT section_name, is_active 
         FROM college_template_sections 
         WHERE college_id = ? 
         ORDER BY id ASC`,
        [collegeId]
      );

      // Build modules object with all possible sections
      const modules = {
        about: false,
        faculty: false,
        events: false,
        gallery: false,
        achievements: false,
        courses: false,
        contact: false
      };

      // Default sections list
      const defaultSections = ['about', 'faculty', 'events', 'gallery', 'achievements', 'courses', 'contact'];
      
      // Agar koi sections nahi hain to default sab active kar do
      if (sectionRows.length === 0) {
        // Insert default sections for this college
        for (const section of defaultSections) {
          await connection.execute(
            `INSERT INTO college_template_sections (college_id, template_id, section_name, is_active) 
             VALUES (?, ?, ?, 1)`,
            [collegeId, college.template_id || 1, section]
          );
        }
        
        // Sab sections active kar do
        defaultSections.forEach(section => {
          modules[section as keyof typeof modules] = true;
        });
      } else {
        // Update modules based on active sections from database
        sectionRows.forEach(section => {
          const sectionName = section.section_name.toLowerCase();
          if (sectionName in modules) {
            modules[sectionName as keyof typeof modules] = section.is_active === 1;
          }
        });
      }

      // Active sections list for response
      const activeSectionsList = Object.keys(modules).filter(
        key => modules[key as keyof typeof modules]
      );

      // ===========================================
      // 3. ANNOUNCEMENTS from announcements table
      // ===========================================
      
      const [announcementRows] = await connection.execute<RowDataPacket[]>(
        `SELECT 
          id,
          title,
          message,
          college_id as targetCollege,
          created_at as createdAt
         FROM announcements 
         WHERE college_id = ? OR college_id IS NULL
         ORDER BY created_at DESC
         LIMIT 10`,
        [collegeId]
      );

      const announcements = announcementRows.map(row => ({
        id: row.id.toString(),
        title: row.title,
        message: row.message,
        targetCollege: row.targetCollege === null ? 'all' : row.targetCollege.toString(),
        createdAt: row.createdAt
      }));

      // ===========================================
      // 4. RETURN COMBINED RESPONSE
      // ===========================================

      return NextResponse.json({
        success: true,
        college: {
          id: college.id,
          name: college.name,
          email: college.email,
          phone: college.phone,
          website: college.website,
          city: college.city,
          country: college.country,
          status: college.status === 1 ? 'active' : 'inactive',
          template_id: college.template_id,
          template_name: college.template_name
        },
        modules: modules,
        active_sections: activeSectionsList,
        announcements: announcements,
        stats: {
          active_sections_count: activeSectionsList.length,
          announcements_count: announcements.length
        }
      });

    } catch (error) {
      console.error('Database query error:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to fetch dashboard data' 
      }, { status: 500 });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error?.message || 'Internal server error' 
    }, { status: 500 });
  }
}