// app/api/colleges/credentials/info/route.ts
import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
/* eslint-disable */
// DB pool
const pool = mysql.createPool({
  host:process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Query: Get template name by login email
    const [rows] = await pool.execute(
      `SELECT t.name AS template_name
       FROM college_credentials cc
       JOIN template_requests tr ON cc.template_request_id = tr.id
       JOIN templates t ON tr.template_id = t.id
       WHERE cc.login_email = ?`,
      [email]
    );

    if ((rows as any).length === 0) {
      return NextResponse.json({ error: 'No template found for this email' }, { status: 404 });
    }

    return NextResponse.json((rows as any)[0]);
  } catch (err: any) {
    console.error('Error fetching template info:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
