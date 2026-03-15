import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
/* eslint-disable */

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  ssl: {
    rejectUnauthorized: false
  }
};

export async function GET(request: NextRequest) {
  let connection;

  try {
    connection = await mysql.createConnection(dbConfig);

    // ✅ FIXED: LEFT JOIN use kiya hai taake saare credentials show hon
    const query = `
      SELECT
        cc.id AS credential_id,
        cc.template_request_id,
        cc.login_email,
        cc.password_hash,
        cc.sent_at,
        cc.created_at AS credential_created_at,
        cc.updated_at AS credential_updated_at,

        -- Template Request details (LEFT JOIN)
        tr.id AS request_id,
        tr.type AS request_type,
        tr.plan AS request_plan,
        tr.status AS request_status,
        tr.submitted_at AS request_submitted_at,
        tr.name AS requester_name,
        tr.college AS requester_college,
        tr.email AS requester_email,
        tr.phone AS requester_phone,

        -- Template details (LEFT JOIN)
        t.id AS template_id,
        t.name AS template_name,
        t.description AS template_description,
        t.live_url AS template_live_url,
        t.image AS template_image,
        t.type AS template_type,

        -- College details (LEFT JOIN)
        c.id AS college_id,
        c.name AS college_name,
        c.email AS college_email,
        c.phone AS college_phone,
        c.website AS college_website,
        c.city AS college_city,
        c.country AS college_country,
        c.is_active AS college_is_active,
        c.created_at AS college_created_at,
        c.updated_at AS college_updated_at

      FROM college_credentials cc
      LEFT JOIN template_requests tr ON cc.template_request_id = tr.id
      LEFT JOIN colleges c ON cc.college_id = c.id
      LEFT JOIN templates t ON tr.template_id = t.id

      WHERE cc.sent_at IS NOT NULL
      ORDER BY cc.sent_at DESC
    `;

    const [rows] = await connection.execute(query);
    
    console.log('Raw credentials from DB:', rows); // Debug ke liye

    const credentials = (rows as any[]).map(row => ({
      template_request_id: row.template_request_id,
      credential_id: row.credential_id,
      
      // Template details (null handle kiya)
      template_name: row.template_name || 'Unknown Template',
      template_type: row.template_type || row.request_type || 'unknown',
      template_description: row.template_description || '',
      template_live_url: row.template_live_url || '',
      template_image: row.template_image || '',
      
      // College details (null handle kiya)
      college_id: row.college_id || 0,
      college_name: row.college_name || row.requester_college || 'Unknown College',
      college_email: row.college_email || row.login_email || '',
      college_phone: row.college_phone || row.requester_phone || '',
      college_website: row.college_website || '',
      college_city: row.college_city || '',
      college_country: row.college_country || '',
      
      // Request details
      requester_name: row.requester_name || '',
      requester_college: row.requester_college || '',
      requester_email: row.requester_email || '',
      requester_phone: row.requester_phone || '',
      plan: row.request_plan || 'basic',
      request_type: row.request_type || 'free',
      request_status: row.request_status || 'approved',
      
      // Credentials
      login_email: row.login_email || row.college_email || row.requester_email || '',
      password_hash: row.password_hash || '',
      password_visible: '', // Frontend is expecting this
      sent_at: row.sent_at || new Date().toISOString(),
      is_active: row.college_is_active === 1 ? true : false,
      
      // Metadata
      template_id: row.template_id || 0,
      request_id: row.request_id || row.template_request_id
    }));

    console.log('Formatted credentials:', credentials); // Debug ke liye

    return NextResponse.json({
      success: true,
      message: 'Credentials fetched successfully',
      count: credentials.length,
      credentials: credentials  // ✅ Frontend 'credentials' key expect kar raha hai
    });

  } catch (error: any) {
    console.error('Error fetching credentials:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch credentials',
        error: error.message,
        credentials: []  // Empty array return karo
      },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}