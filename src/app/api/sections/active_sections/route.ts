// app/api/college/sections/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
/* eslint-disable */
const pool = mysql.createPool({
  host: "72.61.117.188",
  user: "portfolio_user",
  password: "StrongPass123!",
  database: "portfolio_handler_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get('email');
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

    // 1️⃣ Get college_id & template_id from credentials
    const [credRows] = await pool.execute(
      `SELECT college_id, template_id 
       FROM college_credentials cc
       JOIN template_requests tr ON cc.template_request_id = tr.id
       WHERE cc.login_email = ?`,
      [email]
    );

    const creds = (credRows as any[])[0];
    if (!creds) return NextResponse.json({ error: 'Credentials not found' }, { status: 404 });

    const { college_id, template_id } = creds;

    // 2️⃣ Get all sections for this template
    const [templateSectionsRows] = await pool.execute(
      `SELECT section_name FROM portfolio_sections WHERE template_id = ?`,
      [template_id]
    );

    const templateSections = (templateSectionsRows as any[]).map(s => s.section_name);

    // 3️⃣ Get college-specific section enable/disable
    const [collegeSectionsRows] = await pool.execute(
      `SELECT section_name, is_active 
       FROM college_template_sections 
       WHERE college_id = ? AND template_id = ?`,
      [college_id, template_id]
    );

    const collegeSectionsMap: Record<string, boolean> = {};
    (collegeSectionsRows as any[]).forEach(s => {
      collegeSectionsMap[s.section_name] = s.is_active === 1;
    });

    // 4️⃣ Build final active sections list
    const sections = templateSections.map(name => ({
      name,
      is_active: collegeSectionsMap[name] ?? true // default active if not set
    }));

    return NextResponse.json({ sections, template_id, college_id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch sections' }, { status: 500 });
  }
}
